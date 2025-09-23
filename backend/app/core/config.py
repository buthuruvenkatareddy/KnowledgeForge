from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "postgresql://postgres:password@localhost/knowledgeforge"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "knowledgeforge"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # Security settings
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # AI/ML Settings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL_PATH: str = "models/llama-3-8b-instruct"
    MAX_CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    VECTOR_DIMENSION: int = 384  # Dimension for all-MiniLM-L6-v2

    # File upload settings
    MAX_FILE_SIZE: int = 50000000  # 50MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "txt", "docx", "md"]
    UPLOAD_DIR: str = "uploads"

    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"

    # CORS settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()