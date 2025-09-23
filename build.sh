#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting KnowledgeForge deployment build..."

# Install system dependencies if needed
echo "📦 Installing system dependencies..."
apt-get update
apt-get install -y postgresql-client

# Setup backend
echo "🐍 Setting up Python backend..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Setup database
echo "🗄️  Setting up database..."
if [ ! -z "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    python -c "
import os
import psycopg2
from urllib.parse import urlparse

# Parse database URL
url = urlparse(os.getenv('DATABASE_URL'))
db_config = {
    'host': url.hostname,
    'port': url.port,
    'database': url.path[1:],
    'user': url.username,
    'password': url.password
}

# Connect and create tables
conn = psycopg2.connect(**db_config)
cur = conn.cursor()

# Create documents table
cur.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        embedding TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
''')

# Create conversations table
cur.execute('''
    CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        messages TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
''')

conn.commit()
cur.close()
conn.close()
print('✅ Database tables created successfully')
"
else
    echo "⚠️  No DATABASE_URL found, skipping database setup"
fi

# Build frontend
echo "⚛️  Building React frontend..."
cd ../frontend
npm install
npm run build

echo "✅ Build completed successfully!"