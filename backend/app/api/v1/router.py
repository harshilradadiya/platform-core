from fastapi import APIRouter
from app.api.v1.endpoints import health, resolve, stream

api_router = APIRouter()

api_router.include_router(resolve.router, tags=["Resolution"])
api_router.include_router(stream.router, tags=["Streaming"])
api_router.include_router(health.router, tags=["Health"])
