from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "knowledge-service"


def test_upload_and_search_documents():
    payload = {
        "documents": [
            {"id": "doc-1", "title": "Politique de remboursement", "content": "Les clients peuvent demander un remboursement jusqu'à 30 jours après l'achat."},
            {"id": "doc-2", "title": "Support VPN", "content": "Pour réinitialiser le VPN, vérifiez votre mot de passe et redémarrez le client."}
        ]
    }

    upload_response = client.post("/api/documents/upload", json=payload)
    assert upload_response.status_code == 200
    assert upload_response.json()["stored"] == 2

    search_response = client.post(
        "/api/documents/search",
        json={"query": "remboursement client", "limit": 3}
    )
    assert search_response.status_code == 200
    results = search_response.json()["results"]
    assert len(results) >= 1
    assert any("remboursement" in result["content"].lower() for result in results)


def test_list_documents_and_document_chunking():
    payload = {
        "documents": [
            {
                "id": "doc-rag-1",
                "title": "Politique de remboursement",
                "content": "La politique de remboursement permet un remboursement complet dans les 14 jours.\nLe remboursement est traité par le service support."
            }
        ]
    }

    upload_response = client.post("/api/documents/upload", json=payload)
    assert upload_response.status_code == 200

    list_response = client.get("/api/documents")
    assert list_response.status_code == 200
    documents = list_response.json()["documents"]
    assert any(item["id"] == "doc-rag-1" for item in documents)

    search_response = client.post(
        "/api/documents/search",
        json={"query": "service support remboursement", "limit": 5}
    )
    assert search_response.status_code == 200
    results = search_response.json()["results"]
    assert results
    assert results[0]["id"] == "doc-rag-1"


def test_upload_text_file_creates_chunks():
    file_payload = {
        "file": ("refund-policy.txt", "La politique de remboursement couvre les commandes incomplètes.\nLe support client peut rembourser sous 48 heures.", "text/plain")
    }

    response = client.post("/api/documents/upload-file", files=file_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["stored"] >= 1
    assert "chunks" in data
    assert data["chunks"] >= 1
