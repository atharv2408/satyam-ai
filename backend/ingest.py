import os
import glob
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import PyPDF2

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "legal-index")

def ingest_pdfs():
    print("🚀 Starting Ingestion Process...")
    
    # 1. Initialize Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(INDEX_NAME)
    print(f"✅ Connected to Index: {INDEX_NAME}")

    # 2. Load Embedding Model
    print("🔄 Loading embedding model...")
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    # 3. Find Documents (PDFs and TXTs)
    pdf_files = glob.glob("*.pdf")
    txt_files = glob.glob("*.txt")
    
    all_files = pdf_files + txt_files
    
    if not all_files:
        print("❌ No PDF or TXT files found in current directory.")
        return

    print(f"found {len(all_files)} files: {all_files}")

    for file_path in all_files:
        print(f"\n📄 Processing: {file_path}")
        
        try:
            input_text = ""
            
            # Read File based on extension
            if file_path.endswith('.pdf'):
                reader = PyPDF2.PdfReader(file_path)
                for page in reader.pages:
                    input_text += page.extract_text() + "\n"
            elif file_path.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    input_text = f.read()
            
            print(f"   - Extracted {len(input_text)} characters.")
            
            # Simple Chunking (Overlapping windows)
            # Reduced size to capture specific sections better
            chunk_size = 500
            overlap = 250
            chunks = []
            
            for i in range(0, len(input_text), chunk_size - overlap):
                chunk = input_text[i:i + chunk_size]
                if len(chunk) > 50: # Filter tiny chunks (lowered from 100 for shorter text files)
                    chunks.append(chunk)

            print(f"   - Created {len(chunks)} chunks.")

            # Embed and Upsert
            vectors = []
            for i, chunk in enumerate(chunks):
                # Metadata
                meta = {
                    "text": chunk,
                    "source": file_path,
                    "chunk_id": i
                }
                
                # Create ID
                v_id = f"{file_path}_{i}"
                
                # Embed
                embedding = model.encode(chunk).tolist()
                
                vectors.append((v_id, embedding, meta))

            if not vectors:
                print(f"⚠️ No valid chunks found for {file_path}")
                continue

            # Batch Upsert (100 at a time)
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                index.upsert(vectors=batch)
                print(f"   - Upserted batch {i//batch_size + 1}/{(len(vectors)//batch_size)+1}")
                
            print(f"✅ Finished {file_path}")

        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")

if __name__ == "__main__":
    ingest_pdfs()
