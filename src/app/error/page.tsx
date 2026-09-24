'use client'

import Link from 'next/link'

import Footer from '@/components/Footer'

export default function ErrorPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--background)] text-slate-900 dark:text-white">
      
      <section className="relative z-10 flex-grow flex items-center justify-center px-6 pt-32 pb-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-[var(--surface)] p-8 text-center shadow-xl dark:border-white/10 md:p-12">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent">Something went wrong / 500</p>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight md:text-7xl">
            A brief <span className="text-accent">detour.</span>
          </h1>
          <p className="text-slate-400 mono text-sm lowercase mb-8">
            {`> exception caught: unable to process request. please try again.`}
          </p>

          <div className="mb-10 space-y-3 rounded-xl border border-slate-200 bg-[var(--background)] p-6 text-left font-mono text-sm dark:border-white/10">
            <p className="text-slate-500">{`// if the problem persists, contact admin:`}</p>
            <p className="text-accent transition hover:text-accent-dark">
              <a href="tel:0702031483">{`> tel: 0702031483`}</a>
            </p>
            <p className="text-accent transition hover:text-accent-dark">
              <a href="mailto:hamdhiharis@gmail.com">{`> mail: hamdhiharis@gmail.com`}</a>
            </p>
          </div>

          {/* Refresh The page */}
            <Link href="/" className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-dark">
              Refresh Page
            </Link>
        </div>
      </section>

      <Footer name="Hamdhi Haris" version="1.0.02" />
    </main>
  )
}