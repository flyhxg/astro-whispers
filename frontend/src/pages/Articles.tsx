import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Article, ArticleRecord } from '../types/reports'

export default function ArticlesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await api.get('/articles')
      const records = res.data as ArticleRecord[]
      return records.map<Article>((record) => ({
        id: record.id,
        title: record.title,
        slug: record.slug,
        summary: record.summary ?? '',
        coverUrl: record.cover_url ?? undefined,
        tags: record.tags ?? [],
        publishedAt: record.published_at ?? new Date().toISOString(),
        content: record.content,
      }))
    },
  })

  const articles = data ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Cosmic Journal</p>
        <h2 className="font-serif text-4xl text-white">玄学灵感库</h2>
        <p className="text-sm text-white/60">精心打磨的文章，让玄学智慧成为你的日常灵感。</p>
      </header>

      {isLoading && <div className="glass-card p-6 text-center text-white/60">正在召唤灵感...</div>}
      {isError && <div className="glass-card p-6 text-center text-aurora">文章加载失败，请稍后再试。</div>}

      {!isLoading && !isError && articles.length === 0 && (
        <div className="glass-card p-6 text-center text-white/60">暂时没有文章，请稍后再来或登录后台发布内容。</div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.id} to={`/articles/${article.slug}`} className="group glass-card overflow-hidden">
            {article.coverUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${article.coverUrl}?auto=format&fit=crop&w=800&q=80`}
                  alt={article.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-black/40 to-transparent" />
              </div>
            )}
            <div className="space-y-2 p-6">
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-aurora/80">
                {article.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <h3 className="font-serif text-2xl text-white">{article.title}</h3>
              <p className="text-sm text-white/70">{article.summary}</p>
              <p className="text-xs text-white/40">发布于 {new Date(article.publishedAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
