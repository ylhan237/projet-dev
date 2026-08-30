from fastapi import FastAPI

app = FastAPI(title="Knowledge Service")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "knowledge-service"}
