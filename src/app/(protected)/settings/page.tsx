'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const fullName = user.user_metadata?.full_name || ''
      setName(fullName)
      setNewName(fullName)
      setEmail(user.email || '')
      setLoading(false)
    }
    loadUser()
  }, [])

  async function handleSave() {
    if (!newName.trim()) return
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: newName } })
    if (!error) { setName(newName); setEditing(false) }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:space-y-6 sm:p-6">

      {/* ── Profile Card ── */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft sm:p-6">
        <h2 className="font-display text-xl font-bold">Profil</h2>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">

          {/* Avatar — di mobile */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          {/* Info area — di mobile: teks rata tengah */}
          <div className="flex w-full flex-1 flex-col items-start gap-3">
            {!editing ? (
              <>
                {/* Nama + email */}
                <div className="text-left">
                  <div className="text-lg font-semibold">{name || '—'}</div>
                  <div className="text-sm text-muted-foreground">{email}</div>
                </div>

                {/* Tombol edit */}
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                >
                  Edit
                </button>
              </>
            ) : (
              <div className="w-full space-y-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:shadow-glow transition"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setNewName(name) }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Security Card ── */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft sm:p-6">
        <h2 className="font-display text-xl font-bold">Keamanan</h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium">Password</div>
            <div className="text-sm text-muted-foreground">
              Ganti password akun kamu
            </div>
          </div>
          <Link
            href="/forgot-password"
            className="w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            Reset Password
          </Link>
        </div>
      </div>

    </div>
  )
}