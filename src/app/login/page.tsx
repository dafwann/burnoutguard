'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HeartPulse } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { GradientBlobs } from '@/components/visual/GradientBlobs'
import { MeditationIllustration } from '@/components/visual/Illustrations'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({
        title: 'Login gagal',
        description:
          error.message === 'Invalid login credentials'
            ? 'Email belum terdaftar atau password salah'
            : 'Terjadi kesalahan, coba lagi',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Login berhasil', description: 'Selamat datang kembali!' })
      router.push('/dashboard')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <GradientBlobs />

      <div className="relative mx-auto grid min-h-screen w-[min(1100px,calc(100%-2rem))] gap-10 py-10 lg:grid-cols-2 lg:items-center">

        {/* Kiri — hanya desktop */}
        <div className="hidden lg:block">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold">BurnoutGuard</span>
          </Link>

          <h2 className="mt-10 font-display text-4xl font-bold leading-tight">
            Kenali burnout-mu sebelum jadi berbahaya.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Masuk untuk melihat skor terbaru, insight, dan langkah kecil berikutnya.
          </p>
          <div className="mt-8">
            <MeditationIllustration className="w-full max-w-md" />
          </div>
        </div>

        {/* Kanan — form */}
        <div className="glass rounded-3xl p-6 sm:p-8">
          {/* Logo mobile */}
          <Link href="/" className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold">BurnoutGuard</span>
          </Link>

          <h1 className="font-display text-2xl font-bold">Selamat datang kembali</h1>
          <p className="mt-1 text-sm text-muted-foreground">Lanjutkan dari sesi terakhirmu.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <div className="text-xs font-semibold">Email</div>
              <input
                type="email"
                placeholder="kamu@kampus.ac.id"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                required
              />
            </label>

            <label className="block">
              <div className="text-xs font-semibold">Password</div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>

            <div className="text-center text-xs text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Lupa password?
              </Link>
              <div className="mt-3">
                Belum punya akun?{' '}
                <Link href="/register" className="font-semibold text-foreground">
                  Daftar gratis
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}