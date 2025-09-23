#!/usr/bin/env python3
"""
Script to fix documents stuck in processing status
"""
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.models import Document
from app.services.document_service import document_processor
import json

def fix_processing_documents():
    """Find and reprocess documents stuck in processing status"""
    db = SessionLocal()
    try:
        # Find documents with processing status
        processing_docs = db.query(Document).filter(Document.status == "processing").all()
        
        print(f"Found {len(processing_docs)} documents stuck in processing...")
        
        for doc in processing_docs:
            print(f"Reprocessing document: {doc.filename}")
            try:
                # Reprocess the document
                if os.path.exists(doc.file_path):
                    result = document_processor.process_document(doc.file_path, doc.filename)
                    
                    if result["success"]:
                        # Update document status and content
                        doc.status = "completed"
                        doc.content = result["text"]
                        doc.doc_metadata = json.dumps(result["metadata"])
                        
                        # Save chunks and embeddings
                        from app.models.models import DocumentChunk, ChunkEmbedding
                        
                        for i, chunk_data in enumerate(result["chunks"]):
                            chunk = DocumentChunk(
                                document_id=doc.id,
                                content=chunk_data["content"],
                                chunk_index=i,
                                doc_metadata=json.dumps(chunk_data.get("metadata", {}))
                            )
                            db.add(chunk)
                            db.flush()  # Get the chunk ID
                            
                            # Create embedding
                            embedding = ChunkEmbedding(
                                chunk_id=chunk.id,
                                embedding=json.dumps(chunk_data["embedding"])
                            )
                            db.add(embedding)
                        
                        db.commit()
                        print(f"✅ Successfully processed {doc.filename}")
                    else:
                        doc.status = "failed"
                        doc.error_message = result.get("error", "Unknown error")
                        db.commit()
                        print(f"❌ Failed to process {doc.filename}: {result.get('error')}")
                else:
                    doc.status = "failed"
                    doc.error_message = f"File not found: {doc.file_path}"
                    db.commit()
                    print(f"❌ File not found: {doc.file_path}")
                    
            except Exception as e:
                db.rollback()
                doc.status = "failed"
                doc.error_message = str(e)
                db.commit()
                print(f"❌ Error processing {doc.filename}: {e}")
                
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_processing_documents()