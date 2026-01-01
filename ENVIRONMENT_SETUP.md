# Environment Setup Guide

This guide explains how to set up environment variables and virtual environments for the Retro POS System.

## Backend Environment Variables

### Step 1: Create `.env` file

Navigate to the `backend/` directory and create a `.env` file:

**Windows:**
```powershell
cd backend
copy env.example .env
```

**Mac/Linux:**
```bash
cd backend
cp env.example .env
```

If `env.example` doesn't exist, create `.env` manually with this content:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
# Comma-separated list of allowed origins
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# API Configuration
API_TITLE=Retro POS System API
API_VERSION=1.0.0

# Environment
ENVIRONMENT=development
```

### Step 2: Customize (Optional)

Edit the `.env` file to change any settings:
- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `8000`)
- `CORS_ORIGINS`: Allowed frontend URLs (comma-separated)
- `API_TITLE`: API title shown in documentation
- `API_VERSION`: API version
- `ENVIRONMENT`: `development`, `production`, or `testing`

## Python Virtual Environment

### Why Use a Virtual Environment?

A virtual environment isolates your project's Python dependencies from other projects and the system Python installation.

### Setup Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   
   # Mac/Linux
   python3 -m venv venv
   ```

3. **Activate virtual environment:**
   
   **Windows PowerShell:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   **Windows Command Prompt:**
   ```cmd
   venv\Scripts\activate.bat
   ```
   
   **Mac/Linux:**
   ```bash
   source venv/bin/activate
   ```

   You'll know it's activated when you see `(venv)` at the start of your command prompt.

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Deactivate when done:**
   ```bash
   deactivate
   ```

### Quick Start Scripts

We've provided convenience scripts to automate this process:

**Windows:**
```powershell
cd backend
.\start-backend.ps1
```

**Mac/Linux:**
```bash
cd backend
chmod +x start-backend.sh
./start-backend.sh
```

These scripts will:
- Create virtual environment if it doesn't exist
- Activate the virtual environment
- Create `.env` from `.env.example` if needed
- Install dependencies
- Start the server

## Frontend Environment Variables

The frontend uses Next.js environment variables. Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the frontend where to find the backend API.

## Global Requirements.txt

The root-level `requirements.txt` is a **reference file** that points to where the actual requirements are:

- **Backend**: `backend/requirements.txt` (Python packages)
- **Frontend**: `frontend/package.json` (Node.js packages)

Each component has its own dependency management:
- Backend uses `pip` and `requirements.txt`
- Frontend uses `npm` and `package.json`

## Troubleshooting

### Virtual Environment Issues

**Windows PowerShell Execution Policy:**
If you get an error activating the virtual environment, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Python not found:**
Make sure Python is installed and in your PATH:
```bash
python --version  # or python3 --version
```

### Environment Variable Issues

**Variables not loading:**
- Make sure `.env` file is in the `backend/` directory
- Check that `python-dotenv` is installed: `pip install python-dotenv`
- Restart the server after changing `.env`

**CORS errors:**
- Make sure `CORS_ORIGINS` in `.env` includes your frontend URL
- Check that the frontend is running on the port specified in `CORS_ORIGINS`

## Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use `.env.example`** - Commit this as a template
3. **Activate virtual environment** - Always activate before running the backend
4. **Keep dependencies updated** - Regularly run `pip install -r requirements.txt --upgrade`

