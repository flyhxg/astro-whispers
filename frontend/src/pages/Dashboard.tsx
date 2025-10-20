import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const reportCards = [
  {
    title: 'Latest astrology report',
    subtitle: 'Refreshed today',
    description: 'Review the current focus for relationships, career, and wellbeing, all tailored to your natal chart.',
    to: '/reports/astrology',
  },
  {
    title: 'Current zodiac outlook',
    subtitle: 'This year at a glance',
    description: 'See which elements are in focus, who your allies are, and how to balance the year&apos;s rhythm.',
    to: '/reports/zodiac',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <header className="space-y-3">
        <h2 className="font-serif text-3xl text-white">Welcome back, {user?.name ?? 'traveller'}</h2>
        <p className="text-sm text-white/60">Here are the latest insights prepared for your journey.</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {reportCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="glass-card group flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-glow"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-aurora/80">Report</p>
            <h3 className="font-serif text-2xl text-white">{card.title}</h3>
            <p className="text-xs text-white/50">{card.subtitle}</p>
            <p className="text-sm text-white/70">{card.description}</p>
            <span className="mt-auto text-sm text-aurora">View report →</span>
          </Link>
        ))}
      </section>
      <section className="glass-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-xl text-white">Featured article: Working with inner energy</h3>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Explore how planetary cycles and five-element wisdom can translate into practical rituals that keep you balanced day to day.
            </p>
          </div>
          <Link to="/articles" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 hover:bg-white/10">
            Read now →
          </Link>
        </div>
      </section>
    </div>
  )
}

