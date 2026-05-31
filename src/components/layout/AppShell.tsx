'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { HeartPulse, LayoutDashboard, Brain, Settings, LogOut } from 'lucide-react'
import { MobileTabBar } from '@/components/layout/MobileTabBar'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/predict',   label: 'Prediksi',   icon: Brain           },
  { href: '/settings',  label: 'Pengaturan',  icon: Settings        },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex fixed left-0 top-0 z-50 h-screen w-64 flex-col overflow-y-auto border-r border-border bg-sidebar p-4">
        {/* Logo */}
        <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow shrink-0">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div className="font-display text-lg font-bold tracking-tight">
            BurnoutGuard
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                pathname === href
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-light to-mint/40 p-4">
            <div className="text-sm font-semibold">BurnoutGuard</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Monitor risiko burnout, dapatkan rekomendasi AI, dan pantau progresmu.
            </p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      {/* md:pl-64 beri ruang untuk sidebar fixed */}
      <div className="flex flex-1 flex-col min-w-0 md:pl-64">

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold tracking-tight">
              BurnoutGuard
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {/* Content — pb-24 beri ruang untuk MobileTabBar */}
        <main className="flex-1 p-4 pb-24 sm:p-6 md:pb-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ── Mobile Tab Bar ── */}
      <MobileTabBar />
    </div>
  )
}