import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, setToken, getToken } from '../api'
import { useTheme } from '../context/ThemeContext'
import { getMediaUrl, normalizeUploadUrl } from '../utils/mediaUrl'
import Analytics from './Analytics'

const TABS = [
  { key: 'skills', label: '技能' },
  { key: 'projects', label: '项目' },
  { key: 'posts', label: '文章' },
  { key: 'notes', label: '碎念' },
  { key: 'friends', label: '友链' },
  { key: 'guestbook', label: '留言' },
  { key: 'songs', label: '音乐' },
  { key: 'musiclogs', label: '点歌' },
  { key: 'stats', label: '访问' },
]

export default function Admin() {
  const { theme, toggleTheme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [role, setRole] = useState('admin')
  const [tab, setTab] = useState('skills')
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareDays, setShareDays] = useState(7)
  const [generating, setGenerating] = useState(false)
  const [confirm, setConfirm] = useState(null) // { title, onOk }
  const [data, setData] = useState({ skills: [], projects: [], posts: [], notes: [], friends: [], guestbook: [], songs: [] })
  const readonly = role === 'readonly'

  const askConfirm = (title, onOk) => setConfirm({ title, onOk })

  // Auto-login: try stored JWT token or ?token= from shared link
  useEffect(() => {
    const shareToken = searchParams.get('token')
    if (shareToken) {
      setToken(shareToken)
      const next = new URLSearchParams(searchParams)
      next.delete('token')
      setSearchParams(next, { replace: true })
    }
    const t = getToken()
    if (t) {
      api.getStats('').then(() => {
        setPassword('')
        setAuthed(true)
        return api.me()
      }).then(res => {
        if (res && res.role) setRole(res.role)
      }).catch(() => {
        setToken(null)
      }).finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  const generateShare = async () => {
    setGenerating(true)
    try {
      const res = await api.shareToken(password, shareDays)
      const url = `${window.location.origin}/admin?token=${res.token}`
      setShareUrl(url)
    } catch { /* ignore */ }
    setGenerating(false)
  }

  const set = (key) => (val) => setData(prev => ({ ...prev, [key]: val }))

  const save = async () => {
    setSaving(true)
    if (tab === 'songs') {
      for (const s of data.songs) {
        const payload = { title: s.title, artist: s.artist, album: s.album, url: s.url, cover: s.cover, lyricUrl: s.lyricUrl, duration: s.duration || 0, sourceType: s.sourceType || 'external', sortOrder: s.sortOrder || 0 }
        try {
          if (s.id) await api.updateSong(s.id, payload)
          else { const res = await api.createSong(payload); s.id = res.id }
        } catch (err) { alert(`${s.title}: ${err.message || '保存失败'}`) }
      }
      api.getSongs().then(set('songs'))
    } else {
      const fn = {
        skills:   () => api.saveSkills(password, data.skills),
        projects: () => api.saveProjects(password, data.projects),
        posts:    () => api.savePosts(password, data.posts),
        notes:    () => api.saveNotes(password, data.notes),
        friends:  () => api.saveFriends(password, data.friends),
      }[tab]
      if (fn) await fn()
    }
    setSaving(false)
  }

  useEffect(() => { if (authed) {
    api.getSkills().then(set('skills'))
    api.getProjects().then(set('projects'))
    api.getPosts().then(set('posts'))
    api.getNotes().then(set('notes'))
    api.getFriends().then(set('friends'))
    api.getGuestbook().then(set('guestbook'))
    api.getSongs().then(set('songs'))
  }}, [authed])

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#050505]"><p className="text-sm text-muted">验证登录状态...</p></div>
  if (!authed) return <Login onLogin={(pw) => { setPassword(pw); setRole('admin'); setAuthed(true) }} />

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
          {readonly && <span className="text-xs text-muted border border-black/20 dark:border-white/20 rounded-full px-2.5 py-0.5">只读</span>}
        </div>
        <div className="flex items-center gap-3">
          {!readonly && (
            <button onClick={() => { setShareUrl(''); generateShare() }} disabled={generating}
              className="text-sm text-muted border border-black/20 dark:border-white/20 rounded-full px-4 py-2 hover:text-black dark:hover:text-white hover:border-black/40 dark:hover:border-white/40 transition-all">
              {generating ? '生成中...' : shareUrl ? '重新生成' : '🔗 分享访问'}
            </button>
          )}
          {!readonly && (
            <button onClick={save} disabled={saving}
              className="bg-black text-white dark:bg-white dark:text-black text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-80 disabled:opacity-40 transition-opacity">
              {saving ? '保存中...' : '保存修改'}
            </button>
          )}
          <button onClick={() => { setToken(null); setAuthed(false); setPassword(''); setRole('admin') }}
            className="text-sm text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="退出登录">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* Share link modal */}
      {shareUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-white/10 backdrop-blur-sm" onClick={() => setShareUrl('')}>
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <p className="text-lg font-bold text-black dark:text-white mb-2">分享访问链接</p>
            <p className="text-sm text-muted mb-4">复制下方链接给对方，打开即自动登录，无需密码。</p>
            <div className="flex items-center gap-2 mb-4">
              <input readOnly value={shareUrl} id="share-link-input"
                className="flex-1 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs bg-transparent text-black dark:text-white outline-none select-all" />
              <button onClick={async () => {
                try {
                  if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(shareUrl)
                  } else {
                    throw new Error('HTTP')
                  }
                } catch {
                  const el = document.getElementById('share-link-input')
                  if (el) { el.focus(); el.select(); document.execCommand('copy') }
                }
              }}
                className="bg-black text-white dark:bg-white dark:text-black text-sm font-medium px-4 py-2 rounded-lg hover:opacity-80 transition-opacity shrink-0">复制</button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted">有效期：</span>
              {[1, 7, 30].map(d => (
                <button key={d} onClick={() => { setShareDays(d); setShareUrl(''); }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${shareDays === d ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'text-muted border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40'}`}>
                  {d} 天
                </button>
              ))}
            </div>
            <p className="text-xs text-muted/50 mt-3">链接 {shareDays} 天后自动失效，无需手动撤销。</p>
            <button onClick={() => setShareUrl('')}
              className="mt-4 text-sm text-muted hover:text-black dark:hover:text-white transition-colors">关闭</button>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-white/10 backdrop-blur-sm" onClick={() => setConfirm(null)}>
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold text-black dark:text-white mb-2">确认操作</p>
            <p className="text-sm text-muted mb-5">{confirm.title}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors px-4 py-2">取消</button>
              <button onClick={() => { confirm.onOk(); setConfirm(null) }}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">确认删除</button>
            </div>
          </div>
        </div>
      )}

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
        {tab === 'skills'    && <SkillEditor data={data.skills} setData={set('skills')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'projects'  && <ProjectEditor data={data.projects} setData={set('projects')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'posts'     && <PostEditor data={data.posts} setData={set('posts')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'notes'     && <NoteEditor data={data.notes} setData={set('notes')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'friends'   && <FriendEditor data={data.friends} setData={set('friends')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'guestbook' && <GuestbookList data={data.guestbook} setData={set('guestbook')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'songs'     && <SongEditor data={data.songs} setData={set('songs')} readonly={readonly} onConfirm={askConfirm} />}
        {tab === 'musiclogs' && <MusicLogsView />}
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
function Card({ children, onDelete, readonly, onConfirm, confirmTitle }) {
  const handleDelete = () => {
    if (onConfirm) {
      onConfirm(confirmTitle || '确定要删除该项吗？', onDelete)
    } else {
      onDelete()
    }
  }
  return (
    <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 mb-3 bg-white dark:bg-black hover:border-black/10 dark:hover:border-white/10 transition-colors group">
      {children}
      {!readonly && (
        <div className="flex justify-end mt-3 pt-3 border-t border-black/5 dark:border-white/5">
          <button onClick={handleDelete} className="text-xs text-muted hover:text-red-500 transition-colors">删除</button>
        </div>
      )}
    </div>
  )
}

function Input({ value, onChange, placeholder, type, className = '', readOnly }) {
  return <input type={type || 'text'} value={value ?? ''} readOnly={readOnly}
    onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
    placeholder={placeholder} className={`border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent text-black dark:text-white placeholder:text-muted/50 outline-none focus:border-black dark:focus:border-white ${readOnly ? 'opacity-60 cursor-default' : ''} ${className}`} />
}

function Textarea({ value, onChange, placeholder, rows, readOnly }) {
  return <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} readOnly={readOnly}
    className={`w-full border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent text-black dark:text-white placeholder:text-muted/50 outline-none focus:border-black dark:focus:border-white resize-none ${readOnly ? 'opacity-60 cursor-default' : ''}`} />
}

// ── 技能编辑 ──
function SkillEditor({ data, setData, readonly, onConfirm }) {
  const add = () => setData([...data, { name: '', proficiency: 50, descEn: '', descZh: '' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((s, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))} readonly={readonly} onConfirm={onConfirm}>
        <div className="flex gap-3 mb-3">
          <Input value={s.name} onChange={update(i, 'name')} placeholder="技能名称" className="flex-1" readOnly={readonly} />
          <Input value={s.proficiency} onChange={update(i, 'proficiency')} type="number" placeholder="熟练度" className="w-20" readOnly={readonly} />
          <span className="text-sm text-muted self-center">%</span>
        </div>
        <div className="flex items-center gap-2 mb-1"><span className="text-xs text-muted">英文描述</span>{!readonly && <TranslateBtn text={s.descZh} onResult={v => update(i, 'descEn')(v)} />}</div>
        <Input value={s.descEn} onChange={update(i, 'descEn')} placeholder="英文描述（可留空）" className="w-full mb-2" readOnly={readonly} />
        <div className="flex items-center gap-2 mb-1"><span className="text-xs text-muted">中文描述</span>{!readonly && <TranslateBtn text={s.descEn} onResult={v => update(i, 'descZh')(v)} />}</div>
        <Input value={s.descZh} onChange={update(i, 'descZh')} placeholder="中文描述（可留空）" className="w-full" readOnly={readonly} />
      </Card>
    ))}
    {!readonly && <AddBar onClick={add} label="添加技能" />}
  </>
}

// ── 项目编辑 ──
function ProjectEditor({ data, setData, readonly, onConfirm }) {
  const add = () => setData([...data, { num: '/0' + (data.length + 1), title: '', tags: [], descEn: '', descZh: '', url: '' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((p, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))} readonly={readonly} onConfirm={onConfirm}>
        <div className="flex gap-3 mb-3">
          <Input value={p.num} onChange={update(i, 'num')} placeholder="编号" className="w-20" readOnly={readonly} />
          <Input value={p.title} onChange={update(i, 'title')} placeholder="项目名称" className="flex-1" readOnly={readonly} />
        </div>
        <Input value={Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')}
          onChange={v => update(i, 'tags')(v.split(',').map(t => t.trim()))} placeholder="标签（逗号分隔）" className="w-full mb-2" readOnly={readonly} />
        <div className="flex items-center gap-2 mb-1"><span className="text-xs text-muted">英文描述</span>{!readonly && <TranslateBtn text={p.descZh} onResult={v => update(i, 'descEn')(v)} />}</div>
        <Input value={p.descEn} onChange={update(i, 'descEn')} placeholder="英文描述" className="w-full mb-2" readOnly={readonly} />
        <div className="flex items-center gap-2 mb-1"><span className="text-xs text-muted">中文描述</span>{!readonly && <TranslateBtn text={p.descEn} onResult={v => update(i, 'descZh')(v)} />}</div>
        <Input value={p.descZh} onChange={update(i, 'descZh')} placeholder="中文描述" className="w-full mb-2" readOnly={readonly} />
        <Input value={p.url} onChange={update(i, 'url')} placeholder="项目链接（https://...，可留空）" className="w-full" readOnly={readonly} />
      </Card>
    ))}
    {!readonly && <AddBar onClick={add} label="添加项目" />}
  </>
}

// ── 文章编辑 ──
function PostEditor({ data, setData, readonly, onConfirm }) {
  const add = () => setData([...data, { slug: '', title: '', titleZh: '', date: new Date().toISOString().slice(0, 10), category: '', readTime: 5, tags: [], summary: '', summaryZh: '', contentEn: '', contentZh: '', featured: false }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((p, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))} readonly={readonly} onConfirm={onConfirm}>
        <div className="flex gap-3 mb-3 flex-wrap">
          <Input value={p.slug} onChange={update(i, 'slug')} placeholder="URL 标识" className="w-44" readOnly={readonly} />
          <Input value={p.date} onChange={update(i, 'date')} placeholder="日期" className="w-32" readOnly={readonly} />
          <Input value={p.category} onChange={update(i, 'category')} placeholder="分类" className="w-24" readOnly={readonly} />
          <Input value={p.readTime} onChange={update(i, 'readTime')} type="number" placeholder="分钟" className="w-20" readOnly={readonly} />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted">英文标题</span>
          {!readonly && <TranslateBtn text={p.titleZh} onResult={v => update(i, 'title')(v)} />}
        </div>
        <Input value={p.title} onChange={update(i, 'title')} placeholder="English title" className="w-full mb-2" readOnly={readonly} />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted">中文标题</span>
          {!readonly && <TranslateBtn text={p.title} onResult={v => update(i, 'titleZh')(v)} />}
        </div>
        <Input value={p.titleZh} onChange={update(i, 'titleZh')} placeholder="中文标题" className="w-full mb-2" readOnly={readonly} />
        <Input value={Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')}
          onChange={v => update(i, 'tags')(v.split(',').map(t => t.trim()))} placeholder="标签（逗号分隔）" className="w-full mb-2" readOnly={readonly} />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted">英文摘要</span>
          {!readonly && <TranslateBtn text={p.summaryZh} onResult={v => update(i, 'summary')(v)} />}
        </div>
        <Input value={p.summary} onChange={update(i, 'summary')} placeholder="English summary" className="w-full mb-2" readOnly={readonly} />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted">中文摘要</span>
          {!readonly && <TranslateBtn text={p.summary} onResult={v => update(i, 'summaryZh')(v)} />}
        </div>
        <Input value={p.summaryZh} onChange={update(i, 'summaryZh')} placeholder="中文摘要" className="w-full mb-2" readOnly={readonly} />
        {!readonly && (
          <label className="flex items-center gap-2 text-sm text-muted mb-3 cursor-pointer">
            <input type="checkbox" checked={p.featured || false} onChange={e => update(i, 'featured')(e.target.checked)}
              className="w-4 h-4 rounded border-black/20 dark:border-white/20" />
            设为精选文章（首页展示）
          </label>
        )}
        <div className="flex items-center justify-between mt-3 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">英文正文</span>
            {!readonly && <TranslateBtn text={p.contentZh} onResult={v => update(i, 'contentEn')(v)} />}
          </div>
          {!readonly && <FileUploadBtn accept="image/*" label="📷 上传图片" onUrl={url => update(i, 'contentEn')((p.contentEn || '') + `\n![图片](${url})\n`)} />}
        </div>
        <Textarea value={p.contentEn} onChange={update(i, 'contentEn')} placeholder="English content" rows={6} readOnly={readonly} />
        <ImagePreview text={p.contentEn} />
        <div className="flex items-center justify-between mt-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">中文正文</span>
            {!readonly && <TranslateBtn text={p.contentEn} onResult={v => update(i, 'contentZh')(v)} />}
          </div>
          {!readonly && <FileUploadBtn accept="image/*" label="📷 上传图片" onUrl={url => update(i, 'contentZh')((p.contentZh || '') + `\n![图片](${url})\n`)} />}
        </div>
        <Textarea value={p.contentZh} onChange={update(i, 'contentZh')} placeholder="中文正文" rows={6} readOnly={readonly} />
        <ImagePreview text={p.contentZh} />
      </Card>
    ))}
    {!readonly && <AddBar onClick={add} label="添加文章" />}
  </>
}

// ── 碎念编辑 ──
function NoteEditor({ data, setData, readonly, onConfirm }) {
  const add = () => setData([...data, { content: '', date: new Date().toISOString().slice(0, 10), type: 'text' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((n, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))} readonly={readonly} onConfirm={onConfirm}>
        <div className="flex gap-3 mb-3">
          <Input value={n.date} onChange={update(i, 'date')} placeholder="日期" className="w-32" readOnly={readonly} />
          <select value={n.type} onChange={e => update(i, 'type')(e.target.value)} disabled={readonly}
            className="border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-transparent text-black dark:text-white outline-none disabled:opacity-50">
            <option value="text">文字</option><option value="code">代码</option>
          </select>
        </div>
        <Textarea value={n.content} onChange={update(i, 'content')} placeholder="内容" readOnly={readonly} />
      </Card>
    ))}
    {!readonly && <AddBar onClick={add} label="添加碎念" />}
  </>
}

// ── 友链编辑 ──
function FriendEditor({ data, setData, readonly, onConfirm }) {
  const add = () => setData([...data, { name: '', desc: '', url: 'https://' }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  return <>
    {data.map((f, i) => (
      <Card key={i} onDelete={() => setData(data.filter((_, j) => j !== i))} readonly={readonly} onConfirm={onConfirm}>
        <div className="flex gap-3 mb-3">
          <Input value={f.name} onChange={update(i, 'name')} placeholder="名称" className="w-32" readOnly={readonly} />
          <Input value={f.url} onChange={update(i, 'url')} placeholder="网址" className="flex-1" readOnly={readonly} />
        </div>
        <Input value={f.desc} onChange={update(i, 'desc')} placeholder="简介" className="w-full" readOnly={readonly} />
      </Card>
    ))}
    {!readonly && <AddBar onClick={add} label="添加友链" />}
  </>
}

function RichMessage({ text }) {
  if (!text) return null
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\))/g)
  return parts.map((part, i) => {
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      const alt = imgMatch[1]; const url = imgMatch[2]
      if (alt === 'emoji') return <img key={i} src={getMediaUrl(url)} alt="" className="inline-block w-6 h-6 align-middle mx-0.5" />
      return <img key={i} src={getMediaUrl(url)} alt={alt} className="max-w-full max-h-60 rounded-lg my-2 block" loading="lazy" />
    }
    return <span key={i}>{part}</span>
  })
}

// ── 留言列表 ──
function GuestbookList({ data, setData, readonly, onConfirm }) {
  if (data.length === 0) return <p className="text-sm text-muted text-center py-20">暂无留言</p>
  return (
    <div className="space-y-3">
      {[...data].reverse().map(e => (
        <div key={e.id} className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black flex items-start justify-between group hover:border-black/10 dark:hover:border-white/10 transition-colors">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-black dark:text-white leading-relaxed break-words">
              <RichMessage text={e.message} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-xs text-muted">— {e.author} · {e.mood === 'admire' ? '💚' : e.mood === 'curious' ? '🤔' : '👍'}</span>
              <span className="text-xs text-muted/60">{(e.date || '').substring(0, 19)}</span>
            </div>
            {(e.ip || e.country || e.city || e.browser || e.os) && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                {e.ip && <span className="text-xs text-muted/50 font-mono">{e.ip}</span>}
                {[e.country, e.province, e.city].filter(Boolean).length > 0 && (
                  <span className="text-xs text-muted/50">📍 {[e.country, e.province, e.city].filter(Boolean).join(' ')}</span>
                )}
                {e.browser && e.browser !== '未知' && <span className="text-xs text-muted/50">{e.browser}</span>}
                {e.os && e.os !== '未知' && <span className="text-xs text-muted/50">{e.os}</span>}
                {e.device && e.device !== '桌面端' && <span className="text-xs text-muted/50">{e.device}</span>}
                {e.model && <span className="text-xs text-muted/50">{e.model}</span>}
              </div>
            )}
          </div>
          {!readonly && (
            <button onClick={() => { onConfirm ? onConfirm('确定删除这条留言吗？', () => { api.deleteGuestbook(e.id); setData(data.filter(x => x.id !== e.id)) }) : (api.deleteGuestbook(e.id), setData(data.filter(x => x.id !== e.id))) }}
              className="text-xs text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-4">删除</button>
          )}
        </div>
      ))}
    </div>
  )
}

// ── 翻译按钮 ──
function TranslateBtn({ text, onResult }) {
  const [loading, setLoading] = useState(false)
  const translate = async () => {
    if (!text || !text.trim()) return
    setLoading(true)
    try {
      const isZh = /[一-龥]/.test(text)
      const from = isZh ? 'zh' : 'en'
      const to = isZh ? 'en' : 'zh'
      const result = await api.translate(text, from, to)
      if (result) onResult(result)
    } catch (err) {
      alert('翻译失败: ' + (err.message || '网络错误'))
    }
    setLoading(false)
  }
  return (
    <button type="button" onClick={translate} disabled={loading}
      className="text-[10px] text-muted/50 hover:text-muted border border-black/10 dark:border-white/10 rounded px-1.5 py-0.5 disabled:opacity-40">
      {loading ? '翻译中...' : '翻译'}
    </button>
  )
}

// ── 图片预览 ──
function ImagePreview({ text }) {
  if (!text) return null
  const urls = [...text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]
  if (urls.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-2">
      {urls.map((m, i) => (
        <img key={i} src={getMediaUrl(m[2])} alt={m[1]} className="max-w-[120px] max-h-[120px] rounded-lg object-cover border border-black/10 dark:border-white/10" />
      ))}
    </div>
  )
}

// ── 文件上传按钮 ──
function FileUploadBtn({ onUrl, accept, label }) {
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploadFile(file)
      onUrl(normalizeUploadUrl(res.url))
    } catch (err) {
      alert('上传失败: ' + (err.message || '未知错误'))
    }
    setUploading(false)
    e.target.value = ''
  }
  return (
    <label className={`inline-flex items-center gap-1 text-xs cursor-pointer transition-colors ${uploading ? 'text-muted/40 cursor-wait' : 'text-muted hover:text-black dark:hover:text-white'}`}>
      {uploading ? '上传中...' : label}
      <input type="file" accept={accept} onChange={handleFile} className="hidden" />
    </label>
  )
}

// ── 音乐导入 ──
function MusicImporter({ onImported }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState({})
  const [importMsgs, setImportMsgs] = useState({})
  const debounceRef = useRef(null)

  const doSearch = async (q) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try { setResults(await api.searchMusic(q, '')) } catch { setResults([]) }
    setLoading(false)
  }

  const onImport = async (item) => {
    const key = item.title
    setImporting(p => ({ ...p, [key]: true }))
    setImportMsgs(p => ({ ...p, [key]: '获取播放地址...' }))
    try {
      // Resolve mp3Id to real play URL, cover, and lyrics before importing
      let playUrl = item.playUrl || item.url || ''
      let coverUrl = item.coverUrl || ''
      let lyric = item.lyric || ''
      if (!playUrl && item.mp3Id) {
        try {
          const res = await api.getPlayUrl(item.mp3Id)
          if (res && res.url) {
            playUrl = res.url
            if (res.cover) coverUrl = res.cover
            if (res.lyric) lyric = res.lyric
          }
        } catch { /* keep empty */ }
      }
      if (!playUrl) {
        setImportMsgs(p => ({ ...p, [key]: '失败: 无法获取播放地址' }))
        setImporting(p => ({ ...p, [key]: false }))
        return
      }
      setImportMsgs(p => ({ ...p, [key]: '保存中...' }))
      const payload = {
        title: item.title, artist: item.artist,
        coverUrl: coverUrl, playUrl: playUrl,
        songId: item.songId || (item.mp3Id ? parseInt(item.mp3Id) : null),
        lyric: lyric,
      }
      const res = await api.importSong(payload)
      if (res.song) {
        onImported(res.song)
        setImportMsgs(p => ({ ...p, [key]: '已导入 ✓' }))
      }
      if (res.errors && res.errors.length > 0) {
        setImportMsgs(p => ({ ...p, [key]: res.errors.join(', ') }))
      }
    } catch (err) {
      setImportMsgs(p => ({ ...p, [key]: '失败: ' + (err.message || '') }))
    }
    setImporting(p => ({ ...p, [key]: false }))
  }

  return (
    <div className="border border-dashed border-amber-300/50 dark:border-amber-700/30 rounded-2xl p-5 mb-6 bg-amber-50/30 dark:bg-amber-900/10">
      <p className="text-sm font-bold text-black dark:text-white mb-3">导入音乐</p>
      <p className="text-xs text-muted mb-3">搜索 gequhai.com 曲库，一键导入：后端自动下载封面到 /music/ 目录</p>

      {/* Search */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-stone-800 rounded-xl px-3 py-2 border border-black/10 dark:border-white/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={query} onChange={e => { setQuery(e.target.value); clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => doSearch(e.target.value), 500) }}
            placeholder="搜索 gequhai 曲库..." className="flex-1 bg-transparent text-sm outline-none text-black dark:text-white placeholder:text-muted" />
        </div>
      </div>

      {/* Results */}
      {loading && <p className="text-xs text-muted py-3 text-center">搜索中...</p>}

      {!loading && results.length > 0 && (
        <div className="max-h-80 overflow-y-auto space-y-1">
          {results.map((r, i) => {
            const key = r.title
            const isImporting = importing[key]
            const msg = importMsgs[key]
            return (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-amber-100/30 dark:hover:bg-stone-800/30 transition-colors">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-100 dark:bg-stone-700 shrink-0">
                  {r.coverUrl ? <img src={r.coverUrl} alt="" className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center text-amber-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black dark:text-white truncate">{r.title}</p>
                  <p className="text-xs text-muted truncate">
                    <span className="text-amber-500">gequhai</span>
                    {' · '}{r.artist}{r.songId ? ` · #${r.songId}` : ''}{r.mp3Id ? ` · mp3:${r.mp3Id}` : ''}
                  </p>
                  {msg && <p className={`text-[10px] ${msg.includes('✓') ? 'text-green-500' : msg.includes('失败') ? 'text-red-400' : 'text-amber-500'}`}>{msg}</p>}
                </div>
                <button onClick={() => onImport(r)} disabled={isImporting}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 transition-colors">
                  {isImporting ? '导入中' : '导入'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="text-xs text-muted py-3 text-center">未找到，试试其他关键词</p>
      )}
    </div>
  )
}

// ── 音乐管理 ──
function SongEditor({ data, setData, readonly, onConfirm }) {
  const add = () => setData([...data, { title: '', artist: '', album: '', url: '', cover: '', lyricUrl: '', duration: 0, sourceType: 'external', sortOrder: 0 }])
  const update = (i, k) => v => { const n = [...data]; n[i] = { ...n[i], [k]: v }; setData(n) }
  const saveSong = async (i) => {
    const s = data[i]
    const payload = { title: s.title, artist: s.artist, album: s.album, url: s.url, cover: s.cover, lyricUrl: s.lyricUrl, duration: s.duration || 0, sourceType: s.sourceType || 'external', sortOrder: s.sortOrder || 0 }
    try {
      if (s.id) await api.updateSong(s.id, payload)
      else { const res = await api.createSong(payload); update(i, 'id')(res.id) }
    } catch (err) { alert('保存失败: ' + (err.message || '')) }
  }
  const uploadFile = async (i, field, type, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await api.uploadMusicFile(file, type)
      update(i, field)(normalizeUploadUrl(res.url))
    } catch (err) { alert('上传失败: ' + (err.message || '')) }
    e.target.value = ''
  }
  const onImported = (song) => {
    setData([...data, { ...song, id: song.id, _new: true }])
  }
  return <>
    {!readonly && <MusicImporter onImported={onImported} />}
    {data.map((s, i) => (
      <Card key={i} onDelete={() => { api.deleteSong(s.id).catch(() => {}); setData(data.filter((_, j) => j !== i)) }} readonly={readonly} onConfirm={onConfirm} confirmTitle={`确定删除「${s.title}」吗？`}>
        <div className="flex gap-3 mb-2 flex-wrap">
          <Input value={s.title} onChange={update(i, 'title')} placeholder="歌曲名" className="flex-1 min-w-[120px]" readOnly={readonly} />
          <Input value={s.artist} onChange={update(i, 'artist')} placeholder="歌手" className="w-28" readOnly={readonly} />
          <Input value={s.album} onChange={update(i, 'album')} placeholder="专辑" className="w-28" readOnly={readonly} />
          <Input value={s.sortOrder} onChange={update(i, 'sortOrder')} type="number" placeholder="排序" className="w-14" readOnly={readonly} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <select value={s.sourceType || 'external'} onChange={e => update(i, 'sourceType')(e.target.value)} disabled={readonly}
            className="border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-xs bg-transparent text-black dark:text-white outline-none">
            <option value="external">外链</option><option value="local">本地</option>
          </select>
          <Input value={s.url} onChange={update(i, 'url')} placeholder="音频链接 或 上传本地文件" className="flex-1" readOnly={readonly} />
          {!readonly && (
            <label className="text-xs cursor-pointer text-muted hover:text-black dark:hover:text-white shrink-0">
              📂 上传
              <input type="file" accept="audio/*" onChange={e => { uploadFile(i, 'url', 'audio', e); update(i, 'sourceType')('local') }} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Input value={s.cover || ''} onChange={update(i, 'cover')} placeholder="封面图片链接 或 上传" className="flex-1" readOnly={readonly} />
          {!readonly && (
            <label className="text-xs cursor-pointer text-muted hover:text-black dark:hover:text-white shrink-0">
              🖼 封面上传
              <input type="file" accept="image/*" onChange={e => uploadFile(i, 'cover', 'cover', e)} className="hidden" />
            </label>
          )}
        </div>
        {s.cover && <img src={getMediaUrl(s.cover)} alt="" className="w-20 h-20 rounded-xl object-cover mb-2" />}

        <div className="flex items-center gap-2 mb-2">
          <Input value={s.lyricUrl || ''} onChange={update(i, 'lyricUrl')} placeholder="歌词 .lrc 链接 或 上传" className="flex-1" readOnly={readonly} />
          {!readonly && (
            <label className="text-xs cursor-pointer text-muted hover:text-black dark:hover:text-white shrink-0">
              📝 歌词上传
              <input type="file" accept=".lrc,.txt" onChange={e => uploadFile(i, 'lyricUrl', 'lyric', e)} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Input value={s.duration} onChange={update(i, 'duration')} type="number" placeholder="时长(秒)" className="w-24" readOnly={readonly} />
          {s.playCount != null && <span className="text-xs text-muted">播放 {s.playCount} 次</span>}
          {!readonly && <button onClick={() => saveSong(i)} className="text-xs text-amber-600 dark:text-amber-400 hover:underline ml-auto">保存此歌曲</button>}
        </div>
      </Card>
    ))}
    {!readonly && <AddBar onClick={add} label="手动添加歌曲" />}
    <p className="text-xs text-muted/50 mt-2">所有文件上传后自动存到 /music/ 目录。iTunes 导入为 30 秒试听版，完整版请用外链或上传。</p>
  </>
}

// ── 点歌记录 ──
function MusicLogsView() {
  const [logs, setLogs] = useState([])
  const [top, setTop] = useState([])
  const [songs, setSongs] = useState([])
  useEffect(() => {
    api.getGuestMusicLogs().then(setLogs).catch(() => {})
    api.getTopSearched().then(setTop).catch(() => {})
    api.getSongs().then(setSongs).catch(() => {})
  }, [])
  const ranked = [...songs].sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
  return (
    <div className="space-y-5">
      {/* Play count ranking */}
      {ranked.length > 0 && (
        <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black">
          <p className="text-sm font-bold text-black dark:text-white mb-3">播放次数排行</p>
          <div className="space-y-1">
            {ranked.slice(0, 10).map((s, i) => (
              <div key={s.id || i} className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-mono w-5 shrink-0 ${i < 3 ? 'text-amber-500 font-bold' : 'text-muted'}`}>
                    {i + 1}
                  </span>
                  <span className="text-black dark:text-white truncate">{s.title}</span>
                  <span className="text-xs text-muted truncate hidden sm:inline">{s.artist}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 dark:bg-amber-500 rounded-full"
                      style={{ width: `${Math.max(4, Math.round((s.playCount || 0) / Math.max(1, ranked[0]?.playCount || 1) * 100))}%` }} />
                  </div>
                  <span className="text-xs text-muted w-10 text-right">{s.playCount || 0}次</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top searched */}
      {top.length > 0 && (
        <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black">
          <p className="text-sm font-bold text-black dark:text-white mb-3">热门搜索</p>
          <div className="flex flex-wrap gap-1.5">
            {top.map((t, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/30 dark:border-amber-800/30">
                {t.song_title} · {t.song_artist} ({t.cnt}次)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent logs */}
      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black">
        <p className="text-sm font-bold text-black dark:text-white mb-3">点歌记录（最近100条）</p>
        <div className="space-y-1 max-h-96 overflow-y-auto text-xs">
          {logs.map((l, i) => (
            <div key={l.id || i} className="flex flex-wrap justify-between py-1.5 border-b border-black/5 dark:border-white/5 last:border-0 gap-x-3">
              <span className="text-muted truncate max-w-[160px]">{l.songTitle || '--'}</span>
              <span className="text-muted/60">
                {l.songArtist || '--'}
                {l.ip ? ` · ${l.ip}` : ''}
                {[l.country, l.province, l.city].filter(Boolean).length > 0 &&
                  ` · ${[l.country, l.province, l.city].filter(Boolean).join(' ')}`}
                {l.browser && l.browser !== '未知' ? ` · ${l.browser}` : ''}
                {l.os && l.os !== '未知' ? ` · ${l.os}` : ''}
                {l.device && l.device !== '桌面端' ? ` · ${l.device}` : ''}
                {l.model ? ` · ${l.model}` : ''}
              </span>
              <span className="text-muted font-mono shrink-0">{(l.createdAt || '').substring(0, 19)}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-muted text-center py-10">暂无记录</p>}
        </div>
      </div>
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
        <p className="text-3xl font-bold text-black dark:text-white">{stats.todayVisits}</p>
        <p className="text-sm text-muted mt-1">今日访问</p>
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
          <div className="space-y-1 max-h-80 overflow-y-auto text-xs">
            {stats.recent.slice(0, 30).map((r, i) => (
              <div key={i} className="flex flex-wrap justify-between py-1.5 border-b border-black/5 dark:border-white/5 last:border-0 gap-x-3">
                <span className="text-muted truncate max-w-[200px]">{r.page || '/'}</span>
                <span className="text-muted/60">
                  {r.ip}
                  {[r.country, r.province, r.city].filter(Boolean).length > 0 && (
                    <span> · {[r.country, r.province, r.city].filter(Boolean).join(' ')}</span>
                  )}
                  {r.browser && r.browser !== '其他' ? ` · ${r.browser}` : ''}
                  {r.os && r.os !== '其他' ? ` · ${r.os}` : ''}
                  {r.model ? ` · ${r.model}` : ''}
                </span>
                <span className="text-muted font-mono">{(r.createdAt || '').substring(11, 19)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
