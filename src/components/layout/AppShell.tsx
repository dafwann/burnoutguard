'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard'  },
  { href: '/predict',    label: 'Predict'    },
  { href: '/history',    label: 'History'    },
  { href: '/insights',   label: 'Insights'   },
  { href: '/settings',   label: 'Settings'   },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-card px-4 py-6 gap-2">
        <p className="text-lg font-semibold px-2 mb-4">BurnoutGuard</p>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href}>
            <span className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}>
              {item.label}
            </span>
          </Link>
        ))}
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between border-b px-4 py-3">
          <p className="font-semibold">BurnoutGuard</p>
          {/* Add a mobile drawer here if needed */}
        </header>
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
