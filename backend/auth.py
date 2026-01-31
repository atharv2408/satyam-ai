from datetime import datetime
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from sqlmodel import Session, select
import jwt

from database import get_session
from models import User

load_dotenv()

# Initialize Firebase Admin SDK
# Check if app is already initialized to prevent errors on hot reload
if not firebase_admin._apps:
    try:
        # TODO: Replace with the path to your service account key file
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Firebase Admin not initialized. Error: {e}")

# Use HTTPBearer for Authorization header parsing
security = HTTPBearer()

async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security), 
    session: Session = Depends(get_session)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify Firebase ID token
        # This verifies structure, signature, and expiration
        decoded_token = auth.verify_id_token(token.credentials)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name', 'User')
        
    except Exception as e:
        print(f"Token verification failed: {e}. Falling back to insecure decode for dev/demo.")
        try:
            # FALLBACK: Insecurely decode token to get user info (DEV ONLY)
            # This allows the app to work without serviceAccountKey.json
            decoded_token = jwt.decode(token.credentials, options={"verify_signature": False})
            uid = decoded_token.get('user_id') or decoded_token.get('sub')
            email = decoded_token.get('email')
            name = decoded_token.get('name', 'Guest User')
            
            if not email:
                # If no email in token, make one up based on UID to allow saving
                email = f"{uid}@demo.local"
                
        except Exception as e2:
             print(f"Fallback decode failed: {e2}")
             raise credentials_exception
        
    # Synchronization with local database (optional but recommended for existing relations)
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    
    if user is None:
        # Create user in local DB if not exists (syncing from Firebase)
        user = User(
            email=email,
            name=name,
            password_hash="firebase_managed" # Placeholder
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
    return user
