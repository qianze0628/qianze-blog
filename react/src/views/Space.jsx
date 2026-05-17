import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import FlipCard from '../components/FlipCard'
import { api } from '../api'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } } }

export default function Space() {
  const { t, lang } = useLanguage()
  const [friends, setFriends] = useState([])
  const [entries, setEntries] = useState([])
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [mood, setMood] = useState('like')

  useEffect(() => {
    api.getFriends().then(setFriends).catch(() => {})
    api.getGuestbook().then(setEntries).catch(() => {})
  }, [])

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

          <div className="max-w-2xl mx-auto">
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
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t.guestbookPlaceholder} rows={3}
                  className="w-full bg-transparent border-0 border-b border-black/10 dark:border-white/10 px-0 py-2 text-sm text-black dark:text-white placeholder:text-muted focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none" />
                <button onClick={submit} disabled={!message.trim()}
                  className="absolute bottom-2 right-0 bg-black text-white dark:bg-white dark:text-black text-sm font-medium px-5 py-2 rounded hover:opacity-80 disabled:opacity-30">{t.guestbookSubmit}</button>
              </div>
            </div>
            <div className="space-y-4">
              {[...entries].reverse().map(e => (
                <div key={e.id} className="border border-black/5 dark:border-white/5 rounded p-4 hover:border-black/20 dark:hover:border-white/20 transition-all">
                  <p className="text-sm text-black dark:text-white mb-1">#{e.id}. &ldquo;{e.message}&rdquo;</p>
                  <span className="text-xs text-muted">— {e.author} @ {e.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
