'use client'

import Link from 'next/link'

import Footer from '@/components/Footer'
import SpiderBg from '@/components/SpiderBg'

export default function ErrorPage() {
  return (
    <main className="relative min-h-screen bg-[#020a05] text-white flex flex-col">
      <SpiderBg />
      
      <section className="relative z-10 flex-grow flex items-center justify-center px-6 pt-32 pb-20">
        <div className="text-center max-w-2xl mx-auto border border-[#2F9A58]/20 bg-[#05120a]/80 p-8 md:p-12 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(47,154,88,0.1)]">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase tracking-tighter">
            System_<span className="text-[#2F9A58]">Error</span>
          </h1>
          <p className="text-slate-400 mono text-sm lowercase mb-8">
            {`> exception caught: unable to process request. please try again.`}
          </p>

          <div className="space-y-3 mb-10 mono text-sm text-left bg-black/60 p-6 rounded border border-[#2F9A58]/20">
            <p className="text-gray-400">{`// if the problem persists, contact admin:`}</p>
            <p className="text-[#2F9A58] hover:text-white transition">
              <a href="tel:0702031483">{`> tel: 0702031483`}</a>
            </p>
            <p className="text-[#2F9A58] hover:text-white transition">
              <a href="mailto:hamdhiharis@gmail.com">{`> mail: hamdhiharis@gmail.com`}</a>
            </p>
          </div>

          {/* Refresh The page */}
            <Link href="/" className="inline-block px-6 py-3 bg-[#2F9A58] hover:bg-[#2F9A58]/90 transition rounded text-sm font-medium">
              Refresh Page
            </Link>
        </div>
      </section>

      <Footer name="Hamdhi Haris" version="1.0.02" />
    </main>
  )
}