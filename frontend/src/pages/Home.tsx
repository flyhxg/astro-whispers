import { Link } from 'react-router-dom'
import { SparklesIcon, GlobeAsiaAustraliaIcon, BookOpenIcon } from '@heroicons/react/24/outline'

const highlights = [
  {
    title: '深度星座报告',
    description: '从出生时刻解读你的性格原型、人生任务与细分领域运势，结构化呈现每一寸星光。',
    icon: SparklesIcon,
    to: '/reports/astrology'
  },
  {
    title: '生肖命理洞察',
    description: '结合生肖与纳音五行，生成全年趋势、贵人提示、能量修炼地图。',
    icon: GlobeAsiaAustraliaIcon,
    to: '/reports/zodiac'
  },
  {
    title: '精选玄学文章',
    description: '专业玄学作者与内容团队联合产出的高质量文章，陪伴你的精神探索旅程。',
    icon: BookOpenIcon,
    to: '/articles'
  }
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-24">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="font-serif text-sm uppercase tracking-[0.4em] text-aurora">AstroWhispers</p>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            倾听星辰低语，
            <span className="block text-aurora">唤醒你的内在宇宙</span>
          </h1>
          <p className="max-w-xl text-base text-white/70 md:text-lg">
            星辰秘语将玄学的神秘与现代科技的精密融合，为你呈现个性化、多维度、可读性强的专属报告与精神指引。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary">立即开启星程</Link>
            <Link to="/articles" className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:bg-white/10">探索灵感文章</Link>
          </div>
        </div>
        <div className="glass-card relative overflow-hidden p-10">
          <div className="absolute -left-8 -top-12 h-36 w-36 rounded-full bg-cosmic-400/40 blur-2xl" />
          <div className="absolute -bottom-12 right-0 h-44 w-44 rounded-full bg-aurora/40 blur-3xl" />
          <div className="relative space-y-4 text-sm text-white/80">
            <p className="font-semibold text-white">今日星辰提示</p>
            <p>灵魂在低语：请善待内在的情绪流动，允许它们成为你重新出发的能量。</p>
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs text-white/50">能量焦点</p>
              <p className="mt-2 text-sm text-white">木星与金星相拱，为你带来关系层面的温柔回响。适合分享、倾听、拥抱。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Link key={item.title} to={item.to} className="group glass-card flex flex-col gap-4 p-6 transition hover:border-white/30 hover:shadow-glow">
              <item.icon className="h-10 w-10 text-aurora" />
              <h3 className="font-serif text-xl text-white">{item.title}</h3>
              <p className="text-sm text-white/70">{item.description}</p>
              <span className="mt-auto text-sm text-aurora/80 group-hover:text-aurora">探索 →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

