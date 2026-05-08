from datetime import datetime, timezone
from fastapi import FastAPI

app = FastAPI(title="Health Check Service")

VERSION = "1.0.0"
START_TIME = datetime.now(timezone.utc)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": VERSION,
        "uptime_seconds": (datetime.now(timezone.utc) - START_TIME).total_seconds(),
    }


@app.get("/health/ready")
async def readiness_check():
    """K8s readiness probe 可用"""
    return {"status": "ready"}
