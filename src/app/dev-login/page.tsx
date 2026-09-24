'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push('/admin')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-[var(--surface)] p-8 shadow-2xl dark:border-white/10">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">
          Dev <span className="text-accent">Access</span>
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full rounded-lg border border-slate-300 bg-[var(--background)] p-3 text-slate-900 transition-colors placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full rounded-lg border border-slate-300 bg-[var(--background)] p-3 text-slate-900 transition-colors placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-accent hover:brightness-110 text-white font-bold py-3 rounded-lg shadow-lg shadow-accent/20 transition-all active:scale-[0.98]">
            Enter Dashboard
          </button>
        </form>
      </div>
    </main>
  )
}