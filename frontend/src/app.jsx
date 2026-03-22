import { useState } from 'react'
import JobForm from './jobform'
import JobList from './joblist'

export default function App() {
  const [refreshTick, setRefreshTick] = useState(0)

  function handleJobCreated() {
    setRefreshTick(t => t + 1)
  }
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-dot" />
        <span className="header-title">Job Processor</span>
      </header>

      {/* ── Two-column layout ── */}
      <main className="main">
        {/* Left: submit form */}
        <div className="panel panel-left">
          <p className="panel-label">New job</p>
          <JobForm onJobCreated={handleJobCreated} />
        </div>

        {/* Right: live job list */}
        <JobList refreshTrigger={refreshTick} />
      </main>
    </div>
  )
}