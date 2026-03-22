import { useState } from 'react'
import { createJob } from './api'

export default function JobForm({ onJobCreated }) {
  const [name, setName]         = useState('')
  const [duration, setDuration] = useState(10)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name.trim()) { setError('Job name cannot be empty.'); return }
    setLoading(true)
    try {
      const job = await createJob(name.trim(), duration)
      setSuccess(`Job "${job.name}" queued!`)
      setName('')
      setDuration(10)
      onJobCreated()
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) setError(detail.map(d => d.msg).join(', '))
      else setError(detail || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="job-name">Job name</label>
        <input
          id="job-name"
          type="text"
          placeholder="e.g. Process report"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={100}
          disabled={loading}
        />
      </div>
      <div className="field">
        <label>Duration</label>
        <div className="slider-row">
          <input
            type="range" min={5} max={30} step={1}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            disabled={loading}
          />
          <span className="slider-value">{duration}s</span>
        </div>
      </div>
      <button className="btn-submit" type="submit" disabled={loading}>
        {loading ? 'Queuing…' : '→ Queue job'}
      </button>
      {error   && <p className="msg msg-error">{error}</p>}
      {success && <p className="msg msg-success">{success}</p>}
    </form>
  )
}