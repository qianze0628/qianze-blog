import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { lang, toggleLang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToCoop = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/#coop')
      setTimeout(() => {
        document.getElementById('coop')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById('coop')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const nav = [
    { label: t.works, href: '/#works' },
    { label: t.articles, href: '/blog' },
    { label: t.thoughts, href: '/notes' },
    { label: t.space, href: '/space' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-8 pr-16 py-6 bg-[#fafafa]/80 dark:bg-[#050505]/80 backdrop-blur-md">
      <Link to="/" className="text-lg font-bold tracking-tight text-black dark:text-white">qianze<span className="text-muted">.</span></Link>
      <nav className="hidden md:flex items-center gap-8">
        {nav.map(l => (
          <Link key={l.href} to={l.href} className="text-sm font-medium text-muted hover:text-black dark:hover:text-white transition-colors">{l.label}</Link>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <button onClick={toggleLang} className="px-6 py-2.5 text-sm font-semibold text-muted border border-black/20 dark:border-white/20 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">中 / EN</button>
        <button onClick={toggleTheme} className="w-11 h-11 flex items-center justify-center rounded-full border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Toggle theme">
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          )}
        </button>
        <a href="/#coop" onClick={scrollToCoop} className="hidden sm:inline-block bg-black text-white dark:bg-white dark:text-black text-base font-semibold px-6 py-3 rounded-full hover:opacity-80 transition-opacity">{t.contactMe}</a>
      </div>
    </header>
  )
}
