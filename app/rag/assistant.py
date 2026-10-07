"""
app/rag/assistant.py
Conversational Project Intelligence Assistant Module (Milestone 3, Task 3).
Embeds user queries, performs RAG similarity retrieval from ChromaDB,
and synthesizes grounded answers using the LLM.
"""

from app.rag.embedder import embed_text
from app.rag.vector_store import query_similar, count_chunks
from app.agents.llm_client import call_text
from app.agents.prompts import ASSISTANT_RAG_SYSTEM_PROMPT
from app.models.schemas import ChatResponse, ChatSourceCitation


def answer_project_query(question: str, top_k: int = 5) -> ChatResponse:
    """
    RAG-powered Q&A grounded strictly in uploaded project documents.

    Args:
        question: User query string (e.g. "Are we on track?", "What are our risks?")
        top_k: Number of vector passages to retrieve

    Returns:
        ChatResponse with natural language answer and source citations.
    """
    if count_chunks() == 0:
        return ChatResponse(
            question=question,
            answer="No project documents have been uploaded yet. Please upload project documents first to enable the Conversational Assistant.",
            sources=[],
        )

    # 1. Embed query & search vector store
    query_embedding = embed_text(question)
    retrieved_chunks = query_similar(query_embedding, top_k=top_k)

    if not retrieved_chunks:
        return ChatResponse(
            question=question,
            answer="Based on the uploaded project documents, no relevant passages were found to answer your question.",
            sources=[],
        )

    # 2. Format retrieved context passages for the prompt
    context_blocks = []
    sources = []

    for i, c in enumerate(retrieved_chunks, start=1):
        context_blocks.append(
            f"--- PASSAGE {i} (Source: {c['source']}, Chunk ID: {c['chunk_id']}) ---\n"
            f"{c['text']}\n"
        )
        # Convert distance to relevance score (closer to 0 distance = higher similarity)
        relevance = round(max(0.0, 1.0 - (c.get("distance", 0.0) / 2.0)), 2)
        sources.append(
            ChatSourceCitation(
                source=c["source"],
                chunk_id=c["chunk_id"],
                relevance_score=relevance,
                text_snippet=c["text"][:150] + ("..." if len(c["text"]) > 150 else ""),
            )
        )

    context_str = "\n".join(context_blocks)

    user_prompt = (
        f"USER QUESTION: {question}\n\n"
        f"RETRIEVED PROJECT DOCUMENT PASSAGES:\n"
        f"{context_str}\n\n"
        f"Please provide a concise, well-structured answer to the question grounded ONLY in the passages above."
    )

    # 3. Call LLM to generate answer
    answer = call_text(ASSISTANT_RAG_SYSTEM_PROMPT, user_prompt)

    return ChatResponse(
        question=question,
        answer=answer,
        sources=sources,
    )
