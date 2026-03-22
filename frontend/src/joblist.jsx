import { useState, useEffect, useCallback } from 'react'
import { fetchJobs } from './api'

const POLL_INTERVAL_MS = 2500

function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {status}
    </span>
  )
}

function DurationBar({ seconds }) {
  const pct = Math.round((seconds / 30) * 100)
  return (
    <div className="duration-bar">
      <span>{seconds}s</span>
      <div className="bar-bg"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

export default function JobList({ refreshTrigger }) {
  const [jobs, setJobs]   = useState([])
  const [error, setError] = useState('')

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchJobs()
      setJobs(data)
      setError('')
    } catch {
      setError('Cannot reach backend — make sure it is running on port 8000.')
    }
  }, [])

  useEffect(() => { loadJobs() }, [refreshTrigger, loadJobs])
  useEffect(() => {
    const id = setInterval(loadJobs, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [loadJobs])

  return (
    <div className="panel">
      <div className="list-header">
        <p className="panel-label">All jobs</p>
        <div className="poll-indicator">
          <span className="poll-dot" />
          live · every {POLL_INTERVAL_MS / 1000}s
        </div>
      </div>
      {error && <p className="msg msg-error" style={{ marginBottom: 16 }}>{error}</p>}
      {jobs.length === 0 && !error ? (
        <div className="empty">no jobs yet — submit one on the left</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Status</th><th>Duration</th><th>Created</th><th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    {job.name}<br />
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>{job.id.slice(0, 8)}…</span>
                  </td>
                  <td><StatusBadge status={job.status} /></td>
                  <td><DurationBar seconds={job.duration} /></td>
                  <td>{formatTime(job.created_at)}</td>
                  <td>{formatTime(job.completed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}