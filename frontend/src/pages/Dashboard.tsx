import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const reportCards = [
  {
    title: '最新星座报告',
    subtitle: '今日已刷新',
    description: '回顾当下在关系、事业与身心层面的重点提示，完全依照你的本命星盘定制。',
    to: '/reports/astrology',
  },
  {
    title: '本年度生肖趋势',
    subtitle: '一眼掌握流年',
    description: '了解今年聚焦的五行能量、关键贵人以及如何拿捏前进与休息的节奏。',
    title: 'Current zodiac outlook',
    subtitle: 'This year at a glance',
    description: 'See which elements are in focus, who your allies are, and how to balance the year\'s rhythm.',
    to: '/reports/zodiac',
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [loading, navigate, user])

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <header className="space-y-3">
        <h2 className="font-serif text-3xl text-white">欢迎回来，{user?.name ?? '旅者'}</h2>
        <p className="text-sm text-white/60">以下是为你准备的最新灵性指引与洞察。</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {reportCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="glass-card group flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-glow"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-aurora/80">报告</p>
            <h3 className="font-serif text-2xl text-white">{card.title}</h3>
            <p className="text-xs text-white/50">{card.subtitle}</p>
            <p className="text-sm text-white/70">{card.description}</p>
            <span className="mt-auto text-sm text-aurora">查看报告 →</span>
          </Link>
        ))}
      </section>
      <section className="glass-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-xl text-white">精选文章：与内在能量共舞</h3>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              了解行星周期与五行智慧如何转化为日常可执行的仪式，让你在忙碌节奏中依然保持平衡与澄明。
            </p>
          </div>
          <Link to="/articles" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 hover:bg-white/10">
            立即阅读 →
          </Link>
        </div>
      </section>
    </div>
  )
}
