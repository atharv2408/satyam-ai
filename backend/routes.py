from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List

from database import get_session
from models import User, ChatSession, ChatMessage
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from pydantic import BaseModel

router = APIRouter()

# Schema for Signup
class UserSignup(BaseModel):
    name: str
    email: str
    password: str

# Schema for Token
class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str

# Auth Routes
@router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserSignup, session: Session = Depends(get_session)):
    # Check if user exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=get_password_hash(user_data.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Generate token
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user_name": new_user.name, "user_email": new_user.email}

@router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    # OAuth2PasswordRequestForm expects 'username', but we use it as email
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user_name": user.name, "user_email": user.email}

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
