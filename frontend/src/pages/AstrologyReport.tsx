import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AstrologyReportRecord } from '../types/reports'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function AstrologyReportPage() {
  const { user, loading } = useAuth()
  const [report, setReport] = useState<AstrologyReportRecord | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const historyQuery = useQuery({
    queryKey: ['astrology-history'],
    queryFn: async () => {
      const res = await api.get('/reports/astrology/latest')
      return res.data as AstrologyReportRecord[]
    },
    enabled: !!user,
    onError: () => setMessage('载入历史报告失败，请稍后再试。'),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/reports/astrology')
      return res.data as AstrologyReportRecord
    },
    onSuccess: (data) => {
      setReport(data)
      historyQuery.refetch()
      setMessage(null)
    },
    onError: () => setMessage('生成报告失败，请重新尝试。'),
  })

  useEffect(() => {
    if (!user || loading) return
    if (!historyQuery.isFetching && historyQuery.data && historyQuery.data.length > 0 && !report) {
      setReport(historyQuery.data[0])
    }
    if (!historyQuery.data?.length && !isPending && !report) {
      setMessage(null)
      mutate()
    }
  }, [user, loading, historyQuery.data, historyQuery.isFetching, report, mutate, isPending])

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">星座报告</p>
        <h2 className="font-serif text-4xl text-white">你的专属星座运势简报</h2>
        <p className="text-sm text-white/60">
          根据你的出生信息实时生成，可随时刷新以获得最新的星象提示与能量流向建议。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
          <span className="rounded-full border border-white/10 px-4 py-2">太阳星座：{report?.payload.sun ?? '--'}</span>
          <span className="rounded-full border border-white/10 px-4 py-2">月亮星座：{report?.payload.moon ?? '--'}</span>
          <span className="rounded-full border border-white/10 px-4 py-2">上升星座：{report?.payload.rising ?? '--'}</span>
        </div>
        {report && (
          <p className="text-xs text-white/40">生成时间：{new Date(report.payload.generated_at).toLocaleString()}</p>
        )}
        <div className="flex justify-center gap-3 text-xs text-white/50">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-white/70 transition hover:bg-white/10"
            onClick={() => mutate()}
            disabled={isPending || !user}
          >
            {isPending ? '生成中…' : '刷新最新报告'}
          </button>
          {historyQuery.isFetching && <span className="px-4 py-2">加载历史记录…</span>}
        </div>
      </header>

      {!user && !loading && (
        <div className="glass-card p-6 text-center text-white/60">登录后即可生成量身定制的星座洞察。</div>
      )}

      {user && !report && (
        <div className="glass-card p-6 text-center text-white/60">正在整理你的星象数据…</div>
      )}

      {message && <div className="glass-card p-4 text-center text-aurora">{message}</div>}

      {report && (
        <div className="space-y-6">
          {report.payload.sections.map((section) => (
            <details key={section.id} className="glass-card group overflow-hidden">
              <summary className="cursor-pointer select-none list-none p-6 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-aurora/80">{section.id}</p>
                    <h3 className="font-serif text-2xl text-white">{section.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{section.summary}</p>
                  </div>
                  <span className="mt-2 text-2xl text-aurora/60 transition group-open:rotate-45">+</span>
                </div>
              </summary>
              <div className="space-y-4 border-t border-white/10 bg-white/5 p-6 text-sm text-white/75">
                {section.details.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}

