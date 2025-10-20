import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type RegisterForm = {
  email: string
  password: string
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const { register, handleSubmit, formState } = useForm<RegisterForm>()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        birthPlace: data.birthPlace,
      })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as any).response
        setError(res?.data?.detail ?? 'Registration failed. Please try again.')
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-white">Create your cosmic profile</h2>
        <p className="mt-2 text-sm text-white/60">Add your birth details so we can generate accurate, personalised reports every time.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card grid gap-6 px-10 py-12 md:grid-cols-2">
        <div className="md:col-span-2 grid gap-2">
          <label className="text-sm text-white/70">Preferred name</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-aurora focus:outline-none"
            placeholder="Star traveller"
            {...register('name', { required: 'Name is required' })}
          />
          {formState.errors.name && <p className="text-xs text-aurora">{formState.errors.name.message}</p>}
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-aurora focus:outline-none"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {formState.errors.email && <p className="text-xs text-aurora">{formState.errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-aurora focus:outline-none"
            placeholder="At least 8 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Use at least 8 characters' },
            })}
          />
          {formState.errors.password && <p className="text-xs text-aurora">{formState.errors.password.message}</p>}
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Birth date</label>
          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-aurora focus:outline-none"
            {...register('birthDate', { required: 'Birth date is required' })}
          />
          {formState.errors.birthDate && <p className="text-xs text-aurora">{formState.errors.birthDate.message}</p>}
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Birth time</label>
          <input
            type="time"
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-aurora focus:outline-none"
            {...register('birthTime', { required: 'Birth time is required' })}
          />
          {formState.errors.birthTime && <p className="text-xs text-aurora">{formState.errors.birthTime.message}</p>}
        </div>
        <div className="md:col-span-2 grid gap-2">
          <label className="text-sm text-white/70">Birth place</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-aurora focus:outline-none"
            placeholder="City or coordinates"
            {...register('birthPlace', { required: 'Birth place is required' })}
          />
          {formState.errors.birthPlace && <p className="text-xs text-aurora">{formState.errors.birthPlace.message}</p>}
        </div>
        {error && <p className="md:col-span-2 text-center text-xs text-aurora">{error}</p>}
        <button type="submit" className="btn-primary md:col-span-2" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="md:col-span-2 text-center text-xs text-white/50">
          Already have an account? <Link to="/login" className="text-aurora">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

