from app.config import get_settings
from app.routes import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()

app = FastAPI(title=settings.app_name)

# CORS configuration — używaj zmiennej środowiskowej
allowed_origins = [
    settings.frontend_url,  # Z .env
]

# W development dodaj również inne porty
if "localhost" in settings.frontend_url:
    allowed_origins.extend([
        "http://localhost:4173",  # Vite preview
        "http://localhost:3000",  # Alternatywny port
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.app_name}
