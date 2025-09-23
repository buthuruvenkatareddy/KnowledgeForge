from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.api.main import api_router
from app.db.init_db import init_db
import os

app = FastAPI(
    title="KnowledgeForge API",
    description="A RAG-powered knowledge base assistant",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Serve uploaded files
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Serve React frontend static files
frontend_dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist_path):
    app.mount("/static", StaticFiles(directory=frontend_dist_path), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        """Serve React app for all non-API routes"""
        # If it's an API route, let it pass through
        if full_path.startswith("api/") or full_path.startswith("uploads/"):
            return {"error": "Not found"}
        
        # If requesting a static file that exists, serve it
        file_path = os.path.join(frontend_dist_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise, serve index.html for React routing
        index_path = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        
        return {"error": "Frontend not built"}

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("📝 Continuing without database - some features may be limited")

@app.get("/")
async def root():
    """Redirect to React app"""
    frontend_dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
    index_path = os.path.join(frontend_dist_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "KnowledgeForge API is running! Frontend not built yet."}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=True if settings.ENVIRONMENT == "development" else False,
    )