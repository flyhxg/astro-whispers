import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import AstrologyReportPage from './pages/AstrologyReport'
import ZodiacReportPage from './pages/ZodiacReport'
import ArticlesPage from './pages/Articles'
import ArticleDetailPage from './pages/ArticleDetail'
import ZodiacInsightsPage from './pages/ZodiacInsights'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports/astrology" element={<AstrologyReportPage />} />
        <Route path="/reports/zodiac" element={<ZodiacReportPage />} />
        <Route path="/zodiac-insights" element={<ZodiacInsightsPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

