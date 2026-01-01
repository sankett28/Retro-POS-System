# Backend Setup Guide

This guide will help you set up the Python backend with a virtual environment and environment variables.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Step 1: Create Virtual Environment

### Windows:
```bash
cd backend
python -m venv venv
```

### Mac/Linux:
```bash
cd backend
python3 -m venv venv
```

## Step 2: Activate Virtual Environment

### Windows (PowerShell):
```bash
.\venv\Scripts\Activate.ps1
```

### Windows (Command Prompt):
```bash
venv\Scripts\activate.bat
```

### Mac/Linux:
```bash
source venv/bin/activate
```

**Note:** When the virtual environment is activated, you'll see `(venv)` at the beginning of your command prompt.

## Step 3: Install Dependencies

With the virtual environment activated:

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn
- Pydantic
- python-dotenv (for environment variables)

## Step 4: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   # Windows
   copy env.example .env
   
   # Mac/Linux
   cp env.example .env
   ```

2. Edit `.env` file with your preferred settings (optional):
   ```env
   HOST=0.0.0.0
   PORT=8000
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   API_TITLE=Retro POS System API
   API_VERSION=1.0.0
   ENVIRONMENT=development
   ```

   The default values will work fine for development, so you can skip this step if you want.

## Step 5: Run the Server

With the virtual environment activated:

```bash
# Option 1: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Option 2: Using Python
python main.py
```

The server will start at `http://localhost:8000`

## Deactivating Virtual Environment

When you're done working, deactivate the virtual environment:

```bash
deactivate
```

## Quick Start Scripts

### Windows (PowerShell) - `start-backend.ps1`:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### Mac/Linux - `start-backend.sh`:
```bash
#!/bin/bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

## Troubleshooting

### Virtual environment not activating (Windows PowerShell)
If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port already in use
Change the `PORT` in `.env` file or kill the process using port 8000.

### Module not found errors
Make sure the virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

## Production Deployment

For production:
1. Set `ENVIRONMENT=production` in `.env`
2. Use a production ASGI server like Gunicorn with Uvicorn workers
3. Set up proper CORS origins for your production domain
4. Use environment variables from your hosting platform instead of `.env` file

