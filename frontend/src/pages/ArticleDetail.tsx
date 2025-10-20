import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Article, ArticleRecord } from '../types/reports'

export default function ArticleDetailPage() {
  const { slug } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const res = await api.get(`/articles/${slug}`)
      const record = res.data as ArticleRecord
      const article: Article = {
        id: record.id,
        title: record.title,
        slug: record.slug,
        summary: record.summary ?? '',
        coverUrl: record.cover_url ?? undefined,
        tags: record.tags ?? [],
        publishedAt: record.published_at ?? new Date().toISOString(),
        content: record.content,
      }
      return article
    },
    enabled: !!slug,
  })

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link to="/articles" className="text-sm text-aurora">← 返回文章列表</Link>

      {isLoading && <div className="glass-card p-6 text-center text-white/60">文章加载中...</div>}
      {isError && <div className="glass-card p-6 text-center text-aurora">未找到文章或已被删除。</div>}

      {data && !isError && (
        <>
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-aurora/80">
              {data.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h1 className="font-serif text-4xl text-white">{data.title}</h1>
            <p className="text-sm text-white/50">发布于 {new Date(data.publishedAt).toLocaleString()}</p>
          </header>
          {data.coverUrl && (
            <div className="overflow-hidden rounded-3xl">
              <img
                src={`${data.coverUrl}?auto=format&fit=crop&w=1200&q=80`}
                alt={data.title}
                className="w-full"
              />
            </div>
          )}
          <article className="prose prose-invert prose-headings:font-serif prose-p:text-white/80 prose-strong:text-white">
            {data.content ? (
              data.content
                .split('\n')
                .map((paragraph) => paragraph.trim())
                .filter((paragraph) => paragraph.length > 0)
                .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
            ) : (
              <p>{data.summary}</p>
            )}
          </article>
        </>
      )}
    </div>
  )
}
