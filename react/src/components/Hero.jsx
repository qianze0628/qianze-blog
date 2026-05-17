import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { lang, toggleLang, headingText, otherHeading, bioText, otherBio, t } = useLanguage()

  // ── 3D Gaze ──
  const rawRX = useMotionValue(0); const rawRY = useMotionValue(0)
  const rawTX = useMotionValue(0); const rawTY = useMotionValue(0)
  const gazeRX = useSpring(rawRX, { stiffness: 150, damping: 25 })
  const gazeRY = useSpring(rawRY, { stiffness: 150, damping: 25 })
  const gazeTX = useSpring(rawTX, { stiffness: 150, damping: 25 })
  const gazeTY = useSpring(rawTY, { stiffness: 150, damping: 25 })

  useEffect(() => {
    const h = e => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      rawRY.set(nx * 15); rawRX.set(-ny * 15)
      rawTX.set(nx * 10); rawTY.set(ny * 10)
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [rawRX, rawRY, rawTX, rawTY])

  const gazeStyle = { rotateX: gazeRX, rotateY: gazeRY, x: gazeTX, y: gazeTY }

  // ── Big circle ──
  const sectionRef = useRef(null); const headingRef = useRef(null); const bioRef = useRef(null)
  const btnsRef = useRef(null)
  const bigRadius = 75
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [headingRect, setHeadingRect] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [bioRect, setBioRect] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [inHero, setInHero] = useState(true)
  const [overBtns, setOverBtns] = useState(false)
  const currentRadius = inHero && !overBtns ? bigRadius : 0

  useEffect(() => {
    const update = () => {
      const hr = headingRef.current?.getBoundingClientRect()
      if (hr) setHeadingRect({ left: Math.round(hr.left), top: Math.round(hr.top), width: Math.round(hr.width), height: Math.round(hr.height) })
      const br = bioRef.current?.getBoundingClientRect()
      if (br) setBioRect({ left: Math.round(br.left), top: Math.round(br.top), width: Math.round(br.width), height: Math.round(br.height) })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update) }
  }, [])

  useEffect(() => {
    const h = e => {
      setMousePos({ x: e.clientX, y: e.clientY })
      const sec = sectionRef.current
      if (!sec) return
      const r = sec.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top + 80 && e.clientY <= r.bottom
      setInHero(inside)
      const bb = btnsRef.current?.getBoundingClientRect()
      if (bb && inside) {
        const cx = e.clientX, cy = e.clientY
        setOverBtns(cx + bigRadius > bb.left && cx - bigRadius < bb.right && cy + bigRadius > bb.top && cy - bigRadius < bb.bottom)
      } else setOverBtns(false)
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [bigRadius])

  useEffect(() => {
    if (inHero && !overBtns) document.body.classList.add('cursor-none')
    else document.body.classList.remove('cursor-none')
    return () => document.body.classList.remove('cursor-none')
  }, [inHero, overBtns])

  const handleLangToggle = useCallback(() => toggleLang(), [toggleLang])

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative">
      {/* Black circle background */}
      <div className="fixed rounded-full bg-black dark:bg-white pointer-events-none z-20"
        style={{
          width: currentRadius * 2, height: currentRadius * 2,
          left: mousePos.x - currentRadius, top: mousePos.y - currentRadius,
          opacity: inHero ? 1 : 0,
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
        }}
      />
      {/* Inversion overlay */}
      <div className="fixed inset-0 pointer-events-none z-25"
        style={{
          clipPath: `circle(${currentRadius}px at ${mousePos.x}px ${mousePos.y}px)`,
          opacity: inHero ? 1 : 0, transition: 'opacity 0.3s ease',
        }}
      >
        <h1 className="absolute text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight whitespace-nowrap text-[#fafafa] dark:text-[#050505] select-none"
          style={{ left: headingRect.left, top: headingRect.top }}>{otherHeading}</h1>
        <p className="absolute text-base sm:text-lg max-w-xl leading-relaxed text-[#fafafa] dark:text-[#050505] select-none text-center"
          style={{ left: bioRect.left, top: bioRect.top, width: bioRect.width }}>{otherBio}</p>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        <div className="preserve-3d" style={{ perspective: '1200px' }}>
          <motion.h1 ref={headingRef}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight whitespace-nowrap text-black dark:text-white preserve-3d select-none cursor-pointer inline-block"
            style={gazeStyle} onClick={handleLangToggle} title="Click to switch language"
          >{headingText}</motion.h1>
        </div>
        <div className="flex justify-center mt-12">
          <p ref={bioRef} className="text-base sm:text-lg text-muted max-w-xl leading-relaxed select-none text-center">{bioText}</p>
        </div>
        <motion.div ref={btnsRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-14" style={gazeStyle}>
          <a href="#coop" onClick={e => { e.preventDefault(); document.getElementById('coop')?.scrollIntoView({ behavior: 'smooth' }) }} className="bg-black text-white dark:bg-white dark:text-black text-lg font-semibold px-14 py-5 rounded-full hover:opacity-80 transition-opacity w-full sm:w-auto text-center">{t.cta1}</a>
          <a href="#projects" onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }} className="border-2 border-black dark:border-white text-black dark:text-white text-lg font-semibold px-14 py-5 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-full sm:w-auto text-center">{t.cta2}</a>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-10 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <div className="w-5 h-8 border-2 border-black/20 dark:border-white/20 rounded-full flex justify-center">
          <motion.div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mt-1.5" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }} />
        </div>
      </motion.div>
    </section>
  )
}
