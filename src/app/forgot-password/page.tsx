'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeartPulse } from 'lucide-react'

import { createClient } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { GradientBlobs } from '@/components/visual/GradientBlobs'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    const SITE_URL =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { error } = await supabase.auth.resetPasswordFor(email, {
      redirectTo: `${SITE_URL}/reset-password`,
    })

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Reset email terkirim',
        description: 'Cek inbox kamu',
      })
    }

    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <GradientBlobs />

      <div className="relative flex min-h-screen items-start justify-center px-4 pt-16 sm:items-center sm:pt-10">
        <div className="glass w-full max-w-md rounded-3xl p-6 sm:p-8">

          {/* Logo */}
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold">
              BurnoutGuard
            </span>
          </Link>

          <h1 className="font-display text-2xl font-bold">
            Reset password
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Tautan reset akan kami kirimkan menuju alamat email kamu.
          </p>

          <form onSubmit={handleReset} className="mt-6 space-y-4">

            <label className="block">
              <div className="text-xs font-semibold">Email</div>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>

            <div className="text-center text-xs text-muted-foreground">
              Ingat password?{' '}
              <Link href="/login" className="font-semibold text-foreground">
                Masuk
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
