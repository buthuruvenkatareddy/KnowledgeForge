# KnowledgeForge

🚀 **Live Demo**: [https://buthuruvenkatareddy.github.io/KnowledgeForge/](https://buthuruvenkatareddy.github.io/KnowledgeForge/)

## 📋 Project Overview

Built by Venkat Buthuru, KnowledgeForge is an intelligent AI-powered knowledge management system that transforms your documents into an interactive, searchable knowledge base. This application allows users to upload various document formats (PDFs, Word documents, text files) and then engage in natural language conversations with an AI assistant that understands the content of their documents.

The system combines modern web technologies with advanced AI capabilities to provide a seamless experience for document management, intelligent search, and conversational AI interactions. Users can organize their knowledge, get instant answers from their document collection, and maintain conversation history for future reference.

## Key Features

- Smart Document Processing: Upload and automatically process multiple document formats
- AI-Powered Conversations: Chat with an intelligent assistant about your documents
- Semantic Search: Find relevant information using natural language queries
- User Management: Secure authentication and personal document spaces
- Conversation History: Organize and manage chat sessions
- Document Preview: View document content directly in the application
- Real-time Processing: Live status updates during document processing
- Modern UI/UX: Clean, professional interface with responsive design

## Technologies and Tools

### Backend Technologies

- FastAPI - Modern, high-performance Python web framework for building APIs
- PostgreSQL - Advanced relational database for storing document data and metadata
- SQLAlchemy - Python SQL toolkit and Object-Relational Mapping (ORM) library
- Alembic - Database migration tool for SQLAlchemy
- Pydantic - Data validation and settings management using Python type hints
- Sentence Transformers - Library for creating sentence embeddings for semantic search
- Hugging Face Transformers - State-of-the-art natural language processing models
- PyTorch - Deep learning framework for AI model operations
- Uvicorn - Lightning-fast ASGI server implementation

Frontend Technologies:

- React - Popular JavaScript library for building user interfaces
- Vite - Next-generation, fast build tool for modern web projects
- Tailwind CSS - Utility-first CSS framework for rapid UI development
- React Query (TanStack Query) - Powerful data synchronization for React
- React Router - Declarative routing library for React applications
- Heroicons - Beautiful hand-crafted SVG icons from the makers of Tailwind CSS
- React Markdown - Markdown component for React applications

Document Processing:

- PyPDF2 - Pure Python library for PDF document processing
- PyMuPDF (Fitz) - High-performance PDF processing and rendering
- python-docx - Library for creating and updating Microsoft Word documents
- Pillow (PIL) - Python Imaging Library for image processing

Development Tools
- Python 3.9+ - Modern Python runtime
- Node.js 16+ - JavaScript runtime for frontend development
- Git - Version control system
- VS Code - Recommended code editor with excellent Python and React support

Application Screenshots:

Landing Pages:

![Landing Page Screenshot 1](KnowledgeForge_Application_ScreenShots/1.png)
![Landing Page Screenshot 2](KnowledgeForge_Application_ScreenShots/2.png)
![Landing Page Screenshot 3](KnowledgeForge_Application_ScreenShots/3.png)
![Landing Page Screenshot 4](KnowledgeForge_Application_ScreenShots/4.png)

Landing Page Features:
- Professional Hero Section: Eye-catching introduction with gradient backgrounds and modern typography
- Feature Highlights: Clear presentation of key capabilities including smart document processing, AI-powered chat, and intelligent insights
- Creator Attribution: Professional section highlighting Venkat Buthuru as the creator with background information
- Call-to-Action Buttons: Strategically placed buttons for user registration and login
- Responsive Design: Optimized for desktop, tablet, and mobile viewing
- Modern Aesthetics: Clean design with beautiful color gradients, professional spacing, and intuitive navigation

Sign In Page:

![Sign In Page](KnowledgeForge_Application_ScreenShots/5.png)

**Sign In Page Features:
- Clean Login Form: Simple and intuitive email/password authentication
- Secure Authentication: JWT token-based security with encrypted password storage
- Form Validation: Real-time input validation with helpful error messages
- Remember Me Option: Convenient user session management
- Professional Styling: Consistent with overall application design theme
- Forgot Password Link: Easy account recovery options for users

Create Account Page:

![Create Account Page](KnowledgeForge_Application_ScreenShots/6.png)

Create Account Page Features:**
- User Registration Form: Comprehensive signup with full name, email, and password
- Password Strength Validation: Real-time password requirements checking
- Email Verification: Secure email validation for account creation
- Terms and Conditions: Legal compliance with user agreement acceptance
- Instant Feedback: Immediate validation messages for form inputs
- Seamless Onboarding: Direct transition to dashboard after successful registration

Dashboard Page:

![Dashboard Page](KnowledgeForge_Application_ScreenShots/7.png)

Dashboard Page Features:
- Statistics Overview: Visual cards showing total documents, completed processing, and error counts
- Recent Documents: Quick access to recently uploaded and processed documents
- Quick Actions: Convenient buttons for uploading documents, starting chats, and accessing analytics
- Processing Status: Real-time updates on document processing progress
- Beautiful Data Visualization: Color-coded statistics with gradient backgrounds and icons
- Navigation Hub: Central access point to all major application features

Documents Page:

![Documents Page](KnowledgeForge_Application_ScreenShots/8.png)

Documents Page Features:
- Document Library: Complete list of all uploaded documents with metadata
- Upload Interface: Drag-and-drop or click-to-upload functionality for multiple file formats
- Processing Status Indicators: Visual status badges for completed, processing, and error states
- Document Actions: Preview, download, and delete options for each document
- Search and Filter: Find documents quickly using title or content search
- File Type Support: PDF, Word documents, and text files with automatic format detection

Chat Page:

![Chat Page](KnowledgeForge_Application_ScreenShots/9.png)

Chat Page Features:
- Conversation Sidebar: Organized list of all chat sessions with timestamps
- AI Assistant Interface: Natural language chat with intelligent responses
- Message History: Complete conversation history with user and AI messages
- New Conversation: Easy creation of new chat sessions
- Real-time Responses: Live typing indicators and instant AI responses
- Conversation Management: Delete, rename, and organize chat sessions
- Context-Aware AI: Assistant understands and references uploaded documents

Document Preview:

![Document Preview](KnowledgeForge_Application_ScreenShots/10.png)

Document Preview Features:
- Full Document Viewer: Complete document content display with original formatting
- Text Extraction Results: Preview of processed text content for AI interactions
- Processing Information: Details about document analysis and indexing status
- Navigation Tools: Scroll, zoom, and page navigation for large documents
- Content Highlighting: Visual indicators for searchable and processed content sections
- Metadata Display: File information including size, upload date, and processing time

## Deployment

### 🆓 GitHub Pages (100% Free - No External Hosting!)

**Get a live link directly from GitHub - completely FREE:**

**Frontend Demo URL**: `https://buthuruvenkatareddy.github.io/KnowledgeForge/`

**📋 How to Enable GitHub Pages:**

1. **Go to your GitHub repository settings**
   - Navigate to: `Settings` → `Pages`

2. **Configure GitHub Pages**:
   - Source: `Deploy from a branch`
   - Branch: `main` 
   - Folder: `/ (root)`

3. **Create GitHub Actions workflow**:
   ```bash
   # Create .github/workflows/deploy.yml
   mkdir -p .github/workflows
   ```

4. **Your site will be live at**: `https://yourusername.github.io/KnowledgeForge/`

**⚠️ Note**: GitHub Pages only hosts static frontend. For full AI functionality, you'll need backend hosting (see options below).

**🎯 Perfect for**: Portfolio showcase, UI demonstration, static content

---

### Render.com Deployment (Full-Stack)

This project is configured for easy deployment on Render.com:

1. **Push your code to GitHub**

2. **Connect to Render.com**:
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

3. **Automatic Configuration**:
   - ✅ Backend API with health checks
   - ✅ PostgreSQL database with automatic connection
   - ✅ Frontend static site with proper routing
   - ✅ Environment variables automatically configured

4. **API URL Configuration**:
   - Frontend automatically uses relative URLs (`/api/v1`) in production
   - No manual configuration needed for standard deployments
   - For custom domains, set `VITE_API_URL` in frontend environment variables

### Alternative Free Deployment Options

If you want to get your own live link, here are other free platforms you can use:

**🔥 Recommended Free Platforms:**

1. **Vercel** (Frontend + Serverless Functions)
   - Free tier with generous limits
   - Easy GitHub integration
   - Perfect for React + API deployment
   - URL: `https://yourapp.vercel.app`

2. **Railway** 
   - Free $5/month credit
   - Full-stack deployment
   - PostgreSQL included
   - URL: `https://yourapp.railway.app`

3. **Heroku** (with limitations)
   - Free tier available with sleep mode
   - PostgreSQL addon available
   - URL: `https://yourapp.herokuapp.com`

4. **Netlify** (Static sites + Functions)
   - Great for frontend deployment
   - Serverless functions for API
   - URL: `https://yourapp.netlify.app`

**📋 Quick Deploy Instructions:**
1. Fork this repository to your GitHub
2. Connect your repository to chosen platform
3. Set environment variables (DATABASE_URL, OPENAI_API_KEY)
4. Deploy with one click!

### Manual Deployment

For other hosting platforms, see the `build.sh` script for deployment steps.

## �️ Installation & Setup

### Prerequisites
Before starting, ensure you have the following installed on your system:
- Python 3.9 or higher - [Download from python.org](https://www.python.org/downloads/)
- Node.js 16 or higher - [Download from nodejs.org](https://nodejs.org/downloads/)
- PostgreSQL 14 or higher - [Download from postgresql.org](https://www.postgresql.org/download/)
- Git - [Download from git-scm.com](https://git-scm.com/downloads/)

### Step 1: Download the Project

**Option A: Clone from GitHub**

```bash
git clone https://github.com/yourusername/KnowledgeForge.git
cd KnowledgeForge
```

**Option B: Download ZIP**

1. Download the project ZIP file from GitHub
2. Extract the ZIP file to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Database Setup

1. **Start PostgreSQL service** on your system

2. **Create the database**:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE knowledgeforge;

-- Exit PostgreSQL
\q
```

### Step 3: Backend Setup

1. **Navigate to backend directory**:

```bash
cd backend
```

2. **Create Python virtual environment**:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
# Windows: notepad .env
# macOS/Linux: nano .env
```

Required environment variables in .env:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/knowledgeforge

# Security Settings
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload Settings
MAX_FILE_SIZE_MB=50
UPLOAD_DIR=uploads
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the backend server:
```bash
python main.py
```

The backend API will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Step 4: Frontend Setup

Open a new terminal and navigate to the frontend directory:

1. **Navigate to frontend directory**:

```bash
cd frontend
```

2. **Install Node.js dependencies**:

```bash
npm install
```

3. **Configure API URL (Optional)**:
   - For development: No configuration needed (uses `http://localhost:8000/api/v1`)
   - For production: Copy `.env.example` to `.env` and set `VITE_API_URL` if needed

```bash
# Optional: Create environment file for custom API URL
cp .env.example .env
# Edit .env file to set VITE_API_URL if needed
```

4. **Start the development server**:

```bash
npm run dev
```

The frontend application will be available at: `http://localhost:3000`

### Step 5: Access the Application

1. **Open your web browser** and go to `http://localhost:3000`
2. **Create a new account** on the registration page
3. **Log in** with your credentials
4. **Upload your first document** on the Documents page
5. **Start chatting** with your AI assistant about your documents

## Usage

Once your application is running, you can:

### Document Management
- **Upload Documents**: Support for PDF, DOCX, and TXT files
- **View Documents**: Browse your document library with search and filter
- **Document Preview**: View full document content and processing status
- **Automatic Processing**: AI automatically extracts and indexes content

### AI Chat Assistant
- **Ask Questions**: Chat naturally about your uploaded documents
- **Get Insights**: AI provides intelligent responses based on document content
- **Conversation History**: All chat sessions are saved and organized
- **Context Awareness**: AI understands and references your documents

### Key Features
- **Semantic Search**: Find relevant information across all documents
- **Multi-format Support**: Handle various document types
- **Real-time Responses**: Instant AI responses with typing indicators
- **Professional Interface**: Modern, gradient-styled UI components

## 🔧 Troubleshooting

### Common Issues and Solutions

**Backend won't start:**
- Ensure PostgreSQL is running
- Check database connection string in .env
- Verify Python virtual environment is activated

**Frontend won't start:**
- Check Node.js version (requires 16+)
- Delete `node_modules` and run `npm install` again
- Ensure port 3000 is not in use by another application

**Database connection errors:**
- Verify PostgreSQL service is running
- Check username/password in DATABASE_URL
- Ensure the `knowledgeforge` database exists

Document upload fails:
- Check file size (must be under 50MB by default)
- Ensure `uploads/` directory exists in backend folder
- Verify file format is supported (PDF, DOCX, TXT)

Development Commands:

Backend Commands:
```bash
# Run tests
pytest

# Format code
black .
isort .

# Database migration
alembic revision --autogenerate -m "description"
alembic upgrade head
```

Frontend Commands:
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

Created with ❤️ by Venkat Buthuru • © 2025 KnowledgeForge. All rights reserved.
