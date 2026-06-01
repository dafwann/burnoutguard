'use client'

import { useState } from 'react'

import Link from 'next/link'

import { createClient } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    )

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Reset email sent',
        description: 'Check your inbox',
      })
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Reset your password
          </CardTitle>

          <CardDescription>
            We’ll send you a reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleReset}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                placeholder="you@uni.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Sending...'
                : 'Send reset link'}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground mt-4">
            Remembered?{' '}
            <Link
              href="/login"
              className="font-semibold text-foreground"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}