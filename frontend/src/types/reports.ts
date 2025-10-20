export type ReportSection = {
  id: string
  title: string
  summary: string
  details: string[]
  icon?: string
}

export type AstrologyReportPayload = {
  generated_at: string
  sign: string
  sun: string
  moon: string
  rising: string
  sections: ReportSection[]
}

export type AstrologyReportRecord = {
  id: number
  report_type: string
  generated_at: string
  payload: AstrologyReportPayload
}

export type ZodiacReportPayload = {
  generated_at: string
  zodiac: string
  element: string
  summary: string
  year: number
  sections: ReportSection[]
}

export type ZodiacReportRecord = {
  id: number
  year: number
  generated_at: string
  payload: ZodiacReportPayload
}

export type Article = {
  id: number
  title: string
  slug: string
  summary: string
  coverUrl?: string
  tags: string[]
  publishedAt: string
  content?: string
}

export type ArticleRecord = {
  id: number
  title: string
  slug: string
  summary?: string
  cover_url?: string
  tags: string[]
  content?: string
  published_at: string
}
