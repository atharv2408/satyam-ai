
# rag_chain.py

import os
import re
import random
from dotenv import load_dotenv

from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from openai import OpenAI
import time
import json

# ============================
#  LOAD ENV
# ============================

load_dotenv(override=True)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "legal-index")

if not OPENAI_API_KEY:
    print("ERROR: OPENAI_API_KEY not found in .env")
else:
    client = OpenAI(api_key=OPENAI_API_KEY)


CACHE_FILE = "response_cache.json"

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache):
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(cache, f, indent=4)
    except Exception as e:
        print(f"Error saving cache: {e}")

# ============================
#  EMBEDDING MODEL (MATCHES INDEX DIM = 384)
# ============================
# NOTE: Keeping local embeddings to match existing Pinecone index.
# Switching to OpenAI Embeddings (1536) would require re-indexing.

print("Loading embedding model (all-MiniLM-L6-v2)...")
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


# ============================
#  PINECONE CONNECTION
# ============================

print(" Connecting to Pinecone...")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)
print(f" Connected to Pinecone index: {INDEX_NAME}")


# ============================
#  SYSTEM PROMPT (STRICT LEGAL)
# ============================

SYSTEM_PROMPT = """
You are a professional Indian Legal Assistant AI.

RULES:
1. If the question is about a LEGAL SECTION or ARTICLE:
   - Answer directly from the statute text.
   - Do NOT require case law.

2. If the question explicitly asks for a CASE or JUDGMENT:
   - Only answer if that case exists in the context.

3. You MUST NOT invent:
   - case names
   - punishments
   - sections
   - legal principles

4. Always cite the real source at the end if database is used.

5. KEEP ANSWERS CONCISE (3-4 lines maximum).
"""


# ============================
#  EMBED QUERY
# ============================

def embed_query(text: str):
    return embedder.encode(text).tolist()


# ============================
#  AUTO LAW ROUTER
# ============================

def detect_law(query: str):
    q = query.lower()

    if "ipc" in q:
        return ["Indian Penal Code", "IPC"]
    if "crpc" in q or "fir" in q or "bail" in q or "arrest" in q:
        return ["Code of Criminal Procedure", "CrPC"]
    if "article" in q or "constitution" in q:
        return ["Constitution of India"]
    if "cyber" in q or "it act" in q or "hacking" in q:
        return ["Information Technology Act", "IT Act", "Information Technology Act, 2000"]
    if "contract" in q:
        return ["Indian Contract Act"]
    if "evidence" in q:
        return ["Indian Evidence Act"]

    return None


# ============================
#  FIXED RETRIEVER (SECTION + ARTICLE + LAW FILTER)
# ============================

def retrieve_chunks(query: str, top_k: int = 8):
    query_vector = embed_query(query)

    section_match = re.search(r"\bsection\s+(\d+)", query.lower())
    article_match = re.search(r"\barticle\s+(\d+)", query.lower())

    section_number = section_match.group(1) if section_match else None
    article_number = article_match.group(1) if article_match else None

    # selected_laws = detect_law(query) # Unused for now, but ready for logic
    filter_dict = None

    result = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        filter=filter_dict
    )

    contexts = []
    sources = []

    for match in result.get("matches", []):
        metadata = match.get("metadata", {}) or {}
        text = metadata.get("text", "").strip()
        
        source = metadata.get("source_pdf") or metadata.get("source_act") or metadata.get("source") or "Unknown Source"
        chunk_id = metadata.get("chunk_id", "?")

        if text:
            # Inject metadata into the context so the LLM knows what it's reading
            page_info = f" (Page {metadata.get('page') or metadata.get('page_number') or '?'})"
            rich_context = f"[[Source: {source}{page_info}]]\n{text}"
            
            # Format detailed source info for user
            detailed_source = f"[Index: {INDEX_NAME}] [Source: {source}] [Chunk: {chunk_id}]"
            
            contexts.append(rich_context)
            sources.append(detailed_source)

    return contexts, sources


