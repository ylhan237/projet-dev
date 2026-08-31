import hashlib
import html
import re
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel, Field

app = FastAPI(title="Knowledge Service")
Instrumentator().instrument(app).expose(app)


class DocumentItem(BaseModel):
    id: str
    title: str
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)


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
app.state.chunks: list[dict[str, Any]] = []


def _normalize_tokens(text: str) -> list[str]:
    text = html.unescape(text)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.findall(r"\b[\w-]+\b", text.lower())


def _split_into_chunks(text: str, title: str, chunk_size: int = 500, overlap: int = 80) -> list[str]:
    normalized_text = re.sub(r"\s+", " ", text).strip()
    if not normalized_text:
        return []

    words = _normalize_tokens(normalized_text)
    if len(words) <= chunk_size:
        return [f"{title}\n\n{normalized_text}"]

    chunks: list[str] = []
    window = chunk_size
    step = max(1, chunk_size - overlap)
    for start in range(0, len(words), step):
        window_words = words[start:start + window]
        if not window_words:
            continue
        chunk_text = " ".join(window_words)
        chunks.append(f"{title}\n\n{chunk_text}")
    return chunks


def _document_id(title: str, content: str) -> str:
    payload = f"{title}:{content}".encode("utf-8")
    return hashlib.sha1(payload).hexdigest()[:12]


def _score_tokens(query: str, chunk: str) -> float:
    query_tokens = _normalize_tokens(query)
    chunk_tokens = _normalize_tokens(chunk)
    if not query_tokens or not chunk_tokens:
        return 0.0

    query_counter = {token: query_tokens.count(token) for token in set(query_tokens)}
    chunk_counter = {token: chunk_tokens.count(token) for token in set(chunk_tokens)}
    common_tokens = set(query_counter) & set(chunk_counter)
    if not common_tokens:
        return 0.0

    overlap = sum(min(query_counter[token], chunk_counter[token]) for token in common_tokens)
    query_weight = sum(value * value for value in query_counter.values())
    chunk_weight = sum(value * value for value in chunk_counter.values())
    denom = (query_weight * chunk_weight) ** 0.5
    if denom == 0:
        return 0.0

    cosine = sum(query_counter[token] * chunk_counter[token] for token in common_tokens) / denom
    phrase_bonus = 0.15 if all(token in chunk_tokens for token in query_tokens[:3]) else 0.0
    return round(min(1.0, cosine + (overlap / max(len(query_tokens), 1)) + phrase_bonus), 4)


def _store_document(document: DocumentItem) -> None:
    existing = next((item for item in app.state.documents if item.id == document.id), None)
    if existing:
        app.state.documents = [item for item in app.state.documents if item.id != document.id]
        app.state.chunks = [chunk for chunk in app.state.chunks if chunk["document_id"] != document.id]

    app.state.documents.append(document)
    chunk_texts = _split_into_chunks(document.content, document.title)
    for chunk_index, chunk_text in enumerate(chunk_texts):
        app.state.chunks.append({
            "id": f"{document.id}-chunk-{chunk_index}",
            "document_id": document.id,
            "title": document.title,
            "content": chunk_text,
        })


def _parse_text_content(file_name: str, raw_bytes: bytes) -> str:
    name = (file_name or "").lower()
    if name.endswith(".pdf"):
        try:
            from pypdf import PdfReader
        except ImportError as exc:  # pragma: no cover
            raise HTTPException(status_code=400, detail="PDF parsing requires pypdf to be installed.") from exc

        reader = PdfReader(__import__("io").BytesIO(raw_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(page for page in pages if page).strip()

    if name.endswith((".md", ".txt", ".html", ".htm")):
        try:
            return raw_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return raw_bytes.decode("latin-1")

    return raw_bytes.decode("utf-8", errors="ignore")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "knowledge-service"}


@app.get("/api/documents")
def list_documents() -> dict[str, list[dict[str, Any]]]:
    return {"documents": [document.model_dump() for document in app.state.documents]}


@app.post("/api/documents/upload")
def upload_documents(payload: UploadRequest) -> dict[str, Any]:
    stored = 0
    for document in payload.documents:
        doc = DocumentItem(
            id=document.id or _document_id(document.title, document.content),
            title=document.title,
            content=document.content,
            metadata=document.metadata,
        )
        _store_document(doc)
        stored += 1

    return {
        "stored": stored,
        "total_documents": len(app.state.documents),
        "total_chunks": len(app.state.chunks),
    }


@app.post("/api/documents/upload-file")
async def upload_file(file: UploadFile = File(...)) -> dict[str, Any]:
    raw = await file.read()
    content = _parse_text_content(file.filename or "upload.txt", raw)
    document = DocumentItem(
        id=_document_id(file.filename or "uploaded-document", content),
        title=file.filename or "Uploaded document",
        content=content,
        metadata={"source": "upload-file", "filename": file.filename or "uploaded-document"},
    )
    _store_document(document)
    return {
        "stored": 1,
        "document_id": document.id,
        "chunks": sum(1 for chunk in app.state.chunks if chunk["document_id"] == document.id),
    }


@app.post("/api/documents/search")
def search_documents(payload: SearchRequest) -> dict[str, list[dict[str, Any]]]:
    scored: list[dict[str, Any]] = []
    for chunk in app.state.chunks:
        score = _score_tokens(payload.query, chunk["content"])
        if score > 0:
            scored.append({
                "id": chunk["document_id"],
                "title": chunk["title"],
                "content": chunk["content"],
                "score": score,
            })

    scored.sort(key=lambda item: item["score"], reverse=True)
    return {"results": scored[: payload.limit]}
