import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { t, toggleLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToCoop = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/#coop')
      setTimeout(() => document.getElementById('coop')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      document.getElementById('coop')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const closeMenu = () => setMenuOpen(false)

  const nav = [
    { label: t.works, href: '/#works' },
    { label: t.articles, href: '/blog' },
    { label: t.thoughts, href: '/notes' },
    { label: t.space, href: '/space' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-6 pr-4 md:pl-8 md:pr-16 py-5 md:py-6 bg-[#fafafa]/80 dark:bg-[#050505]/80 backdrop-blur-md">
        <Link to="/" className="text-lg font-bold tracking-tight text-black dark:text-white">qianze<span className="text-muted">.</span></Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map(l => (
            <Link key={l.href} to={l.href} className="text-sm font-medium text-muted hover:text-black dark:hover:text-white transition-colors">{l.label}</Link>
          ))}
        </nav>

        {/* Right side: theme + lang + hamburger (mobile) / contact (desktop) */}
        <div className="flex items-center gap-3 md:gap-5">
          <button onClick={toggleLang} className="px-4 py-2 md:px-6 md:py-2.5 text-sm font-semibold text-muted border border-black/20 dark:border-white/20 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">中/EN</button>
          <button onClick={toggleTheme} className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center" aria-label="菜单">
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>

          <a href="/#coop" onClick={scrollToCoop} className="hidden sm:inline-block bg-black text-white dark:bg-white dark:text-black text-base font-semibold px-6 py-3 rounded-full hover:opacity-80 transition-opacity">{t.contactMe}</a>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm" />
          <nav className="absolute top-[64px] left-0 right-0 bg-[#fafafa] dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 px-6 py-8 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
            {nav.map(l => (
              <Link key={l.href} to={l.href} onClick={closeMenu} className="text-xl font-bold text-black dark:text-white hover:opacity-70 transition-opacity">{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
