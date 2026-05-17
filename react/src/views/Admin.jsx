import { useEffect, useState } from 'react'
import { api, setToken, getToken } from '../api'
import { useTheme } from '../context/ThemeContext'
import Analytics from './Analytics'

const TABS = [
  { key: 'skills', label: '技能' },
  { key: 'projects', label: '项目' },
  { key: 'posts', label: '文章' },
  { key: 'notes', label: '碎念' },
  { key: 'friends', label: '友链' },
  { key: 'guestbook', label: '留言' },
  { key: 'stats', label: '访问' },
]

export default function Admin() {
  const { theme, toggleTheme } = useTheme()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState('skills')
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({ skills: [], projects: [], posts: [], notes: [], friends: [], guestbook: [] })

  // Auto-login: try stored JWT token on mount
  useEffect(() => {
    const t = getToken()
    if (t) {
      api.getStats('').then(() => {
        setPassword('') // password not needed with valid JWT
        setAuthed(true)
      }).catch(() => {
        setToken(null) // token expired, clear it
      }).finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  const set = (key) => (val) => setData(prev => ({ ...prev, [key]: val }))

  const save = async () => {
    setSaving(true)
    const fn = {
      skills:   () => api.saveSkills(password, data.skills),
      projects: () => api.saveProjects(password, data.projects),
      posts:    () => api.savePosts(password, data.posts),
      notes:    () => api.saveNotes(password, data.notes),
      friends:  () => api.saveFriends(password, data.friends),
    }[tab]
    if (fn) await fn()
    setSaving(false)
  }

  useEffect(() => { if (authed) {
    api.getSkills().then(set('skills'))
    api.getProjects().then(set('projects'))
    api.getPosts().then(set('posts'))
    api.getNotes().then(set('notes'))
    api.getFriends().then(set('friends'))
    api.getGuestbook().then(set('guestbook'))
  }}, [authed])

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#050505]"><p className="text-sm text-muted">验证登录状态...</p></div>
  if (!authed) return <Login onLogin={(pw) => { setPassword(pw); setAuthed(true) }} />

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      {/* 顶栏 */}
      <div className="sticky top-0 z-40 bg-[#fafafa]/90 dark:bg-[#050505]/90 backdrop-blur border-b border-black/5 dark:border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="切换主题">
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
            )}
          </button>
          <h1 className="text-lg font-bold text-black dark:text-white">管理后台</h1>
        </div>
        <button onClick={save} disabled={saving}
          className="bg-black text-white dark:bg-white dark:text-black text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-80 disabled:opacity-40 transition-opacity">
          {saving ? '保存中...' : '保存修改'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Tab 切换 */}
        <div className="flex gap-1 mb-10 bg-black/5 dark:bg-white/5 rounded-full p-1 w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${tab === t.key ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-muted hover:text-black dark:hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {tab === 'skills'    && <SkillEditor data={data.skills} setData={set('skills')} />}
        {tab === 'projects'  && <ProjectEditor data={data.projects} setData={set('projects')} />}
        {tab === 'posts'     && <PostEditor data={data.posts} setData={set('posts')} />}
        {tab === 'notes'     && <NoteEditor data={data.notes} setData={set('notes')} />}
        {tab === 'friends'   && <FriendEditor data={data.friends} setData={set('friends')} />}
        {tab === 'guestbook' && <GuestbookList data={data.guestbook} setData={set('guestbook')} />}
        {tab === 'stats' && <Analytics password={password} />}
      </div>
    </div>
  )
}

// ── 登录 ──
function Login({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.login(pw)
      setToken(res.token)
      onLogin(pw)
    } catch {
      setErr(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#050505]">
      <form onSubmit={submit} className="w-80">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">管理后台</h1>
        <p className="text-sm text-muted text-center mb-8">请输入密码以继续</p>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false) }}
          placeholder="输入密码" autoFocus
          className={`w-full border rounded-lg px-4 py-3 text-sm bg-transparent text-black dark:text-white outline-none transition-colors ${err ? 'border-red-500' : 'border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white'}`} />
        {err && <p className="text-xs text-red-500 mt-2">密码错误，请重试</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium py-3 rounded-lg mt-4 hover:opacity-80 transition-opacity disabled:opacity-50">{loading ? '验证中...' : '进入'}</button>
      </form>
    </div>
  )
}

// ── Toolbar: 新增按钮 ──
function AddBar({ onClick, label }) {
  return (
    <div className="mb-4">
      <button onClick={onClick}
        className="text-sm text-muted border border-dashed border-black/20 dark:border-white/20 rounded-xl px-5 py-3 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white transition-all w-full">
        + {label}
      </button>
    </div>
  )
}

