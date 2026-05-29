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

  const [fullName, setFullName] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const [emailSent, setEmailSent] =
    useState(false)

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault()

    setLoading(true)

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

    if (error || !data?.user) {
      let message =
        error?.message ||
        'Unable to create account'

      if (
        error?.message
          ?.toLowerCase()
          .includes('already')
      ) {
        message =
          'This email is already registered'
      }

      if (
        error?.message
          ?.toLowerCase()
          .includes('password')
      ) {
        message =
          'Password must be at least 6 characters'
      }

      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      })

      setLoading(false)
      return
    }

    toast({
      title: 'Verification email sent',
      description:
        'Please check your inbox',
    })

    setEmailSent(true)

    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <GradientBlobs />

      <div className="relative mx-auto grid min-h-screen w-[min(1100px,calc(100%-2rem))] gap-10 py-10 lg:grid-cols-2 lg:items-center">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:block">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>

            <span className="font-display text-lg font-bold">
              BurnoutGuard
            </span>
          </Link>

          <h2 className="mt-10 font-display text-4xl font-bold leading-tight">
            A calmer way to know what
            you&apos;re carrying.
          </h2>

          <p className="mt-3 max-w-md text-muted-foreground">
            Create your account to start
            tracking your wellbeing
            journey.
          </p>

          <div className="mt-8">
            <MeditationIllustration className="w-full max-w-md" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="glass rounded-3xl p-8">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 lg:hidden"
          >
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>

            <span className="font-display text-base font-bold">
              BurnoutGuard
            </span>
          </Link>

          {!emailSent ? (
            <>
              <h1 className="font-display text-2xl font-bold">
                Create your account
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                60 seconds. Free with a
                .edu email.
              </p>

              <form
                onSubmit={handleRegister}
                className="mt-6 space-y-4"
              >
                {/* FULL NAME */}
                <label className="block">
                  <div className="text-xs font-semibold">
                    Full name
                  </div>

                  <input
                    type="text"
                    placeholder="Maya Chen"
                    value={fullName}
                    onChange={e =>
                      setFullName(
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                    required
                  />
                </label>

                {/* EMAIL */}
                <label className="block">
                  <div className="text-xs font-semibold">
                    University email
                  </div>

                  <input
                    type="email"
                    placeholder="you@uni.edu"
                    value={email}
                    onChange={e =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                    required
                  />
                </label>

                {/* PASSWORD */}
                <label className="block">
                  <div className="text-xs font-semibold">
                    Password
                  </div>

                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={e =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:shadow-glow"
                    required
                  />
                </label>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
                >
                  {loading
                    ? 'Creating account...'
                    : 'Create account'}
                </button>

                {/* LINKS */}
                <div className="text-center text-xs text-muted-foreground">
                  Already have one?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-foreground"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="mt-8 flex flex-col items-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10">
                <HeartPulse className="h-10 w-10 text-primary" />
              </div>

              <h2 className="mt-6 font-display text-2xl font-bold">
                Verify your email
              </h2>

              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                We&apos;ve sent a
                verification link to:
              </p>

              <p className="mt-1 text-sm font-semibold">
                {email}
              </p>

              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Please check your inbox
                and click the verification
                link before signing in.
              </p>

              <Link
                href="/login"
                className="mt-8 w-full rounded-2xl gradient-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}