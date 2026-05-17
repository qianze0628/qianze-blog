import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import FlipCard from './FlipCard'
import { api } from '../api'

const sectionV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } } }

export default function Projects() {
  const { t, lang } = useLanguage()
  const [projects, setProjects] = useState([])

  useEffect(() => { api.getProjects().then(setProjects).catch(() => {}) }, [])

  return (
    <motion.section id="projects" className="py-40 px-6 flex flex-col items-center" initial="hidden" whileInView="visible" viewport={{ amount: 0.15 }} variants={sectionV}>
      <div className="max-w-6xl w-full">
        <motion.div className="mb-16 text-center" variants={fadeUp}>
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-3">{t.projectsTitle}</h2>
          <p className="text-muted text-base">{t.projectsSubtitle}</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-5">
          {projects.map(p => (
            <motion.div key={p.num || p.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-[400px]" variants={fadeUp}>
              <FlipCard
                front={
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <span className="text-xs font-mono text-muted mb-2">{p.num}</span>
                    <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3">{p.title}</span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {(Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',')).map(tag => (
                        <span key={tag} className="text-xs font-mono text-muted border border-black/10 dark:border-white/10 rounded px-2 py-0.5">{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                }
                back={
                  <div className="flex flex-col items-center justify-center text-center h-full p-6">
                    <p className="text-xs uppercase tracking-widest text-white/50 dark:text-black/50 mb-2">{p.num}</p>
                    <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                    <p className="text-sm text-white/70 dark:text-black/70 mb-4 leading-relaxed">{lang === 'en' ? p.descEn : p.descZh}</p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="text-sm font-medium border border-white/40 dark:border-black/40 rounded-full px-4 py-1.5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                        {lang === 'en' ? 'Visit Site →' : '访问站点 →'}
                      </a>
                    )}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {(Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',')).map(tag => (
                        <span key={tag} className="text-xs font-mono text-white/40 dark:text-black/40 border border-white/20 dark:border-black/20 rounded px-2 py-0.5">{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
