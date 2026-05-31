'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeartPulse } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { GradientBlobs } from '@/components/visual/GradientBlobs'
import { MeditationIllustration } from '@/components/visual/Illustrations'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const { toast } = useToast()
  const supabase = createClient()

  const [fullName, setFullName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error || !data?.user) {
      let message = error?.message || 'Gagal membuat akun'
      if (error?.message?.toLowerCase().includes('already'))
        message = 'Email ini sudah terdaftar'
      if (error?.message?.toLowerCase().includes('password'))
        message = 'Password minimal 6 karakter'

      toast({ title: 'Pendaftaran gagal', description: message, variant: 'destructive' })
      setLoading(false)
      return
    }

    toast({ title: 'Email verifikasi terkirim', description: 'Cek kotak masukmu' })
    setEmailSent(true)
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
            Buat akun untuk mulai memantau perjalanan kesehatan mentalmu.
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

          {!emailSent ? (
            <>
              <h1 className="font-display text-2xl font-bold">Buat akun baru</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gratis. Selesai dalam 60 detik.
              </p>

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <label className="block">
                  <div className="text-xs font-semibold">Nama lengkap</div>
                  <input
                    type="text"
                    placeholder="Budi Santoso"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                    required
                  />
                </label>

                <label className="block">
                  <div className="text-xs font-semibold">Email kampus</div>
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
                    placeholder="Minimal 8 karakter"
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
                  {loading ? 'Membuat akun...' : 'Buat akun'}
                </button>

                <div className="text-center text-xs text-muted-foreground">
                  Sudah punya akun?{' '}
                  <Link href="/login" className="font-semibold text-foreground">
                    Masuk
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10">
                <HeartPulse className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold">Verifikasi emailmu</h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Kami telah mengirim tautan verifikasi ke:
              </p>
              <p className="mt-1 text-sm font-semibold break-all">{email}</p>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Buka kotak masukmu dan klik tautan verifikasi sebelum masuk.
              </p>
              <Link
                href="/login"
                className="mt-8 w-full rounded-2xl gradient-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
              >
                Kembali ke halaman masuk
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}