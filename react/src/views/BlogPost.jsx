import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import { api } from '../api'

export default function BlogPost() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPost(slug).then(setPost).catch(() => setPost(null)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <><Header /><div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted text-sm">加载中...</p></div></>
  if (!post) return <><Header /><div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted text-sm">文章不存在</p></div></>

  const title = lang === 'en' ? post.title : (post.titleZh || post.title)
  const content = lang === 'en' ? (post.contentEn || '') : (post.contentZh || '')
  const tags = (typeof post.tags === 'string' ? post.tags.split(',') : (post.tags || [])).filter(Boolean)

  return (
    <>
      <Header />
      <article className="min-h-screen pt-28 pb-40 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 text-sm text-muted mb-4">
              <span>{post.date}</span>
              <span className="text-black/20 dark:text-white/20">/</span>
              <span>{post.category}</span>
              <span className="text-black/20 dark:text-white/20">/</span>
              <span>{post.readTime} min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white leading-tight mb-4">{title}</h1>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs font-mono text-muted border border-black/10 dark:border-white/10 rounded px-2 py-0.5">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
          <div className="prose dark:prose-invert max-w-none text-black dark:text-white leading-relaxed whitespace-pre-wrap text-base">
            {content || (lang === 'en' ? post.summary : post.summaryZh)}
          </div>
        </div>
      </article>
    </>
  )
}
