from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Optional

from rag_chain import retrieve_chunks, generate_answer, rewrite_query
from database import create_db_and_tables, get_session
from models import ChatSession, ChatMessage, User
from routes import router as api_router
from auth import get_current_user #, oauth2_scheme, verify_password - Removed unused imports

# ... (rest of imports)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str
    session_id: Optional[str] = None
    history: List[str] = [] # Format: ["User: ...", "AI: ..."]

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(api_router)

from fastapi.security import HTTPAuthorizationCredentials

# ... (existing imports)

async def get_optional_user(request: Request, session: Session = Depends(get_session)):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None
        
        # Attempt to get user using the auth logic
        # We manually construct the credentials object
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        return await get_current_user(credentials, session)
    except Exception:
        # If any auth error occurs (invalid token, etc), just return None (Guest/Anonymous)
        return None

@app.post("/rag")
async def rag_endpoint(
    payload: Query, 
    session: Session = Depends(get_session),
    user: Optional[User] = Depends(get_optional_user)
):
    query = payload.query

    if query.isdigit():
        query = f"What is Section {query} IPC?"

    # 1. Use Chat History from Payload
    # The frontend is responsible for sending the relevant context (e.g. last 6 messages)
    chat_history = payload.history
    
    # 2. Rewrite Query if history exists
    search_query = query
    if chat_history:
        print(f"Original Query: {query}")
        search_query = rewrite_query(query, chat_history)
        print(f"Rewritten Search Query: {search_query}")

    # 3. Retrieve Documents using REWRITTEN query
    contexts, sources = retrieve_chunks(search_query)

    # 4. Generate Answer (Pass original query, but retrieval used context)
    result = generate_answer(query, contexts, sources, chat_history)
    
    # NOTE: We no longer save to SQLite here.
    # The frontend handles saving both User and AI messages to Firestore.
    
    # Return the result
    return result