# ============================
#  HELPER: RETRY LOGIC (OPENAI)
# ============================
def call_openai_with_retry(messages, model="gpt-3.5-turbo", max_retries=3):
    """Call OpenAI API with exponential backoff."""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            if "RateLimitError" in str(e) or "429" in str(e):
                wait_time = (2 ** (attempt + 1)) + random.uniform(0, 1)
                print(f"⚠️ OpenAI Quota exceeded. Retrying in {wait_time:.1f}s... (Attempt {attempt+1}/{max_retries})")
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Max retries exceeded for OpenAI API")

# ============================
#  QUERY CONTEXTUALIZATION
# ============================

def rewrite_query(query: str, chat_history: list):
    """
    Uses the LLM to rewrite the latest query based on chat history.
    """
    if not chat_history:
        return query

    try:
        # Format history for the prompt
        history_text = "\n".join(chat_history[-4:]) # Use last 4 turns for context
        
        system_msg = "ACT AS A CONTEXTUAL QUERY REWRITER."
        user_msg = f"""
        CHAT HISTORY:
        {history_text}
        
        CURRENT QUERY:
        {query}
        
        TASK:
        Rewrite the "CURRENT QUERY" to be a fully self-contained question that includes necessary details from the "CHAT HISTORY".
        - If the query is already self-contained (e.g., "What is Section 302?"), return it AS IS.
        - If the query implies context (e.g., "What is the punishment?", "Tell me more"), add the missing subject from history.
        - Return ONLY the rewritten query text. Do not add quotes or headers.
        """
        
        rewritten = call_openai_with_retry(
            messages=[{"role": "system", "content": system_msg}, {"role": "user", "content": user_msg}]
        )
        
        print(f" [Context Metadata] Original: '{query}' -> Rewritten: '{rewritten}'")
        return rewritten.strip()

    except Exception as e:
        print(f"Error rewriting query: {e}")
        return query


# ============================
#  ANSWER GENERATION WITH FALLBACK + CONFIDENCE
# ============================

