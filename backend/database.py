from sqlmodel import SQLModel, create_engine, Session
import os

# Check for DATABASE_URL (for Postgres/Neon)
database_url = os.getenv("DATABASE_URL")

if database_url:
    # Fix for some postgres drivers expecting postgresql:// instead of postgres://
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    # Using Postgres
    engine = create_engine(database_url, echo=False)
else:
    # Fallback to SQLite
    sqlite_file_name = "satyam.db"
    database_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(database_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
