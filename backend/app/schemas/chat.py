"""
================================================================================
AIRSENSE — CHAT ENDPOINT SCHEMAS (Sprint 2 — Day 9)
================================================================================
Defines request and response models for the conversational POST /chat endpoint.
================================================================================
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of speaker ('user' or 'assistant')")
    content: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    city: str = Field(..., description="Target city for environmental context (e.g. 'Pune')")
    health_profile: str = Field("none", description="User health profile ('none', 'asthma', 'elderly', 'child')")
    message: str = Field(..., description="Free-text user question")
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Prior conversation messages for context continuity")

class ChatResponse(BaseModel):
    response: str = Field(..., description="Conversational health guidance response grounded in WHO/EPA context")
    sources: List[str] = Field(default_factory=list, description="Titles of WHO/EPA guideline sources cited")
