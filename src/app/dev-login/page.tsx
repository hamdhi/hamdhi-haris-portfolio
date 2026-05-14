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
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-accent/20 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Dev <span className="text-accent">Access</span>
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
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