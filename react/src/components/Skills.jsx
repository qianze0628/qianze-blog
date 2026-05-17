import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import FlipCard from './FlipCard'
import { api } from '../api'

const sectionV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } } }

export default function Skills() {
  const { t, lang } = useLanguage()
  const [skills, setSkills] = useState([])

  useEffect(() => { api.getSkills().then(setSkills).catch(() => {}) }, [])

  return (
    <motion.section id="works" className="py-40 px-6 flex flex-col items-center" initial="hidden" whileInView="visible" viewport={{ amount: 0.15 }} variants={sectionV}>
      <div className="max-w-6xl w-full">
        <motion.div className="mb-16 text-center" variants={fadeUp}>
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-3">{t.skillsTitle}</h2>
          <p className="text-muted text-base">{t.skillsSubtitle}</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-5">
          {skills.map(s => (
            <motion.div key={s.name || s.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-[400px]" variants={fadeUp}>
              <FlipCard
                front={<div className="flex items-center justify-center h-full p-6"><span className="text-2xl sm:text-3xl font-bold text-black dark:text-white text-center">{s.name}</span></div>}
                back={
                  <div className="flex flex-col items-center justify-center text-center h-full p-6">
                    <p className="text-xs uppercase tracking-widest text-white/50 dark:text-black/50 mb-2">{t.proficiency}</p>
                    <div className="w-full h-1.5 bg-white/20 dark:bg-black/20 rounded-full mb-3"><div className="h-full bg-white dark:bg-black rounded-full" style={{ width: s.proficiency + '%' }} /></div>
                    <span className="text-2xl font-bold">{s.proficiency}%</span>
                    <p className="text-sm mt-3 text-white/70 dark:text-black/70">{lang === 'en' ? s.descEn : s.descZh}</p>
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
