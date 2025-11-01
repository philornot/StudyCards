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
- `DATABASE_URL`: Database connection string (default: `sqlite:///./studycards.db`)

### 4. Run database migrations:
```bash
# Create initial migration
alembic revision --autogenerate -m "initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the application:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at: http://localhost:8000

### 6. Check health endpoint:
```
http://localhost:8000/health
```

## API Documentation
Once running, visit the interactive API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Run all tests:
```bash
pytest tests/ -v
```

### Run tests with coverage:
```bash
pytest tests/ --cov=app --cov-report=html
```

View coverage report: open `htmlcov/index.html` in your browser

## Database

### SQLite (Default for Development)
The app uses SQLite by default. The database file `studycards.db` will be created in the backend directory.

### PostgreSQL (Production)
To use PostgreSQL, update the `DATABASE_URL` in your `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/studycards
```

And install the PostgreSQL driver:
```bash
pip install psycopg2-binary
```

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration settings
│   ├── database.py       # Database connection
│   ├── models/           # SQLAlchemy models
│   ├── routes/           # API endpoints
│   └── schemas/          # Pydantic schemas
├── tests/                # Test files
├── alembic/              # Database migrations
├── requirements.txt      # Python dependencies
└── README.md
```

## Common Commands

### Create a new migration:
```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations:
```bash
alembic upgrade head
```

### Rollback migration:
```bash
alembic downgrade -1
```

### Reset database (caution!):
```bash
rm studycards.db
alembic upgrade head
```