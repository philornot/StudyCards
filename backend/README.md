# Study Cards Backend

## Tech Stack
- **Framework**: FastAPI
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Testing**: Pytest

## Setup

### 1. Create virtual environment:
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Unix/MacOS:
source venv/bin/activate
```

### 2. Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Environment variables:
Create a `.env` file in the backend directory (optional - defaults work for development):
```bash
cp .env.example .env
```

Available variables:
- `DATABASE_URL`: Database connection string (default: