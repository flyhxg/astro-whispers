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
    onError: () => setMessage('Failed to load previous reports. Please try again later.'),
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
    onError: () => setMessage('Failed to generate the report. Please retry.'),
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
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Astrology Report</p>
        <h2 className="font-serif text-4xl text-white">Your personalised cosmic briefing</h2>
        <p className="text-sm text-white/60">
          Generated from your birth details. Refresh the report at any time to receive an updated cosmic insight.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
          <span className="rounded-full border border-white/10 px-4 py-2">Sun: {report?.payload.sun ?? '--'}</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Moon: {report?.payload.moon ?? '--'}</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Rising: {report?.payload.rising ?? '--'}</span>
        </div>
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
            {isPending ? 'Generating…' : 'Generate latest report'}
          </button>
          {historyQuery.isFetching && <span className="px-4 py-2">Loading history…</span>}
        </div>
      </header>

      {!user && !loading && (
        <div className="glass-card p-6 text-center text-white/60">Sign in to generate your tailored astrology insights.</div>
      )}

      {user && !report && (
        <div className="glass-card p-6 text-center text-white/60">Preparing your celestial data…</div>
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

