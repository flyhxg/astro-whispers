from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import Base, engine, SessionLocal
from .routers import auth, users, reports, articles, zodiac_interpretations
from .services.bootstrap import bootstrap_data

settings = get_settings()

Base.metadata.create_all(bind=engine)

with SessionLocal() as session:
    bootstrap_data(session)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(reports.router)
app.include_router(articles.router)
app.include_router(zodiac_interpretations.router)


@app.get('/api/health')
def health_check():
    return {'status': 'ok'}

