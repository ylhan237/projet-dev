from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["service"] == "agent-orchestrator"


def test_agents_are_loaded_from_markdown_definitions():
    response = client.get("/api/agents")
    assert response.status_code == 200
    names = {agent["name"] for agent in response.json()["agents"]}
    assert {"router", "support", "action", "escalation"}.issubset(names)


def test_route_request_to_correct_agent():
    support_response = client.post("/api/route", json={"message": "Je ne comprends pas mon VPN"})
    assert support_response.status_code == 200
    assert support_response.json()["agent"] == "support"

    action_response = client.post("/api/route", json={"message": "Je veux un remboursement"})
    assert action_response.status_code == 200
    assert action_response.json()["agent"] == "action"

    escalation_response = client.post("/api/route", json={"message": "Conflit réglementaire majeur"})
    assert escalation_response.status_code == 200
    assert escalation_response.json()["agent"] == "escalation"


def test_support_agent_response_is_contextual():
    response = client.post(
        "/api/agents/execute",
        json={"message": "Mon VPN ne fonctionne plus, que faire ?", "session_id": "session-123"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["agent"] == "support"
    assert "VPN" in payload["response"] or "mot de passe" in payload["response"].lower()
    assert payload["session_id"] == "session-123"


def test_action_agent_requests_human_validation_for_sensitive_cases():
    response = client.post(
        "/api/agents/execute",
        json={"message": "Je veux rembourser une commande de 5000 euros et c'est critique", "session_id": "session-456"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["agent"] == "escalation"
    assert "humain" in payload["response"].lower() or "validation" in payload["response"].lower()


def test_router_returns_reason_for_agent_selection():
    response = client.post("/api/route", json={"message": "J'ai besoin d'un remboursement"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["agent"] == "action"
    assert "reason" in payload
    assert len(payload["reason"]) > 0
