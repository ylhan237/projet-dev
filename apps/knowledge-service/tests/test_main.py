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
