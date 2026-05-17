import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import { api } from '../api'

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const child = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] } } }

export default function Notes() {
  const { t } = useLanguage()
  const [notes, setNotes] = useState([])
  useEffect(() => { api.getNotes().then(setNotes).catch(console.error) }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-40 px-6 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <motion.div className="mb-20 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-3">{t.notesTitle}</h1>
            <p className="text-muted text-base">{t.notesSubtitle}</p>
          </motion.div>
          <motion.div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5" variants={container} initial="hidden" animate="visible">
            {notes.map(note => (
              <motion.div key={note.id} className="break-inside-avoid border border-black/10 dark:border-white/10 bg-white dark:bg-black rounded p-5 hover:border-black/30 dark:hover:border-white/30 transition-colors" variants={child}>
                {note.type === 'code' ? <pre className="text-xs font-mono text-muted whitespace-pre-wrap">{note.content}</pre>
                  : <p className="text-sm text-black dark:text-white leading-relaxed">{note.content}</p>}
                <span className="block text-xs text-muted mt-3">{note.date}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </>
  )
}
