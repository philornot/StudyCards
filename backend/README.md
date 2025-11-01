# Study Cards Backend

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run the application:
```bash
uvicorn app.main:app --reload --port 8000
```

5. Check health endpoint:
```
http://localhost:8000/health
```

## API Documentation
Once running, visit: http://localhost:8000/docs