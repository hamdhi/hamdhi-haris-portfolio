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
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-cyan-500/20 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Dev <span className="text-cyan-400">Access</span></h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all">
            Enter Dashboard
          </button>
        </form>
      </div>
    </main>
  )
}