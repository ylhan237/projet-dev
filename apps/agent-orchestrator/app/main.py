import re
from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Agent Orchestrator")

AGENT_DEFINITIONS_DIR = Path(__file__).resolve().parent.parent / "agent-definitions"


class RouteRequest(BaseModel):
    message: str = Field(..., min_length=1)


def _extract_title(markdown_text: str) -> str:
    match = re.search(r"^#\s+(.+)$", markdown_text, re.MULTILINE)
    return match.group(1).strip() if match else "agent"


def _load_agents() -> list[dict[str, str]]:
    agents = []
    for path in sorted(AGENT_DEFINITIONS_DIR.glob("*.md")):
        content = path.read_text(encoding="utf-8")
        agents.append({
            "name": path.stem,
            "title": _extract_title(content),
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
    return {"agent": agent_name, "message": payload.message}
