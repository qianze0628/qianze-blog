import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import FlipCard from '../components/FlipCard'
import EmojiPicker from '../components/EmojiPicker'
import { api } from '../api'
import { getMediaUrl } from '../utils/mediaUrl'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } } }

export default function Space() {
  const { t, lang } = useLanguage()
  const [friends, setFriends] = useState([])
  const [entries, setEntries] = useState([])
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [mood, setMood] = useState('like')
  const [uploading, setUploading] = useState(false)
  const msgRef = useRef(null)

  useEffect(() => {
    api.getFriends().then(setFriends).catch(() => {})
    api.getGuestbook().then(setEntries).catch(() => {})
  }, [])

  const insertAtCursor = (text) => {
    const el = msgRef.current
    if (!el) return setMessage(prev => prev + text)
    const start = el.selectionStart; const end = el.selectionEnd
    const before = message.substring(0, start); const after = message.substring(end)
    setMessage(before + text + after)
    setTimeout(() => { el.focus(); el.selectionStart = el.selectionEnd = start + text.length }, 50)
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await fetch('/api/upload/public', { method: 'POST', body: (() => { const f = new FormData(); f.append('file', file); return f })() })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      insertAtCursor(`\n![图片](${data.url})\n`)
    } catch (err) { alert('上传失败: ' + (err.message || '')) }
    setUploading(false)
    e.target.value = ''
  }

  const submit = async () => {
    if (!message.trim()) return
    const entry = await api.postGuestbook(author, message, mood)
    setEntries(prev => [...prev, entry])
    setAuthor(''); setMessage('')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-40 px-6 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <motion.div className="mb-32 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-3">{t.friendsTitle}</h1>
            <p className="text-muted text-base">{lang === 'en' ? 'Fellow creators and friends.' : '同行者与朋友们。'}</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-5 mb-40">
            {friends.map((f, i) => (
              <motion.div key={f.name || i} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-[400px]" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <FlipCard
                  front={
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-2xl font-bold text-muted">{f.name?.[0]}</div>
                      <span className="text-xl font-bold text-black dark:text-white">{f.name}</span>
                      <p className="text-sm text-muted mt-1">{f.desc}</p>
                    </div>
                  }
                  back={
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <p className="text-lg font-bold mb-2">{f.name}</p>
                      <p className="text-sm text-white/70 dark:text-black/70 mb-4">{f.desc}</p>
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium border border-white/40 dark:border-black/40 rounded-full px-4 py-1.5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors">Visit Site →</a>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>

          {/* Music Ranking */}
          <MusicRanking />

          <div className="max-w-2xl mx-auto mt-24">
            <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-8">{t.guestbookTitle}</h2>
            <div className="mb-12">
              <div className="flex gap-3 mb-4">
                <input value={author} onChange={e => setAuthor(e.target.value)} placeholder={lang === 'en' ? 'Your name' : '你的名字'}
                  className="flex-1 bg-transparent border-0 border-b border-black/10 dark:border-white/10 px-0 py-2 text-sm text-black dark:text-white placeholder:text-muted focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                <select value={mood} onChange={e => setMood(e.target.value)} className="bg-transparent border-0 border-b border-black/10 dark:border-white/10 py-2 text-sm text-muted focus:outline-none">
                  <option value="like">👍</option><option value="admire">💚</option><option value="curious">🤔</option>
                </select>
              </div>
              <div className="relative">
                <textarea ref={msgRef} value={message} onChange={e => setMessage(e.target.value)} placeholder={t.guestbookPlaceholder} rows={4}
                  className="w-full bg-transparent border-0 border-b border-black/10 dark:border-white/10 px-0 py-2 pr-20 text-sm text-black dark:text-white placeholder:text-muted focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none" />
                <div className="absolute bottom-2 right-0 flex items-center gap-1">
                  <EmojiPicker onPick={insertAtCursor} />
                  <label className={`text-sm cursor-pointer hover:scale-125 transition-transform ${uploading ? 'opacity-40' : ''}`}>
                    {uploading ? '⏳' : '🖼'}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                  <button onClick={submit} disabled={!message.trim()}
                    className="bg-black text-white dark:bg-white dark:text-black text-sm font-medium px-5 py-2 rounded hover:opacity-80 disabled:opacity-30">{t.guestbookSubmit}</button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[...entries].reverse().map(e => (
                <div key={e.id} className="border border-black/5 dark:border-white/5 rounded-xl p-4 hover:border-black/20 dark:hover:border-white/20 transition-all">
                  <div className="text-sm text-black dark:text-white mb-2 leading-relaxed break-words">
                    <RichMessage text={e.message} />
                  </div>
                  <span className="text-xs text-muted">— {e.author} · {e.date?.substring(0, 19)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function RichMessage({ text }) {
  if (!text) return null
  // Split by image markdown ![alt](url) or custom emoji ![emoji](url)
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      const alt = imgMatch[1]
      const url = imgMatch[2]
      if (alt === 'emoji') {
        return <img key={i} src={getMediaUrl(url)} alt="" className="inline-block w-6 h-6 align-middle mx-0.5" />
      }
      return <img key={i} src={getMediaUrl(url)} alt={alt} className="max-w-full rounded-lg my-2" loading="lazy" />
    }
    return <span key={i}>{part}</span>
  })
}

function MusicRanking() {
  const [songs, setSongs] = useState([])
  useEffect(() => { api.getRanking().then(setSongs).catch(() => {}) }, [])
  const ranked = songs.slice(0, 5)
  if (ranked.length === 0) return null

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-6">播放排行</h2>
      <div className="space-y-2">
        {ranked.map((s, i) => (
          <div key={s.title + s.artist || i} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/30 border border-amber-200/30 dark:border-stone-700/30">
            <span className={`text-sm font-bold w-6 text-center ${i < 3 ? 'text-amber-500' : 'text-stone-400'}`}>
              {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black dark:text-white truncate">{s.title}</p>
              <p className="text-xs text-stone-400 truncate">{s.artist}</p>
            </div>
            <span className="text-xs text-stone-400 shrink-0">{s.totalCount || 0} 次播放</span>
          </div>
        ))}
      </div>
    </div>
  )
}
