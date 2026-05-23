import { useEffect, useState } from 'react'
import { api } from '../api'
import { useTheme } from '../context/ThemeContext'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function Analytics({ password }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const load = () => api.getStats(password).then(setStats).catch(() => {})
    load()
    const t = setInterval(load, 15000) // refresh every 15s
    return () => clearInterval(t)
  }, [password])

  if (!stats) return <Loading />

  // Process hourly data for chart
  const hourData = Array.from({ length: 24 }, (_, i) => {
    const hit = stats.hourlyStats?.find(h => h.hour === i)
    return { hour: `${i}:00`, visits: hit?.cnt || 0 }
  })

  // Process daily data
  const dayData = stats.last7Days?.map(d => ({
    date: (d.date || '').substring(5),
    visits: d.cnt || 0,
  })) || []

  // Peak hour
  const peak = stats.hourlyStats?.reduce((max, h) => (h.cnt > max) ? h.cnt : max, 0) || 1

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="总访问量" value={stats.totalVisits} sub="全部" />
        <StatCard label="今日访问" value={stats.todayVisits} sub="今日" />
        <StatCard label="独立访客" value={stats.uniqueVisitors} sub="去重 IP" />
        <StatCard label="热门页面" value={stats.topPages?.[0]?.cnt || 0} sub={stats.topPages?.[0]?.page || '--'} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="近 7 天访问趋势">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dayData}>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={isDark ? '#fff' : '#000'} stopOpacity={0.1} /><stop offset="100%" stopColor={isDark ? '#fff' : '#000'} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: isDark ? '#999' : '#999' }} />
              <YAxis tick={{ fontSize: 12, fill: isDark ? '#999' : '#999' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: isDark ? '#1a1a1a' : '#fff', color: isDark ? '#fff' : '#000', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
              <Area type="monotone" dataKey="visits" stroke={isDark ? '#fff' : '#000'} fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="今日每小时流量">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: isDark ? '#999' : '#999' }} interval={3} />
              <YAxis tick={{ fontSize: 12, fill: isDark ? '#999' : '#999' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: isDark ? '#1a1a1a' : '#fff', color: isDark ? '#fff' : '#000', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
              <Bar dataKey="visits" fill={isDark ? '#fff' : '#000'} radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Pages */}
      <ChartCard title="热门页面排行">
        <div className="space-y-2">
          {stats.topPages?.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted w-6">{i + 1}</span>
                <span className="text-sm text-black dark:text-white">{p.page || '/'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${Math.round(p.cnt / (stats.topPages[0]?.cnt || 1) * 100)}%` }} />
                </div>
                <span className="text-xs text-muted w-8 text-right">{p.cnt}</span>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Browser / OS / Device */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <ChartCard title="浏览器">
          {stats.browserStats?.length > 0 ? stats.browserStats.map((b, i) => (
            <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted">{b.browser}</span><span className="text-black dark:text-white">{b.cnt}</span></div>
          )) : <p className="text-xs text-muted">暂无数据</p>}
        </ChartCard>
        <ChartCard title="操作系统">
          {stats.osStats?.length > 0 ? stats.osStats.map((o, i) => (
            <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted">{o.os}</span><span className="text-black dark:text-white">{o.cnt}</span></div>
          )) : <p className="text-xs text-muted">暂无数据</p>}
        </ChartCard>
        <ChartCard title="设备类型">
          {stats.deviceStats?.length > 0 ? stats.deviceStats.map((d, i) => (
            <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted">{d.device}</span><span className="text-black dark:text-white">{d.cnt}</span></div>
          )) : <p className="text-xs text-muted">暂无数据</p>}
        </ChartCard>
      </div>

      {/* Recent Visits */}
      <ChartCard title="实时访问动态">
        <div className="space-y-1 max-h-72 overflow-y-auto text-xs">
          {stats.recent?.slice(0, 30).map((r, i) => (
            <div key={i} className="flex flex-wrap justify-between py-1.5 border-b border-black/5 dark:border-white/5 last:border-0 gap-x-3">
              <span className="text-muted truncate max-w-[160px]">{r.page || '/'}</span>
              <span className="text-muted/60">
                {r.ip}
                {[r.country, r.province, r.city].filter(Boolean).length > 0 && (
                  <span> · {[r.country, r.province, r.city].filter(Boolean).join(' ')}</span>
                )}
                {r.isp ? ` [${r.isp}]` : ''}
                {r.browser && r.browser !== '其他' ? ` · ${r.browser}` : ''}
                {r.os && r.os !== '其他' && r.os !== '未知' ? ` · ${r.os}` : ''}
                {r.device && r.device !== '桌面端' ? ` · ${r.device}` : ''}
                {r.model ? ` · ${r.model}` : ''}
              </span>
              <span className="text-muted font-mono shrink-0">{(r.createdAt || '').substring(11, 19)}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black hover:border-black/10 dark:hover:border-white/10 hover:scale-[1.02] transition-all duration-200">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-2xl font-bold text-black dark:text-white">{value ?? '--'}</p>
      <p className="text-xs text-muted mt-0.5">{sub}</p>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="border border-black/5 dark:border-white/5 rounded-2xl p-5 bg-white dark:bg-black">
      <p className="text-sm font-bold text-black dark:text-white mb-4">{title}</p>
      {children}
    </div>
  )
}

function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-black/5 dark:bg-white/5 rounded-2xl" />)}
      </div>
    </div>
  )
}
