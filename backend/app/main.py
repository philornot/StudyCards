from app.config import get_settings
from app.routes import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()

app = FastAPI(title=settings.app_name)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://studycards43.netlify.app",  # Twoja domena Netlify
        "http://localhost:5173",              # Development
        "http://localhost:4173",              # Build preview
        "http://localhost:3000",              # Alternatywny port dev
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Pozwól na wszystkie metody (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Pozwól na wszystkie nagłówki
)

app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.app_name}
