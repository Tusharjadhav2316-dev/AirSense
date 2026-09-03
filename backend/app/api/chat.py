"""
================================================================================
AIRSENSE — CHAT API ROUTER (Sprint 2 — Day 9)
================================================================================
Exposes POST /chat for conversational RAG health guidance.
================================================================================
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import process_chat_message

router = APIRouter(prefix="/chat", tags=["Conversational Chat"])

@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Conversational Health Guidance Chat Endpoint",
    description="Vector searches WHO/EPA guidelines using free-text user messages and returns grounded AI advice with citations."
)
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    try:
        if not payload.message or not payload.message.strip():
            raise HTTPException(status_code=400, detail="Chat message text cannot be empty")
            
        return await process_chat_message(payload)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Chat endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat execution failed: {str(e)}"
        )