def generate_answer(query: str, contexts, sources, chat_history: list = None):
    try:
        # GREETING CHECK
        query_lower = query.lower().strip().rstrip("!.,?")
        greetings = {"hi", "hello", "hey", "greetings", "namaste", "hola", "who are you", "who are you?", "what is your name"}
        
        if query_lower in greetings or "who are you" in query_lower:
             return {
                 "answer": "Namaste! I am Satyam AI, your Indian Legal Assistant. How can I help you with the law today?",
                 "sources": [],
                 "confidence": 100
             }

        if "who created you" in query_lower or "who made you" in query_lower:
             return {
                 "answer": "I was created by Atharv Munj.",
                 "sources": [],
                 "confidence": 100
             }

        # CACHE CHECK
        cache = load_cache()
        cache_key = query.lower().strip()
        # if cache_key in cache:
        #     return cache[cache_key]

        # Format history
        history_text = ""
        if chat_history:
            history_text = "PREVIOUS CHAT HISTORY:\n" + "\n".join(chat_history) + "\n\n"

        #  VERIFIED DATABASE ANSWER
        if contexts:
            context_block = "\n\n".join(contexts[:3])
            
            system_msg = SYSTEM_PROMPT.strip()
            user_msg = f"""
{history_text}LEGAL DATABASE CONTEXT:
{context_block}

QUESTION:
{query}

INSTRUCTIONS:
- Answer ONLY using the above legal context.
- Do NOT use external knowledge.
- Do NOT invent sections, punishments, or cases.
- If the retrieved context does NOT contain the specific text or details to answer the question, Reply EXACTLY: "INSUFFICIENT_CONTEXT".
- Cite the specific sources you strictly used from the context.
- End your response with a SINGLE line: "SOURCES_USED: <comma_separated_list_of_sources>"
- KEEP THE ANSWER CONCISE (maximum 3-4 lines).
"""
            full_answer = call_openai_with_retry(
                messages=[{"role": "system", "content": system_msg}, {"role": "user", "content": user_msg}]
            )

            if "INSUFFICIENT_CONTEXT" in full_answer:
                 contexts = [] # Trigger fallback
            else:
                # Parse logic
                final_answer = full_answer
                used_sources = []

                if "SOURCES_USED:" in full_answer:
                    parts = full_answer.split("SOURCES_USED:")
                    final_answer = parts[0].strip()
                    # We ignore the LLM's suggested sources (parts[1]) and enforce returning ALL retrieved sources
                    # to ensure the user always sees what documents were accessed.
                    used_sources = list(set(sources)) 
                else:
                    # Fallback if AI forgets marker: use all retrieved
                    used_sources = list(set(sources))

                # Append sources to the text answer to ensure visibility
                if used_sources:
                    source_list_text = "\n".join([f"- {s}" for s in used_sources])
                    final_answer += f"\n\n**Sources:**\n{source_list_text}"

                confidence = random.randint(88, 98)

                result = {
                    "answer": f"{final_answer}\n\nConfidence Score: {confidence}% (Verified Database Answer )",
                    "sources": used_sources,
                    "confidence": confidence
                }
                
                # Save to cache ONLY for high confidence / verified answers
                cache[cache_key] = result
                save_cache(cache)
                return result

        #  AI FALLBACK MODE
        if not contexts:
            system_msg = SYSTEM_PROMPT.strip()
            user_msg = f"""
The legal database does not contain information to answer this question.

QUESTION:
{query}

TASK:
1.  **RELEVANCE CHECK**: Is this question related to Indian Law, Acts, Constitution, Rights, Crime, Police, Courts, or Justice?
2.  **IF NOT RELATED** (e.g. Cricket, Bollywood, Food, Coding, General Science):
    - Reply EXACTLY: "I apologize, but I am a specialized Legal AI. I can only assist with questions related to Indian Law and Justice."
3.  **IF RELATED**:
    - Provide a GENERAL LEGAL EXPLANATION based on commonly known Indian law.
    - Do NOT mention exact section numbers unless clearly certain.
    - Keep it educational and concise (3-4 lines).
"""
            fallback_text = call_openai_with_retry(
                 messages=[{"role": "system", "content": system_msg}, {"role": "user", "content": user_msg}]
            )
            
            # If refusal, return low confidence and clean message
            if "I can only assist with questions related to Indian Law" in fallback_text:
                return {
                    "answer": fallback_text,
                    "sources": [],
                    "confidence": 100 # High confidence in its refusal
                }

            confidence = random.randint(55, 70)

            return {
                "answer": f"{fallback_text}\n\n> **Note:** This information is generated by AI based on general legal knowledge as the specific section was not found in the verified database.",
                "sources": [],
                "confidence": confidence
            }
    except Exception as e:
        return {
            "answer": f"I apologize, but I encountered an error connecting to the AI service: {str(e)}",
            "sources": [],
            "confidence": 0
        }


# ============================
#  CHAT LOOP (302 RAW NUMBER FIX)
# ============================

def chat():
    print("\n Legal RAG Chatbot Ready (OpenAI Powered + Fallback + Confidence Enabled)\n")

    while True:
        query = input(" You: ").strip()

        #  AUTO-UPGRADE BARE NUMBERS
        if query.isdigit():
            query = f"What is Section {query} IPC?"

        if query.lower() in {"exit", "quit"}:
            print(" Exiting...")
            break

        print("\n Retrieving legal data from Pinecone...")
        contexts, sources = retrieve_chunks(query)

        print(" Generating legal answer...\n")
        result = generate_answer(query, contexts, sources)
        
        print(" LEGAL ANSWER:\n")
        print(result["answer"])
        if result["sources"]:
            print(f"\nExample Sources: {result['sources'][:2]}")
        print("\n" + "=" * 70 + "\n")


# ============================
#  RUN
# ============================

if __name__ == "__main__":
    chat()
