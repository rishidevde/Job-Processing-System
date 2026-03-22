import axios from 'axios'
const BASE = '/jobs'

export async function createJob(name, duration) {
  const res = await axios.post(BASE, { name, duration })
  return res.data
}
export async function fetchJobs() {
  const res = await axios.get(BASE)
  return res.data
}
export async function fetchJob(id) {
  const res = await axios.get(`${BASE}/${id}`)
  return res.data
}