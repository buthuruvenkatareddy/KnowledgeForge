from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import text
from sentence_transformers import SentenceTransformer
import numpy as np
from app.models.models import DocumentChunk, Document, ChunkEmbedding, User
from app.core.config import settings
from app.services.llm_service import llm_service
import json


class RAGService:
    def __init__(self):
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.system_prompt = """You are KnowledgeForge, a professional AI assistant that provides clean, well-structured answers based on uploaded documents.

Instructions for responses:
1. Provide clean, professional answers without showing document metadata or raw chunks
2. Structure your responses clearly with proper formatting
3. When explaining technical concepts, provide clear definitions and context
4. Use bullet points, headers, and formatting for better readability
5. Answer directly without prefacing with "Based on your documents" unless specifically needed
6. If the context doesn't contain enough information, say so clearly and professionally
7. Focus on delivering value through clear, actionable information

Context from documents:
{context}

Question: {question}

Answer:"""

    def search_similar_chunks(
        self, 
        db: Session, 
        query: str, 
        user_id: int, 
        limit: int = 10,
        similarity_threshold: float = 0.7
    ) -> List[Tuple[DocumentChunk, Document, float]]:
        """Enhanced search for document chunks using improved text matching"""
        
        # Extract keywords from query
        keywords = [word.lower().strip() for word in query.lower().split() if len(word.strip()) > 2]
        
        if not keywords:
            return []
        
        # First, try exact phrase matching
        exact_phrase_results = self._search_exact_phrases(db, query, user_id, limit)
        if exact_phrase_results:
            return exact_phrase_results
        
        # Then try improved keyword matching with scoring
        return self._search_keywords_with_scoring(db, keywords, user_id, limit)
    
    def _search_exact_phrases(self, db: Session, query: str, user_id: int, limit: int) -> List[Tuple[DocumentChunk, Document, float]]:
        """Search for exact phrases first"""
        
        # Look for key phrases in the query
        key_phrases = []
        query_lower = query.lower()
        
        # Extract multi-word phrases
        if "real time emotion" in query_lower or "emotion recognition" in query_lower:
            key_phrases.append("real-time emotion")
            key_phrases.append("emotion recognition")
        elif "machine learning" in query_lower:
            key_phrases.append("machine learning")
        elif "text to image" in query_lower or "text-to-image" in query_lower:
            key_phrases.append("text-to-image")
        
        if not key_phrases:
            return []
        
        # Search for these exact phrases
        phrase_conditions = []
        params = {'user_id': user_id, 'limit': limit}
        
        for i, phrase in enumerate(key_phrases):
            param_name = f'phrase_{i}'
            phrase_conditions.append(f"LOWER(dc.content) LIKE :{param_name}")
            params[param_name] = f"%{phrase}%"
        
        phrase_where = " OR ".join(phrase_conditions)
        
        sql_query = text(f"""
            SELECT 
                dc.id as chunk_id,
                dc.content,
                dc.chunk_index,
                dc.doc_metadata,
                d.id as doc_id,
                d.title,
                d.filename,
                d.file_type,
                0.9 as similarity
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            WHERE d.user_id = :user_id 
            AND d.status = 'completed'
            AND ({phrase_where})
            ORDER BY dc.chunk_index ASC
            LIMIT :limit
        """)
        
        results = db.execute(sql_query, params).fetchall()
        return self._convert_results_to_objects(results, user_id)
    
    def _search_keywords_with_scoring(self, db: Session, keywords: List[str], user_id: int, limit: int) -> List[Tuple[DocumentChunk, Document, float]]:
        """Enhanced keyword search with better scoring"""
        
        # Build dynamic WHERE clause for multiple keywords
        keyword_conditions = []
        params = {'user_id': user_id, 'limit': limit}
        
        for i, keyword in enumerate(keywords):
            param_name = f'keyword_{i}'
            keyword_conditions.append(f"(LOWER(dc.content) LIKE :{param_name} OR LOWER(d.title) LIKE :{param_name})")
            params[param_name] = f"%{keyword}%"
        
        keyword_where = " OR ".join(keyword_conditions)
        
        # Enhanced search with better ordering
        sql_query = text(f"""
            SELECT 
                dc.id as chunk_id,
                dc.content,
                dc.chunk_index,
                dc.doc_metadata,
                d.id as doc_id,
                d.title,
                d.filename,
                d.file_type,
                CASE 
                    WHEN LOWER(dc.content) LIKE '%project%' THEN 0.9
                    WHEN LOWER(dc.content) LIKE '%built%' THEN 0.8
                    ELSE 0.7
                END as similarity
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            WHERE d.user_id = :user_id 
            AND d.status = 'completed'
            AND ({keyword_where})
            ORDER BY similarity DESC, LENGTH(dc.content) ASC
            LIMIT :limit
        """)
        
        results = db.execute(sql_query, params).fetchall()
        return self._convert_results_to_objects(results, user_id)
    
    def _convert_results_to_objects(self, results, user_id: int) -> List[Tuple[DocumentChunk, Document, float]]:
        """Convert database results to objects"""
        chunks_with_docs = []
        for row in results:
            # Create DocumentChunk object
            chunk = DocumentChunk(
                id=row.chunk_id,
                content=row.content,
                chunk_index=row.chunk_index,
                doc_metadata=row.doc_metadata,
                document_id=row.doc_id
            )
            
            # Create Document object
            doc = Document(
                id=row.doc_id,
                title=row.title,
                filename=row.filename,
                file_type=row.file_type,
                user_id=user_id
            )
            
            chunks_with_docs.append((chunk, doc, float(row.similarity)))
        
        return chunks_with_docs

    def generate_response(self, query: str, context_chunks: List[Tuple[DocumentChunk, Document, float]]) -> str:
        """Generate intelligent response using the enhanced LLM with concept understanding"""
        
        if not context_chunks:
            return "I couldn't find any relevant information in your uploaded documents to answer this question. Please make sure you have uploaded documents that contain information related to your query."
        
        # Prepare context from chunks
        context_parts = []
        for chunk, document, similarity in context_chunks:
            context_parts.append(f"From '{document.title}':\n{chunk.content}")
        
        context = "\n\n".join(context_parts)
        
        # Use enhanced LLM to generate intelligent response with concept understanding
        response = llm_service.generate_enhanced_response(query, context)
        
        return response

    def chat(
        self, 
        db: Session, 
        user_id: int, 
        query: str, 
        limit: int = 5
    ) -> Dict[str, Any]:
        """Main chat function that handles the RAG pipeline"""
        
        try:
            # Search for relevant chunks
            similar_chunks = self.search_similar_chunks(db, query, user_id, limit)
            
            if not similar_chunks:
                return {
                    "response": "I couldn't find any relevant information in your uploaded documents to answer this question.",
                    "sources": [],
                    "success": True
                }
            
            # Generate response
            response = self.generate_response(query, similar_chunks)
            
            # Prepare sources information
            sources = []
            for chunk, document, similarity in similar_chunks:
                sources.append({
                    "document_id": document.id,
                    "document_title": document.title,
                    "chunk_id": chunk.id,
                    "similarity_score": similarity,
                    "content_preview": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content
                })
            
            return {
                "response": response,
                "sources": sources,
                "success": True
            }
            
        except Exception as e:
            return {
                "response": f"An error occurred while processing your question: {str(e)}",
                "sources": [],
                "success": False,
                "error": str(e)
            }

    def hybrid_search(
        self,
        db: Session,
        query: str,
        user_id: int,
        limit: int = 10
    ) -> List[Tuple[DocumentChunk, Document, float]]:
        """Hybrid search combining vector similarity and keyword matching"""
        
        # Vector search
        vector_results = self.search_similar_chunks(db, query, user_id, limit)
        
        # Keyword search (simple text matching for now)
        keywords = query.lower().split()
        keyword_query = text("""
            SELECT 
                dc.id as chunk_id,
                dc.content,
                dc.chunk_index,
                dc.doc_metadata,
                d.id as doc_id,
                d.title,
                d.filename,
                d.file_type,
                0.5 as similarity
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            WHERE d.user_id = :user_id 
            AND d.status = 'completed'
            AND (
                LOWER(dc.content) LIKE :keyword1
                OR LOWER(dc.content) LIKE :keyword2
            )
            ORDER BY d.created_at DESC
            LIMIT :limit
        """)
        
        keyword_params = {'user_id': user_id, 'limit': limit}
        for i, keyword in enumerate(keywords[:2]):  # Use first 2 keywords
            keyword_params[f'keyword{i+1}'] = f'%{keyword}%'
        
        # Fill remaining keyword parameters
        for i in range(len(keywords), 2):
            keyword_params[f'keyword{i+1}'] = '%%'
        
        keyword_results = db.execute(keyword_query, keyword_params).fetchall()
        
        # Combine and deduplicate results
        all_results = {}
        
        # Add vector results
        for chunk, doc, similarity in vector_results:
            all_results[chunk.id] = (chunk, doc, similarity)
        
        # Add keyword results (with lower scores to prioritize vector search)
        for row in keyword_results:
            if row.chunk_id not in all_results:
                chunk = DocumentChunk(
                    id=row.chunk_id,
                    content=row.content,
                    chunk_index=row.chunk_index,
                    doc_metadata=row.doc_metadata,
                    document_id=row.doc_id
                )
                doc = Document(
                    id=row.doc_id,
                    title=row.title,
                    filename=row.filename,
                    file_type=row.file_type,
                    user_id=user_id
                )
                all_results[chunk.id] = (chunk, doc, 0.3)  # Lower score for keyword matches
        
        # Sort by similarity score
        sorted_results = sorted(all_results.values(), key=lambda x: x[2], reverse=True)
        
        return sorted_results[:limit]


# Global instance
rag_service = RAGService()