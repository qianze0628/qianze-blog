import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../api'

const sectionV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] } } }

export default function HomeBlog() {
  const { lang } = useLanguage()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.getPosts().then(all => {
      const featured = all.filter(p => p.featured)
      const display = featured.length > 0 ? featured.slice(0, 3) : all.slice(0, 3)
      setPosts(display)
    }).catch(() => {})
  }, [])

  if (posts.length === 0) return null

  return (
    <motion.section className="py-40 px-6 flex flex-col items-center" initial="hidden" whileInView="visible" viewport={{ amount: 0.15 }} variants={sectionV}>
      <div className="max-w-6xl w-full">
        <motion.div className="mb-16 text-center" variants={fadeUp}>
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-3">{lang === 'en' ? 'Featured Articles' : '精选文章'}</h2>
          <p className="text-muted text-base">{lang === 'en' ? 'Selected writings and thoughts.' : '精选写作与思考。'}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.div key={post.slug || i} variants={fadeUp}>
              <Link to={'/blog/' + post.slug} className="block border border-black/10 dark:border-white/10 bg-white dark:bg-black rounded-2xl p-6 h-full hover:border-black/30 dark:hover:border-white/30 transition-colors group">
                <span className="text-xs text-muted">{post.date}</span>
                <h3 className="text-lg font-bold text-black dark:text-white mt-2 mb-2 group-hover:opacity-70 transition-opacity">
                  {lang === 'en' ? post.title : (post.titleZh || post.title)}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">
                  {lang === 'en' ? post.summary : (post.summaryZh || post.summary)}
                </p>
                <span className="inline-block text-xs font-medium text-muted mt-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {lang === 'en' ? 'Read more →' : '阅读更多 →'}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
