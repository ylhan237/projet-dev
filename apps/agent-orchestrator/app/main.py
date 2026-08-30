from fastapi import FastAPI

app = FastAPI(title="Agent Orchestrator")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "agent-orchestrator"}
