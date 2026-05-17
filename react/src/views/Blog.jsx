import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import { api } from '../api'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } } }

export default function Blog() {
  const { t, lang } = useLanguage()
  const [posts, setPosts] = useState([])

  useEffect(() => { api.getPosts().then(setPosts).catch(() => {}) }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-40 px-6 flex flex-col items-center">
        <div className="max-w-3xl w-full">
          <motion.div className="mb-20 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-3">{t.blogTitle}</h1>
            <p className="text-muted text-base">{t.blogSubtitle}</p>
          </motion.div>
          <div className="border-t border-black/10 dark:border-white/10">
            {posts.map((post, i) => (
              <motion.div key={post.slug || i}
                className="border-b border-black/10 dark:border-white/10"
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              >
                <Link to={'/blog/' + post.slug} className="block py-8 group">
                  <div className="flex items-baseline gap-4 text-sm text-muted mb-1">
                    <span>{post.date}</span><span className="text-black/20 dark:text-white/20">/</span>
                    <span>{post.category}</span><span className="text-black/20 dark:text-white/20">/</span>
                    <span>{post.readTime} {t.readTime}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white group-hover:opacity-70 transition-opacity mb-2">
                    {lang === 'en' ? post.title : post.titleZh}
                  </h2>
                  <p className="text-muted text-sm max-w-xl">{lang === 'en' ? post.summary : post.summaryZh}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(Array.isArray(post.tags) ? post.tags : (post.tags || '').split(',')).map(tag => (
                      <span key={tag} className="text-xs font-mono text-muted border border-black/10 dark:border-white/10 rounded px-2 py-0.5">{tag.trim()}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
