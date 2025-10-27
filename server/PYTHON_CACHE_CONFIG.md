# Python Cache Configuration

This project is configured to prevent Python from creating `__pycache__` files and directories.

## Configuration Methods

### 1. Environment Variable (Recommended)
The `PYTHONDONTWRITEBYTECODE=1` environment variable is set in `server/run.py` to prevent bytecode file generation.

### 2. Alternative Methods

#### Option A: Set environment variable globally
```bash
export PYTHONDONTWRITEBYTECODE=1
```

#### Option B: Run Python with -B flag
```bash
python -B run.py
```

#### Option C: Use .env file
Create a `.env` file in the server directory:
```
PYTHONDONTWRITEBYTECODE=1
```

## Git Ignore
The `.gitignore` file includes comprehensive patterns to exclude:
- `__pycache__/` directories
- `*.pyc` files
- `*.pyo` files
- Other Python-related cache files

## Benefits
- **Cleaner repository**: No bytecode files in version control
- **Reduced conflicts**: Eliminates merge conflicts from cache files
- **Better performance**: Slightly slower startup but cleaner development environment

## Note
This configuration only affects the development environment. In production, you may want to allow bytecode compilation for better performance.
