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
