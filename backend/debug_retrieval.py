from rag_chain import retrieve_chunks

query = "section 37"
contexts, sources = retrieve_chunks(query, top_k=5)

print(f"Query: {query}")
print(f"Total Retrieved: {len(sources)}")

for i, src in enumerate(sources):
    print(f"[{i}] {src}")
    print(f"    Content Snippet: {contexts[i][:100]}...")
