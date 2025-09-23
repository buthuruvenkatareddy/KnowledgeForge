from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.security import get_current_active_user
from app.models.models import User, Conversation, Message, Citation
from app.schemas.schemas import (
    ChatRequest, ChatResponse, Conversation as ConversationSchema,
    ConversationCreate, Message as MessageSchema, SearchRequest, SearchResult
)
from app.services.rag_service import rag_service

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Chat with documents using RAG"""
    
    try:
        # Get or create conversation
        if request.conversation_id:
            conversation = db.query(Conversation).filter(
                Conversation.id == request.conversation_id,
                Conversation.user_id == current_user.id
            ).first()
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            # Create new conversation
            conversation = Conversation(
                user_id=current_user.id,
                title=request.message[:50] + "..." if len(request.message) > 50 else request.message
            )
            db.add(conversation)
            db.flush()  # Flush to get the ID without committing
        
        # Save user message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        db.add(user_message)
        db.flush()  # Flush to get the ID without committing
        
        # Generate response using RAG
        rag_result = rag_service.chat(db, current_user.id, request.message)
        
        # Save assistant message
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=rag_result["response"]
        )
        db.add(assistant_message)
        db.flush()  # Flush to get the ID without committing
        
        # Save citations
        citations = []
        if rag_result["success"] and rag_result["sources"]:
            for source in rag_result["sources"]:
                citation = Citation(
                    message_id=assistant_message.id,
                    document_id=source["document_id"],
                    chunk_id=source["chunk_id"],
                    relevance_score=source["similarity_score"]
                )
                db.add(citation)
                citations.append(citation)
        
        # Commit all changes at once
        db.commit()
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
    
    return ChatResponse(
        response=rag_result["response"],
        conversation_id=conversation.id,
        message_id=assistant_message.id,
        citations=citations
    )


@router.get("/conversations", response_model=List[ConversationSchema])
async def get_conversations(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's conversations"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).offset(skip).limit(limit).all()
    
    return conversations


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageSchema])
async def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get messages from a conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at).all()
    
    return messages


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a conversation"""
    try:
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Explicitly delete messages first to avoid cascade issues
        messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
        for message in messages:
            # Delete citations for each message
            citations = db.query(Citation).filter(Citation.message_id == message.id).all()
            for citation in citations:
                db.delete(citation)
            # Delete the message
            db.delete(message)
        
        # Now delete the conversation
        db.delete(conversation)
        db.commit()
        
        return {"message": "Conversation deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete conversation: {str(e)}")


@router.post("/search", response_model=List[SearchResult])
async def search_documents(
    request: SearchRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Search through user's documents"""
    
    # Search using RAG service
    similar_chunks = rag_service.search_similar_chunks(
        db, request.query, current_user.id, request.limit
    )
    
    # Convert to SearchResult format
    results = []
    for chunk, document, similarity in similar_chunks:
        result = SearchResult(
            chunk=chunk,
            document=document,
            similarity_score=similarity
        )
        results.append(result)
    
    return results