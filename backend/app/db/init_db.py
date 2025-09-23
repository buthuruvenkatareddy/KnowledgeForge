from sqlalchemy import text
from app.db.database import engine
from app.models.models import Base


def init_db():
    """Initialize database with tables"""
    # Note: pgvector extension disabled for now
    # with engine.connect() as connection:
    #     try:
    #         connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    #         connection.commit()
    #     except Exception as e:
    #         print(f"Warning: Could not create vector extension: {e}")
    #         print("Make sure pgvector is installed on your PostgreSQL instance")

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()