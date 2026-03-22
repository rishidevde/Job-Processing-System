import time
import threading
from datetime import datetime, timezone

from database import get_next_pending_job, update_job_status

# How often (seconds) the worker checks for new pending jobs
POLL_INTERVAL = 2


def process_jobs():
    """
    Runs forever in a background thread.
    Each loop: grab the next pending job → process it → repeat.
    """
    print("[worker] Background worker started")

    while True:
        job = get_next_pending_job()

        if job is None:
            # No pending jobs right now — wait a bit and check again
            time.sleep(POLL_INTERVAL)
            continue

        job_id   = job["id"]
        job_name = job["name"]
        duration = job["duration"]

        print(f"[worker] Starting job '{job_name}' (id={job_id}, duration={duration}s)")

        # Mark as processing
        update_job_status(job_id, "processing")

        try:
            # Simulate work by sleeping for the requested duration
            time.sleep(duration)

            # Mark as completed
            completed_at = datetime.now(timezone.utc).isoformat()
            update_job_status(job_id, "completed", completed_at)
            print(f"[worker] Completed job '{job_name}' (id={job_id})")

        except Exception as e:
            # Something went wrong — mark as failed so it doesn't stay stuck
            completed_at = datetime.now(timezone.utc).isoformat()
            update_job_status(job_id, "failed", completed_at)
            print(f"[worker] Failed job '{job_name}' (id={job_id}): {e}")


def start_worker():
    """Start the worker in a daemon thread (dies when the main app exits)."""
    thread = threading.Thread(target=process_jobs, daemon=True)
    thread.start()