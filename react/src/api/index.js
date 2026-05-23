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
  shareToken:  (pwd, days) => req('/auth/share', { method: 'POST', body: JSON.stringify({ password: pwd, days: String(days || 7) }) }),
  me:          ()          => req('/auth/me',   { method: 'POST' }),
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
  deleteGuestbook:(id)       => req('/guestbook/' + id, { method: 'DELETE' }),
  postGuestbook:(author, msg, mood) => req('/guestbook', { method: 'POST', body: JSON.stringify({ author, message: msg, mood }) }),
  getStats:     (pwd)        => req('/stats',      { method: 'POST', body: JSON.stringify({ password: pwd }) }),

  // Songs
  getSongs:     ()          => req('/songs'),
  createSong:   (song)      => req('/songs',       { method: 'POST', body: JSON.stringify(song) }),
  updateSong:   (id, song)  => req('/songs/' + id, { method: 'PUT', body: JSON.stringify(song) }),
  deleteSong:   (id)        => req('/songs/' + id, { method: 'DELETE' }),
  searchMusic:  (q, type)  => req('/songs/search?q=' + encodeURIComponent(q) + '&type=' + (type || '')),
  getPlayUrl:   (mp3Id)    => req('/songs/play?mp3Id=' + encodeURIComponent(mp3Id)),
  importSong:   (data)      => req('/songs/import', { method: 'POST', body: JSON.stringify(data) }),
  importBatch:  (songs)     => req('/songs/import-batch', { method: 'POST', body: JSON.stringify({ songs }) }),
  checkSource:  (id)        => req('/songs/check/' + id),

  // File upload (multipart, not JSON)
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const h = {}
    if (token) h['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${BASE}/upload`, { method: 'POST', headers: h, body: formData })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Music-specific uploads (goes to /music/ directory)
  uploadMusicFile: async (file, type) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type || 'audio')
    const h = {}
    if (token) h['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${BASE}/upload/music`, { method: 'POST', headers: h, body: formData })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  recordPlay: async (id) => {
    try { await req(`/songs/${id}/play`, { method: 'POST' }) } catch {}
  },
  trackGuestMusic: async (song) => {
    try { await req('/songs/track', { method: 'POST', body: JSON.stringify(song) }) } catch {}
  },
  getGuestMusicLogs: () => req('/songs/guest-logs'),
  getRanking:     ()          => req('/songs/ranking'),
  getTopSearched: () => req('/songs/top-searched'),

  // Translation (MyMemory free API)
  translate: async (text, from, to) => {
    if (!text || !text.trim()) return ''
    const q = encodeURIComponent(text.trim())
    const pair = from === 'zh' ? 'zh|en' : 'en|zh'
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=${pair}`)
    if (!res.ok) throw new Error('翻译服务不可用')
    const data = await res.json()
    return data?.responseData?.translatedText || ''
  },
}
