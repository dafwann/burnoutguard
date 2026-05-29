'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        toast({
          title: 'Invalid or expired link',
          description: 'Please request a new password reset link',
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
      toast({
        title: 'Password too short',
        description: 'Minimum 6 characters required',
        variant: 'destructive',
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Password updated',
        description: 'You can now sign in with your new password',
      })

      await supabase.auth.signOut()
      router.push('/login')
    }

    setLoading(false)
  }

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading reset session...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Set new password
          </CardTitle>

          <CardDescription>
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground mt-4">
            Back to{' '}
            <Link href="/login" className="font-semibold text-foreground">
              login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}