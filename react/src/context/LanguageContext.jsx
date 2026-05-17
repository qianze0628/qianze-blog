import { createContext, useContext, useState, useMemo } from 'react'

const translations = {
  en: {
    works:'Works',articles:'Articles',thoughts:'Thoughts',space:'Space',contactMe:'Contact Me',
    greeting:"Hello, I'm qianze",
    cta1:'Get In Touch',cta2:'View Works',
    skillsTitle:'Skills & Expertise',skillsSubtitle:'Technologies and tools I work with daily',
    projectsTitle:'Selected Projects',projectsSubtitle:'Recent work and experiments',
    introBio:"I build AI agents, full-stack applications, and automation systems — crafting tools that work while you sleep.",
    blogTitle:'Articles',blogSubtitle:'Thoughts on AI, engineering, and design.',
    notesTitle:'Thoughts',notesSubtitle:'Quick notes, snippets, and daily fragments.',
    friendsTitle:'Friends',guestbookTitle:'Guestbook',
    guestbookPlaceholder:'Leave a message...',guestbookSubmit:'Submit',
    viewProject:'View Project',proficiency:'Proficiency',contactTitle:'Contact',
    serviceConsulting:'Consulting',serviceConsultingDesc:'Strategic AI integration and automation consulting.',
    serviceDev:'Development',serviceDevDesc:'Full-stack application development from concept to deployment.',
    serviceSharing:'Sharing',serviceSharingDesc:'Technical writing, workshops, and knowledge sharing.',
    readTime:'min read',
  },
  zh: {
    works:'作品',articles:'文章',thoughts:'碎念',space:'社区',contactMe:'联系我',
    greeting:'你好，我是 qianze',
    cta1:'联系我',cta2:'查看作品',
    skillsTitle:'技能与专长',skillsSubtitle:'我日常使用的技术和工具',
    projectsTitle:'精选项目',projectsSubtitle:'近期作品与实验',
    introBio:'我构建 AI Agent、全栈应用和自动化系统——打造在你休息时依然高效运转的工具。',
    blogTitle:'文章',blogSubtitle:'关于 AI、工程与设计的思考。',
    notesTitle:'碎念',notesSubtitle:'随笔、代码片段与日常碎片。',
    friendsTitle:'友链',guestbookTitle:'留言板',
    guestbookPlaceholder:'留下你的足迹...',guestbookSubmit:'提交留言',
    viewProject:'查看项目',proficiency:'熟练度',contactTitle:'联系方式',
    serviceConsulting:'咨询',serviceConsultingDesc:'为现代团队提供战略性 AI 集成与自动化咨询。',
    serviceDev:'开发',serviceDevDesc:'从概念到部署的全栈应用开发。',
    serviceSharing:'分享',serviceSharingDesc:'技术写作、工作坊与知识分享。',
    readTime:'分钟阅读',
  },
}

const headingText = { en: "Hello, I'm qianze", zh: '你好，我是 qianze' }
const bioText = {
  en: "I build AI agents, full-stack applications, and automation systems — crafting tools that work while you sleep.",
  zh: '我构建 AI Agent、全栈应用和自动化系统——打造在你休息时依然高效运转的工具。',
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('zh')
  const toggleLang = () => setLang(p => p === 'en' ? 'zh' : 'en')
  const t = useMemo(() => translations[lang], [lang])
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, headingText: headingText[lang], otherHeading: headingText[lang==='en'?'zh':'en'], bioText: bioText[lang], otherBio: bioText[lang==='en'?'zh':'en'] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
