import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type LoginForm = {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, user, loading } = useAuth()
  const { register, handleSubmit, formState } = useForm<LoginForm>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [loading, navigate, user])

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    try {
      await login(data)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as any).response
        setError(res?.data?.detail ?? 'Sign-in failed. Please try again.')
      } else {
        setError('Sign-in failed. Please try again.')
      }
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-white">Welcome back to AstroWhispers</h2>
        <p className="mt-2 text-sm text-white/60">Sign in to review your personalised astrology and zodiac insights.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4 px-8 py-10">
        <div>
          <label className="text-sm text-white/70">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-aurora focus:outline-none"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {formState.errors.email && <p className="mt-1 text-xs text-aurora">{formState.errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm text-white/70">Password</label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-aurora focus:outline-none"
            placeholder="********"
            {...register('password', { required: 'Password is required' })}
          />
          {formState.errors.password && <p className="mt-1 text-xs text-aurora">{formState.errors.password.message}</p>}
        </div>
        {error && <p className="text-center text-xs text-aurora">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-xs text-white/50">
          Don&apos;t have an account yet? <Link to="/register" className="text-aurora">Create one</Link>
        </p>
      </form>
    </div>
  )
}

