import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }
const child = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0, 0, 0.2, 1] } } }

const contactItems = [
  { label: 'Email', value: '2469710983@qq.com', href: 'mailto:2469710983@qq.com' },
  { label: 'WeChat', value: 'ymb070628', href: '#' },
  { label: 'GitHub', value: 'github.com/qianze-ui', href: 'https://github.com/qianze-ui' },
]

export default function Footer() {
  const { t } = useLanguage()

  return (
    <motion.footer id="coop" className="py-40 px-6 border-t border-black/10 dark:border-white/10 flex flex-col items-center"
      initial="hidden" whileInView="visible" viewport={{ amount: 0.15 }} variants={container}
    >
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-24 text-center">
          <motion.div variants={child}>
            <h3 className="text-lg font-bold text-black dark:text-white mb-3">{t.serviceConsulting}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.serviceConsultingDesc}</p>
          </motion.div>
          <motion.div variants={child}>
            <h3 className="text-lg font-bold text-black dark:text-white mb-3">{t.serviceDev}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.serviceDevDesc}</p>
          </motion.div>
          <motion.div variants={child}>
            <h3 className="text-lg font-bold text-black dark:text-white mb-3">{t.serviceSharing}</h3>
            <p className="text-muted text-sm leading-relaxed">{t.serviceSharingDesc}</p>
          </motion.div>
        </div>
        <motion.div className="text-center" variants={child}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-8">{t.contactTitle}</h2>
          <div className="space-y-4 inline-flex flex-col items-center">
            {contactItems.map(item => (
              <a key={item.label} href={item.href} className="flex items-baseline gap-4 group justify-center">
                <span className="text-sm font-mono text-muted w-16 text-right">{item.label}</span>
                <span className="text-lg sm:text-2xl font-bold text-black dark:text-white group-hover:opacity-70 transition-opacity">{item.value}</span>
              </a>
            ))}
          </div>
        </motion.div>
        <motion.div className="mt-24 pt-8 border-t border-black/5 dark:border-white/5 flex justify-center items-center gap-4 text-center" variants={child}>
          <span className="text-xs text-muted">&copy; {new Date().getFullYear()} qianze. All rights reserved.</span>
        </motion.div>
      </div>
    </motion.footer>
  )
}
