import re
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Knowledge Service")


class DocumentItem(BaseModel):
    id: str
    title: str
    content: str


class UploadRequest(BaseModel):
    documents: list[DocumentItem] = Field(..., min_length=1)


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    limit: int = Field(default=5, ge=1, le=20)


class SearchResult(BaseModel):
    id: str
    title: str
    content: str
    score: float


app.state.documents: list[DocumentItem] = []


def _normalize(text: str) -> list[str]:
    return re.findall(r"\b[\w-]+\b", text.lower())


def _score_document(query: str, document: DocumentItem) -> float:
    query_tokens = set(_normalize(query))
    if not query_tokens:
        return 0.0

    document_tokens = set(_normalize(document.title + " " + document.content))
    overlap = query_tokens & document_tokens
    if not overlap:
        return 0.0

    weight = len(overlap) / max(len(query_tokens), 1)
    title_bonus = 0.2 if any(token in _normalize(document.title) for token in query_tokens) else 0.0
    return round(weight + title_bonus, 4)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "knowledge-service"}


@app.post("/api/documents/upload")
def upload_documents(payload: UploadRequest) -> dict[str, Any]:
    app.state.documents.extend(payload.documents)
    return {"stored": len(payload.documents), "total_documents": len(app.state.documents)}


@app.post("/api/documents/search")
def search_documents(payload: SearchRequest) -> dict[str, list[dict[str, Any]]]:
    scored = []
    for document in app.state.documents:
        score = _score_document(payload.query, document)
        if score > 0:
            scored.append({
                "id": document.id,
                "title": document.title,
                "content": document.content,
                "score": score,
            })

    scored.sort(key=lambda item: item["score"], reverse=True)
    return {"results": scored[: payload.limit]}
