from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Document Schemas
class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class Document(DocumentBase):
    id: int
    user_id: int
    filename: str
    file_type: str
    file_size: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Document Chunk Schemas
class DocumentChunkBase(BaseModel):
    content: str
    chunk_index: int
    metadata: Optional[str] = Field(None, alias='doc_metadata')


class DocumentChunk(DocumentChunkBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


# Conversation Schemas
class ConversationBase(BaseModel):
    title: str


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(BaseModel):
    title: Optional[str] = None


class Conversation(ConversationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Message Schemas
class MessageBase(BaseModel):
    role: str
    content: str


class MessageCreate(MessageBase):
    conversation_id: int


class Message(MessageBase):
    id: int
    conversation_id: int
    created_at: datetime
    citations: Optional[List["Citation"]] = []

    class Config:
        from_attributes = True


# Citation Schemas
class CitationBase(BaseModel):
    relevance_score: float


class Citation(CitationBase):
    id: int
    message_id: int
    document_id: int
    chunk_id: int
    created_at: datetime
    document: Optional[Document] = None
    chunk: Optional[DocumentChunk] = None

    class Config:
        from_attributes = True


# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    message_id: int
    citations: List[Citation] = []


# Search Schemas
class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class SearchResult(BaseModel):
    chunk: DocumentChunk
    document: Document
    similarity_score: float