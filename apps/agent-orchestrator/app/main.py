import re
from pathlib import Path

from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel, Field

app = FastAPI(title="Agent Orchestrator")
Instrumentator().instrument(app).expose(app)

AGENT_DEFINITIONS_DIR = Path(__file__).resolve().parent.parent / "agent-definitions"


class RouteRequest(BaseModel):
    message: str = Field(..., min_length=1)


class AgentExecutionRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: str | None = None


class AgentExecutionResponse(BaseModel):
    agent: str
    session_id: str | None
    response: str


def _extract_title(markdown_text: str) -> str:
    match = re.search(r"^#\s+(.+)$", markdown_text, re.MULTILINE)
    return match.group(1).strip() if match else "agent"


def _extract_role(markdown_text: str) -> str:
    match = re.search(r"^##\s+Role\s*\n\s*(.+)$", markdown_text, re.MULTILINE)
    return match.group(1).strip() if match else "agent"


def _load_agents() -> list[dict[str, str]]:
    agents = []
    for path in sorted(AGENT_DEFINITIONS_DIR.glob("*.md")):
        content = path.read_text(encoding="utf-8")
        agents.append({
            "name": path.stem,
            "title": _extract_title(content),
            "role": _extract_role(content),
            "path": str(path),
        })
    return agents


def _route_message(message: str) -> str:
    lowered = message.lower()

    if any(token in lowered for token in ["remboursement", "ticket", "annulation", "facture", "paiement", "créer"]):
        return "action"

    if any(token in lowered for token in ["règlement", "critique", "urgent", "litige", "réglementaire", "conflit"]):
        return "escalation"

    return "support"


def _build_response_for_agent(agent_name: str, message: str) -> str:
    lowered = message.lower()

    if agent_name == "support":
        if "vpn" in lowered:
            return (
                "Je vois que votre problème concerne le VPN. Vérifiez d’abord votre mot de passe, "
                "redémarrez le client VPN puis réessayez. Si l’erreur persiste, je peux vous guider vers "
                "une réinitialisation ou une escalade technique."
            )
        if "mot de passe" in lowered or "password" in lowered:
            return (
                "Le problème semble lié au mot de passe. Vérifiez que vous utilisez bien le bon identifiant "
                "et réinitialisez le mot de passe si nécessaire avant de réessayer."
            )
        return (
            "Je vais m’appuyer sur la base de connaissances et je vous répondrai avec les informations "
            "de référence du produit. Si le cas est ambigu, je demanderai une clarification ou j’escaladerai."
        )

    if agent_name == "action":
        return (
            "Je vais vérifier la demande métier, préparer l’action autorisée et demander une confirmation "
            "humaine si la procédure nécessite une validation supplémentaire."
        )

    if agent_name == "escalation":
        return (
            "Votre demande nécessite une validation humaine. Je résume le contexte et le transmet à un agent "
            "ou à un superviseur pour une décision rapide."
        )

    return f"Je traite votre demande avec l’agent {agent_name}."


app.state.agents = _load_agents()


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "agent-orchestrator"}


@app.get("/api/agents")
def list_agents():
    return {"agents": app.state.agents}


@app.post("/api/route")
def route_message(payload: RouteRequest):
    agent_name = _route_message(payload.message)
    reasons = {
        "support": "Demande d’information produit ou de troubleshooting sans action métier",
        "action": "Demande de remboursement, création de ticket ou action métier identifiable",
        "escalation": "Cas critique, réglementaire, litigieux ou hors scope",
    }
    return {"agent": agent_name, "message": payload.message, "reason": reasons[agent_name]}


@app.post("/api/agents/execute")
def execute_agent(payload: AgentExecutionRequest):
    agent_name = _route_message(payload.message)
    response = _build_response_for_agent(agent_name, payload.message)
    return {
        "agent": agent_name,
        "session_id": payload.session_id,
        "response": response,
    }
