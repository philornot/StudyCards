# Study Cards Backend

## Setup

1. Create virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (optional - defaults to SQLite):
```bash
cp .env.example .env
```

4. Run database migrations:
```bash
alembic revision --autogenerate -m "initial migration"
alembic upgrade head
```

5. Run the application:
```bash
uvicorn app.main:app --reload --port 8000
```

6. Check health endpoint:
```
http://localhost:8000/health
```

## API Documentation
Once running, visit: http://localhost:8000/docs

## Database
By default, the app uses SQLite (studycards.db file). 
To use PostgreSQL, update DATABASE_URL in .env file.