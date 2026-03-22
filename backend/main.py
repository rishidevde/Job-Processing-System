import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, insert_job, get_all_jobs, get_job_by_id
from schemas import CreateJobRequest, JobResponse
from worker import start_worker

# ── App setup ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once on startup: create the DB table and launch the background worker."""
    init_db()
    start_worker()
    yield  # app runs here


app = FastAPI(title="Job Processor API", lifespan=lifespan)

# Allow the React frontend (running on a different port) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.post("/jobs", response_model=JobResponse, status_code=201)
def create_job(body: CreateJobRequest):
    """
    Create a new job and add it to the queue.
    Body: { "name": "My Job", "duration": 10 }
    """
    job_id     = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    insert_job(job_id, body.name, body.duration, created_at)

    return JobResponse(
        id=job_id,
        name=body.name,
        duration=body.duration,
        status="pending",
        created_at=created_at,
    )


@app.get("/jobs", response_model=list[JobResponse])
def list_jobs():
    """Return all jobs (newest first)."""
    return get_all_jobs()


@app.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: str):
    """Return a single job by its id."""
    job = get_job_by_id(job_id)

    if job is None:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

    return job