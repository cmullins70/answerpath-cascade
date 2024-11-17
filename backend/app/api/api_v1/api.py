from fastapi import APIRouter
from .endpoints import documents, questions, responses, users, knowledge_base, brand_voice

api_router = APIRouter()

api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(responses.router, prefix="/responses", tags=["responses"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(knowledge_base.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(brand_voice.router, prefix="/brand-voice", tags=["brand-voice"])
