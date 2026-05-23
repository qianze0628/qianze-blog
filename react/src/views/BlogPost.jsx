import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import { api } from '../api'
import { getMediaUrl } from '../utils/mediaUrl'

function renderContent(text) {
  if (!text) return ''
  // Convert markdown images ![alt](url) to <img> — normalize URL via getMediaUrl
  let html = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) =>
    `<img src="${getMediaUrl(url)}" alt="${alt}" loading="lazy" class="max-w-full rounded-xl my-6">`
  )
  // Split into paragraphs by double newlines
  const paras = html.split(/\n\n+/)
  return paras.map(p => {
    if (!p.trim()) return ''
    const lines = p.split('\n').map(line => {
      if (/<img\s/.test(line)) return line
      return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    })
    return '<p>' + lines.join('<br>') + '</p>'
  }).join('')
}

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
          <div
            className="prose dark:prose-invert max-w-none text-black dark:text-white leading-relaxed text-base [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6"
            dangerouslySetInnerHTML={{ __html: renderContent(content || (lang === 'en' ? post.summary : post.summaryZh)) }}
          />
        </div>
      </article>
    </>
  )
}
