import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ZodiacReportRecord } from '../types/reports'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function ZodiacReportPage() {
  const { user, loading } = useAuth()
  const [report, setReport] = useState<ZodiacReportRecord | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const historyQuery = useQuery({
    queryKey: ['zodiac-history'],
    queryFn: async () => {
      const res = await api.get('/reports/zodiac/latest')
      return res.data as ZodiacReportRecord[]
    },
    enabled: !!user,
    onError: () => setMessage('Failed to load zodiac history. Please try again later.'),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post('/reports/zodiac')
      return res.data as ZodiacReportRecord
    },
    onSuccess: (data) => {
      setReport(data)
      historyQuery.refetch()
      setMessage(null)
    },
    onError: () => setMessage('Failed to generate the zodiac report. Please retry.'),
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
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Zodiac Report</p>
        <h2 className="font-serif text-4xl text-white">Annual zodiac energy overview</h2>
        <p className="text-sm text-white/60">A blended reading of Chinese zodiac symbolism and five-element balance for the current year.</p>
        {report && (
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/70">
            <span className="rounded-full border border-white/10 px-4 py-2">Zodiac: {report.payload.zodiac}</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Dominant element: {report.payload.element}</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Year: {report.payload.year}</span>
          </div>
        )}
        {report && (
          <p className="text-xs text-white/40">Generated at {new Date(report.payload.generated_at).toLocaleString()}</p>
        )}
        <div className="flex justify-center gap-3 text-xs text-white/50">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-white/70 transition hover:bg-white/10"
            onClick={() => mutate()}
            disabled={isPending || !user}
          >
            {isPending ? 'Generating…' : 'Generate latest zodiac report'}
          </button>
          {historyQuery.isFetching && <span className="px-4 py-2">Loading history…</span>}
        </div>
      </header>

      {!user && !loading && (
        <div className="glass-card p-6 text-center text-white/60">Sign in to explore your zodiac and five-element insights.</div>
      )}

      {user && !report && (
        <div className="glass-card p-6 text-center text-white/60">Preparing this year&apos;s zodiac overview…</div>
      )}

      {message && <div className="glass-card p-4 text-center text-aurora">{message}</div>}

      {report && (
        <div className="space-y-6">
          <div className="glass-card p-6 text-sm text-white/75">{report.payload.summary}</div>
          {report.payload.sections.map((section) => (
            <div key={section.id} className="glass-card space-y-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-aurora/80">{section.id}</p>
                <h3 className="font-serif text-2xl text-white">{section.title}</h3>
              </div>
              <p className="text-sm text-white/70">{section.summary}</p>
              <ul className="space-y-2 text-sm text-white/75">
                {section.details.map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-aurora">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

