import os
import uuid
from typing import List, Dict, Any
from pathlib import Path
import PyPDF2
import fitz  # PyMuPDF
from docx import Document as DocxDocument
from sentence_transformers import SentenceTransformer
import json
import re
from app.core.config import settings


class DocumentProcessor:
    def __init__(self):
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            # Try PyMuPDF first (better OCR support)
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            
            if text.strip():
                return text
            
            # Fallback to PyPDF2
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
            
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = DocxDocument(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from DOCX: {str(e)}")

    def extract_text_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Try different encodings
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except Exception as e:
                raise Exception(f"Error reading text file: {str(e)}")
        except Exception as e:
            raise Exception(f"Error extracting text from TXT: {str(e)}")

    def extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text based on file type"""
        if file_type.lower() == 'pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_type.lower() == 'docx':
            return self.extract_text_from_docx(file_path)
        elif file_type.lower() in ['txt', 'md']:
            return self.extract_text_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,!?;:()\-\'"]', ' ', text)
        # Remove extra spaces
        text = ' '.join(text.split())
        return text.strip()

    def chunk_text(self, text: str, chunk_size: int = None, overlap: int = None) -> List[Dict[str, Any]]:
        """Split text into chunks with overlap"""
        if chunk_size is None:
            chunk_size = settings.MAX_CHUNK_SIZE
        if overlap is None:
            overlap = settings.CHUNK_OVERLAP

        # Clean text
        text = self.preprocess_text(text)
        
        # Split by sentences first
        sentences = re.split(r'[.!?]+', text)
        chunks = []
        current_chunk = ""
        chunk_index = 0

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # Check if adding this sentence would exceed chunk size
            if len(current_chunk) + len(sentence) + 1 > chunk_size:
                if current_chunk:
                    chunks.append({
                        'content': current_chunk.strip(),
                        'chunk_index': chunk_index,
                        'metadata': json.dumps({
                            'length': len(current_chunk),
                            'sentences': current_chunk.count('.') + current_chunk.count('!') + current_chunk.count('?')
                        })
                    })
                    chunk_index += 1
                    
                    # Start new chunk with overlap
                    if overlap > 0 and len(current_chunk) > overlap:
                        current_chunk = current_chunk[-overlap:] + " " + sentence
                    else:
                        current_chunk = sentence
                else:
                    current_chunk = sentence
            else:
                current_chunk = current_chunk + " " + sentence if current_chunk else sentence

        # Add the last chunk
        if current_chunk.strip():
            chunks.append({
                'content': current_chunk.strip(),
                'chunk_index': chunk_index,
                'metadata': json.dumps({
                    'length': len(current_chunk),
                    'sentences': current_chunk.count('.') + current_chunk.count('!') + current_chunk.count('?')
                })
            })

        return chunks

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        try:
            embeddings = self.embedding_model.encode(texts)
            return embeddings.tolist()
        except Exception as e:
            raise Exception(f"Error generating embeddings: {str(e)}")

    def process_document(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """Complete document processing pipeline"""
        try:
            # Extract text
            text = self.extract_text(file_path, file_type)
            
            if not text.strip():
                raise ValueError("No text could be extracted from the document")

            # Create chunks
            chunks = self.chunk_text(text)
            
            if not chunks:
                raise ValueError("No chunks could be created from the document")

            # Generate embeddings
            chunk_texts = [chunk['content'] for chunk in chunks]
            embeddings = self.generate_embeddings(chunk_texts)

            # Combine chunks with embeddings
            for i, chunk in enumerate(chunks):
                chunk['embedding'] = embeddings[i]

            return {
                'success': True,
                'text': text,
                'chunks': chunks,
                'total_chunks': len(chunks),
                'total_characters': len(text)
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'chunks': [],
                'total_chunks': 0
            }


# Global instance
document_processor = DocumentProcessor()