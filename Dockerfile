# Użyj oficjalnego obrazu Python
FROM python:3.11-slim

# Ustaw zmienne środowiskowe
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki requirements
COPY backend/requirements.txt .

# Zainstaluj zależności
RUN pip install --no-cache-dir -r requirements.txt

# Skopiuj cały kod backendu
COPY backend/ .

# Uruchom migracje i serwer
CMD alembic upgrade head && \
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}