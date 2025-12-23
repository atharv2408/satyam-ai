from rag_chain import retrieve_chunks, generate_answer

# Test Query
query = "section 37"

print(f"Testing Query: '{query}'")

# 1. Retrieve
print("Retrieving...")
contexts, sources = retrieve_chunks(query)

if len(contexts) == 0:
    print("❌ FAILURE: No contexts found for Section 37.")
    exit(1)

print(f"Top Source: {sources[0]}")
print(f"Top Context Content: {contexts[0][:500]}...") # Print first 500 chars

if "ipc_act.txt" not in sources[0] and "Indian Penal Code" not in contexts[0]:
    print(f"⚠️ WARNING: Context might not be IPC. Got: {sources[0]}")
else:
    print("✅ SUCCESS: IPC context retrieved.")


# 2. Generate
print("\\nGenerating...")
response = generate_answer(query, contexts, sources)

print("\\nGenerated Answer:")
print(response["answer"])

if "Verified Database Answer" in response["answer"] or "Recovery" in response["answer"]:
    # The current code appends confidence score string for verified answers
    if response["confidence"] > 80:
         print("\\n✅ SUCCESS: Answered from database with high confidence.")
         exit(0)

print("\\n⚠️ PARTIAL/FAILURE: Answer generated but confidence low or not marked as verified.")
print(f"Confidence: {response.get('confidence')}")
exit(0)
