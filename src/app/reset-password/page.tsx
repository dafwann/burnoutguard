'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HeartPulse } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { GradientBlobs } from '@/components/visual/GradientBlobs'
import { useToast } from '@/hooks/use-toast'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router   = useRouter()
  const { toast } = useToast()

  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading]                 = useState(false)
  const [ready, setReady]                     = useState(false)

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        toast({
          title: 'Tautan tidak valid atau kedaluwarsa',
          description: 'Minta tautan reset password baru',
          variant: 'destructive',
        })
        router.push('/forgot-password')
        return
      }
      setReady(true)
    }
    init()
  }, [router, supabase, toast])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 6) {
      toast({ title: 'Password terlalu pendek', description: 'Minimal 6 karakter', variant: 'destructive' })
      return
    }
    if (password !== confirmPassword) {
      toast({ title: 'Password tidak cocok', description: 'Pastikan kedua password sama', variant: 'destructive' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast({ title: 'Gagal memperbarui', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Password diperbarui', description: 'Silakan masuk dengan password baru' })
      await supabase.auth.signOut()
      router.push('/login')
    }
    setLoading(false)
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Memuat sesi reset...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <GradientBlobs />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="glass w-full max-w-md rounded-3xl p-6 sm:p-8">
          {/* Logo */}
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold">BurnoutGuard</span>
          </Link>

          <h1 className="font-display text-2xl font-bold">Buat password baru</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih password yang kuat untuk akunmu.
          </p>

          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <label className="block">
              <div className="text-xs font-semibold">Password baru</div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                required
              />
            </label>

            <label className="block">
              <div className="text-xs font-semibold">Konfirmasi password</div>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Memperbarui...' : 'Perbarui password'}
            </button>

            <div className="text-center text-xs text-muted-foreground">
              Kembali ke{' '}
              <Link href="/login" className="font-semibold text-foreground">
                halaman masuk
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}