// ── 卡片容器 ──
function Card({ children, onDelete }) {
  return (
    <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 mb-3 bg-white dark:bg-black hover:border-black/10 dark:hover:border-white/10 transition-colors group">
      {children}
      <div className="flex justify-end mt-3 pt-3 border-t border-black/5 dark:border-white/5">
        <button onClick={onDelete} className="text-xs text-muted hover:text-red-500 transition-colors">删除</button>
      </div>
    </div>
  )
}

function Input({ value, onChange, placeholder, type, className = '' }) {
  return <input type={type || 'text'} value={value ?? ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
    placeholder={placeholder} className={`border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent text-black dark:text-white placeholder:text-muted/50 outline-none focus:border-black dark:focus:border-white ${className}`} />
}

function Textarea({ value, onChange, placeholder, rows }) {
  return <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3}
    className="w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent text-black dark:text-white placeholder:text-muted/50 outline-none focus:border-black dark:focus:border-white resize-none" />
}

// ── 技能编辑 ──
function SkillEditor({ data, setData }) {
  const add = () => setData([...data, { name: '', proficiency: 50, descEn: '', descZh: '' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((s, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))}>
        <div className="flex gap-3 mb-3">
          <Input value={s.name} onChange={update(i, 'name')} placeholder="技能名称" className="flex-1" />
          <Input value={s.proficiency} onChange={update(i, 'proficiency')} type="number" placeholder="熟练度" className="w-20" />
          <span className="text-sm text-muted self-center">%</span>
        </div>
        <Input value={s.descEn} onChange={update(i, 'descEn')} placeholder="英文描述（可留空）" className="w-full mb-2" />
        <Input value={s.descZh} onChange={update(i, 'descZh')} placeholder="中文描述（可留空）" className="w-full" />
      </Card>
    ))}
    <AddBar onClick={add} label="添加技能" />
  </>
}

// ── 项目编辑 ──
function ProjectEditor({ data, setData }) {
  const add = () => setData([...data, { num: '/0' + (data.length + 1), title: '', tags: [], descEn: '', descZh: '', url: '' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((p, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))}>
        <div className="flex gap-3 mb-3">
          <Input value={p.num} onChange={update(i, 'num')} placeholder="编号" className="w-20" />
          <Input value={p.title} onChange={update(i, 'title')} placeholder="项目名称" className="flex-1" />
        </div>
        <Input value={Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')}
          onChange={v => update(i, 'tags')(v.split(',').map(t => t.trim()))} placeholder="标签（逗号分隔）" className="w-full mb-2" />
        <Input value={p.descEn} onChange={update(i, 'descEn')} placeholder="英文描述" className="w-full mb-2" />
        <Input value={p.descZh} onChange={update(i, 'descZh')} placeholder="中文描述" className="w-full mb-2" />
        <Input value={p.url} onChange={update(i, 'url')} placeholder="项目链接（https://...，可留空）" className="w-full" />
      </Card>
    ))}
    <AddBar onClick={add} label="添加项目" />
  </>
}

// ── 文章编辑 ──
function PostEditor({ data, setData }) {
  const add = () => setData([...data, { slug: '', title: '', titleZh: '', date: new Date().toISOString().slice(0, 10), category: '', readTime: 5, tags: [], summary: '', summaryZh: '', contentEn: '', contentZh: '', featured: false }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((p, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))}>
        <div className="flex gap-3 mb-3 flex-wrap">
          <Input value={p.slug} onChange={update(i, 'slug')} placeholder="URL 标识" className="w-44" />
          <Input value={p.date} onChange={update(i, 'date')} placeholder="日期" className="w-32" />
          <Input value={p.category} onChange={update(i, 'category')} placeholder="分类" className="w-24" />
          <Input value={p.readTime} onChange={update(i, 'readTime')} type="number" placeholder="分钟" className="w-20" />
        </div>
        <Input value={p.title} onChange={update(i, 'title')} placeholder="英文标题" className="w-full mb-2" />
        <Input value={p.titleZh} onChange={update(i, 'titleZh')} placeholder="中文标题" className="w-full mb-2" />
        <Input value={Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')}
          onChange={v => update(i, 'tags')(v.split(',').map(t => t.trim()))} placeholder="标签（逗号分隔）" className="w-full mb-2" />
        <Input value={p.summary} onChange={update(i, 'summary')} placeholder="英文摘要" className="w-full mb-2" />
        <Input value={p.summaryZh} onChange={update(i, 'summaryZh')} placeholder="中文摘要" className="w-full mb-2" />
        <label className="flex items-center gap-2 text-sm text-muted mb-3 cursor-pointer">
          <input type="checkbox" checked={p.featured || false} onChange={e => update(i, 'featured')(e.target.checked)}
            className="w-4 h-4 rounded border-black/20 dark:border-white/20" />
          设为精选文章（首页展示）
        </label>
        <p className="text-xs text-muted mb-1 mt-3">正文内容（支持换行）</p>
        <Textarea value={p.contentEn} onChange={update(i, 'contentEn')} placeholder="英文正文" rows={6} />
        <div className="mt-2 mb-2" />
        <Textarea value={p.contentZh} onChange={update(i, 'contentZh')} placeholder="中文正文" rows={6} />
      </Card>
    ))}
    <AddBar onClick={add} label="添加文章" />
  </>
}

