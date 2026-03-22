import sqlite3
from typing import Optional

DB_FILE = "jobs.db"


def get_connection():
    """Open a connection to the SQLite database."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # lets us access columns by name (row["id"])
    return conn


def init_db():
    """Create the jobs table if it doesn't already exist."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id           TEXT PRIMARY KEY,
            name         TEXT NOT NULL,
            duration     INTEGER NOT NULL,
            status       TEXT NOT NULL DEFAULT 'pending',
            created_at   TEXT NOT NULL,
            completed_at TEXT
        )
    """)
    conn.commit()
    conn.close()


# ── CREATE ────────────────────────────────────────────────────────────────────

def insert_job(job_id: str, name: str, duration: int, created_at: str):
    """Save a new job to the database with status = pending."""
    conn = get_connection()
    conn.execute(
        "INSERT INTO jobs (id, name, duration, status, created_at) VALUES (?, ?, ?, 'pending', ?)",
        (job_id, name, duration, created_at),
    )
    conn.commit()
    conn.close()


# ── READ ──────────────────────────────────────────────────────────────────────

def get_all_jobs() -> list[dict]:
    """Return every job, newest first."""
    conn = get_connection()
    rows = conn.execute("SELECT * FROM jobs ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_job_by_id(job_id: str) -> Optional[dict]:
    """Return one job by its id, or None if not found."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_next_pending_job() -> Optional[dict]:
    """Return the oldest pending job (the worker uses this)."""
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1"
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ── UPDATE ────────────────────────────────────────────────────────────────────

def update_job_status(job_id: str, status: str, completed_at: Optional[str] = None):
    """Change a job's status (and optionally set the completed_at timestamp)."""
    conn = get_connection()
    conn.execute(
        "UPDATE jobs SET status = ?, completed_at = ? WHERE id = ?",
        (status, completed_at, job_id),
    )
    conn.commit()
    conn.close()