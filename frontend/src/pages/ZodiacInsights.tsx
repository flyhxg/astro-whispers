import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { ZodiacInterpretation, ZodiacInterpretationRecord } from '../types/zodiac'
import { useAuth } from '../context/AuthContext'

const SIGN_ORDER = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
]

function mapRecord(record: ZodiacInterpretationRecord): ZodiacInterpretation {
  return {
    id: record.id,
    sign: record.sign,
    title: record.title,
    dateRange: record.date_range,
    element: record.element,
    modality: record.modality,
    keywords: record.keywords ?? [],
    summary: record.summary,
    love: record.love,
    career: record.career,
    wellbeing: record.wellbeing,
    ritual: record.ritual,
    mantra: record.mantra,
    luckyColor: record.lucky_color,
    updatedAt: record.updated_at,
  }
}

export default function ZodiacInsightsPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['zodiac-interpretations'],
    queryFn: async () => {
      const res = await api.get('/zodiac-interpretations')
      const records = res.data as ZodiacInterpretationRecord[]
      return records.map(mapRecord)
    },
  })

  const interpretations = useMemo(() => {
    if (!data) return []
    return [...data].sort(
      (a, b) => SIGN_ORDER.indexOf(a.sign) - SIGN_ORDER.indexOf(b.sign)
    )
  }, [data])

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Zodiac Library</p>
        <h2 className="font-serif text-4xl text-white">12星座灵性解读</h2>
        <p className="text-sm text-white/60">
          精选的星座关键字、年度主题与实用仪式建议，帮助你在日常中落地星象智慧。
        </p>
        {user && (
          <p className="text-xs text-white/40">
            需要调整文案？登录后台后可在仪表盘中调用接口进行更新。
          </p>
        )}
        <div className="flex justify-center gap-3 text-xs text-white/50">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-white/20 px-4 py-2 text-white/70 transition hover:bg-white/10"
          >
            {isRefetching ? '刷新中…' : '手动刷新最新解读'}
          </button>
          {isLoading && <span className="rounded-full border border-white/10 px-4 py-2">读取中…</span>}
          {isError && <span className="rounded-full border border-aurora/40 px-4 py-2 text-aurora">获取失败</span>}
        </div>
      </header>

      {isLoading && !data && (
        <div className="glass-card p-6 text-center text-white/70">正在载入星座解读…</div>
      )}

      {isError && !data && (
        <div className="glass-card p-6 text-center text-aurora">无法获取星座解读，请稍后再试。</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {interpretations.map((item) => (
          <article key={item.id} className="glass-card flex h-full flex-col gap-5 p-6">
            <header className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-aurora/80">
                <span>{item.sign}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] text-white/60">
                  {item.element} · {item.modality}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] text-white/60">
                  幸运色：{item.luckyColor}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                <p className="text-xs text-white/50">{item.dateRange}</p>
                <p className="text-xs text-white/40">最近更新：{new Date(item.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                {item.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-white/10 px-3 py-1">
                    #{keyword}
                  </span>
                ))}
              </div>
            </header>
            <section className="space-y-4 text-sm text-white/75">
              <p className="text-white/80">{item.summary}</p>
              <div className="grid gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-white/80">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">情感连结</p>
                  <p>{item.love}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">事业发展</p>
                  <p>{item.career}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">身心调养</p>
                  <p>{item.wellbeing}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-night/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">仪式建议</p>
                <p className="mt-2 text-white/80">{item.ritual}</p>
                <p className="mt-3 text-sm text-aurora">{item.mantra}</p>
              </div>
            </section>
          </article>
        ))}
      </div>
    </div>
  )
}