// ── 碎念编辑 ──
function NoteEditor({ data, setData }) {
  const add = () => setData([...data, { content: '', date: new Date().toISOString().slice(0, 10), type: 'text' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((n, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))}>
        <div className="flex gap-3 mb-3">
          <Input value={n.date} onChange={update(i, 'date')} placeholder="日期" className="w-32" />
          <select value={n.type} onChange={e => update(i, 'type')(e.target.value)}
            className="border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent text-black dark:text-white outline-none">
            <option value="text">文字</option><option value="code">代码</option>
          </select>
        </div>
        <Textarea value={n.content} onChange={update(i, 'content')} placeholder="内容" />
      </Card>
    ))}
    <AddBar onClick={add} label="添加碎念" />
  </>
}

// ── 友链编辑 ──
function FriendEditor({ data, setData }) {
  const add = () => setData([...data, { name: '', desc: '', url: 'https://' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((f, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))}>
        <div className="flex gap-3 mb-3">
          <Input value={f.name} onChange={update(i, 'name')} placeholder="名称" className="w-32" />
          <Input value={f.url} onChange={update(i, 'url')} placeholder="网址" className="flex-1" />
        </div>
        <Input value={f.desc} onChange={update(i, 'desc')} placeholder="简介" className="w-full" />
      </Card>
    ))}
    <AddBar onClick={add} label="添加友链" />
  </>
}

// ── 留言列表 ──
function GuestbookList({ data, setData }) {
  if (data.length === 0) return <p className="text-sm text-muted text-center py-20">暂无留言</p>
  return (
    <div className="space-y-3">
      {[...data].reverse().map(e => (
        <div key={e.id} className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black flex items-start justify-between group hover:border-black/10 dark:hover:border-white/10 transition-colors">
          <div>
            <p className="text-sm text-black dark:text-white leading-relaxed">&ldquo;{e.message}&rdquo;</p>
            <span className="text-xs text-muted mt-1 block">— {e.author} · {e.mood === 'admire' ? '💚' : e.mood === 'curious' ? '🤔' : '👍'} · {e.date}</span>
          </div>
          <button onClick={() => setData(data.filter(x => x.id !== e.id))}
            className="text-xs text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-4">删除</button>
        </div>
      ))}
    </div>
  )
}

// ── 访问统计 ──
function StatsView({ password }) {
  const [stats, setStats] = useState(null)
  useEffect(() => { api.getStats(password).then(setStats).catch(() => {}) }, [password])

  if (!stats) return <p className="text-sm text-muted text-center py-20">加载中...</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-white dark:bg-black text-center">
        <p className="text-3xl font-bold text-black dark:text-white">{stats.totalVisits}</p>
        <p className="text-sm text-muted mt-1">总访问量</p>
      </div>
      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-white dark:bg-black text-center">
        <p className="text-3xl font-bold text-black dark:text-white">{stats.uniqueVisitors}</p>
        <p className="text-sm text-muted mt-1">独立访客</p>
      </div>
      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-white dark:bg-black text-center">
        <p className="text-3xl font-bold text-black dark:text-white">{stats.last24h}</p>
        <p className="text-sm text-muted mt-1">24 小时内</p>
      </div>
      {stats.topPages?.length > 0 && (
        <div className="sm:col-span-3 border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-white dark:bg-black">
          <p className="text-sm font-bold text-black dark:text-white mb-4">热门页面</p>
          {stats.topPages.map((p, i) => (
            <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted">{p.page || '/'}</span><span className="text-black dark:text-white font-medium">{p.cnt}</span></div>
          ))}
        </div>
      )}
      {stats.recent?.length > 0 && (
        <div className="sm:col-span-3 border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-white dark:bg-black">
          <p className="text-sm font-bold text-black dark:text-white mb-4">最近访问记录</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {stats.recent.slice(0, 30).map((r, i) => (
              <div key={i} className="flex justify-between text-xs text-muted"><span>{r.page || '/'}</span><span>{r.ip} · {(r.createdAt || '').substring(0, 19)}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
