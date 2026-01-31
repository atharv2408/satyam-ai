from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel import Session, select
from typing import List

from database import get_session
from models import User, ChatSession, ChatMessage
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Auth Routes - DEPRECATED/REMOVED
# Authentication is now handled by Firebase on the client side.
# The backend verifies the Firebase ID token via the `get_current_user` dependency.

# If you need to expose an endpoint to explicitly sync user data or handle
# specific server-side post-signup logic, you can add it here.
# For now, user synchronization happens automatically in `get_current_user`.

# Chat History Routes

@router.get("/chat/history", response_model=List[ChatSession])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Retrieve sessions for the current user
    statement = select(ChatSession).where(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc())
    chat_sessions = session.exec(statement).all()
    return chat_sessions

@router.get("/chat/session/{session_id}", response_model=List[ChatMessage])
async def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify session belongs to user
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")
        
    statement = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at)
    messages = session.exec(statement).all()
    return messages

class CreateSessionRequest(BaseModel):
    title: str = "New Chat"

@router.post("/chat/session", response_model=ChatSession)
async def create_chat_session(
    request: CreateSessionRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    new_session = ChatSession(user_id=current_user.id, title=request.title)
    session.add(new_session)
    session.commit()
    session.refresh(new_session)
    return new_session

@router.delete("/chat/session/{session_id}")
async def delete_chat_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Delete messages first
    statement = select(ChatMessage).where(ChatMessage.session_id == session_id)
    messages = session.exec(statement).all()
    for msg in messages:
        session.delete(msg)
        
    # Delete session
    session.delete(chat_session)
    session.commit()
    return {"status": "success", "message": "Session deleted"}


