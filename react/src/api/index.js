const BASE = '/api'

let token = localStorage.getItem('admin_token') || null
export function getToken() { return token }
export function setToken(t) { token = t; if (t) localStorage.setItem('admin_token', t); else localStorage.removeItem('admin_token') }

async function req(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${url}`, { ...options, headers: { ...headers, ...options.headers } })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  login:       (pwd)       => req('/auth/login', { method: 'POST', body: JSON.stringify({ password: pwd }) }),
  getSkills:    ()          => req('/skills'),
  saveSkills:   (pwd, data) => req('/skills',    { method: 'PUT', body: JSON.stringify({ password: pwd, data }) }),
  getProjects:  ()          => req('/projects'),
  saveProjects: (pwd, data) => req('/projects',  { method: 'PUT', body: JSON.stringify({ password: pwd, data }) }),
  getPosts:     ()          => req('/posts'),
  getPost:      (slug)       => req('/posts/' + slug),
  savePosts:    (pwd, data) => req('/posts',     { method: 'PUT', body: JSON.stringify({ password: pwd, data }) }),
  getNotes:     ()          => req('/notes'),
  saveNotes:    (pwd, data) => req('/notes',     { method: 'PUT', body: JSON.stringify({ password: pwd, data }) }),
  getFriends:   ()          => req('/friends'),
  saveFriends:  (pwd, data) => req('/friends',   { method: 'PUT', body: JSON.stringify({ password: pwd, data }) }),
  getGuestbook: ()          => req('/guestbook'),
  postGuestbook:(author, msg, mood) => req('/guestbook', { method: 'POST', body: JSON.stringify({ author, message: msg, mood }) }),
  getStats:     (pwd)        => req('/stats',      { method: 'POST', body: JSON.stringify({ password: pwd }) }),
}
