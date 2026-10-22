'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Calendar } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f5f7] dark:bg-[#101214] text-foreground transition-colors duration-300 py-20 md:py-28 border-b border-[#e5e7eb] dark:border-[#292a2e]/60">
      {/* Signature Atlassian Geometric Confetti Borders & Angles */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-56 md:h-56 pointer-events-none select-none overflow-hidden opacity-85 dark:opacity-90">
        <div className="absolute -top-12 -left-12 w-32 h-16 bg-[#bf63f3] -rotate-12 transform origin-top-left rounded-sm" />
        <div className="absolute top-16 -left-6 w-24 h-10 bg-[#fca700] rotate-45 transform rounded-sm" />
        <div className="absolute top-28 left-12 w-14 h-6 bg-[#1868db] -rotate-12 transform rounded-sm" />
      </div>

      <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 pointer-events-none select-none overflow-hidden opacity-85 dark:opacity-90">
        <div className="absolute -bottom-10 -right-10 w-44 h-20 bg-[#1868db] rotate-12 transform origin-bottom-right rounded-sm" />
        <div className="absolute bottom-20 -right-6 w-32 h-10 bg-[#36b37e] -rotate-45 transform rounded-sm" />
        <div className="absolute bottom-32 right-16 w-16 h-8 bg-[#fca700] rotate-12 transform rounded-sm" />
        <div className="absolute bottom-8 right-28 w-12 h-12 bg-[#bf63f3] -rotate-12 transform rounded-sm" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 max-w-[1200px] z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-left space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fca700]/15 dark:bg-white/10 text-[#a35200] dark:text-[#fca700] border border-[#fca700]/30 dark:border-white/15 text-xs font-semibold tracking-wide transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PEMUDA KREATIF, DESA BERDAYA</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.02em] leading-[1.08] text-[#101214] dark:text-white transition-colors">
              Sinergi Pemuda, Membangun{' '}
              <span className="text-[#101214] dark:text-white relative inline-block">
                Tirtajaya 01
                {/* Yellow hand-drawn flourish stroke beneath */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#fca700]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#42526e] dark:text-gray-300 max-w-xl font-normal leading-relaxed pt-2 transition-colors">
              Wadah generasi muda Karang Taruna Dusun Tirtajaya 01 untuk berkarya, berinovasi, dan melayani masyarakat dengan semangat gotong royong.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* The Yellow CTA Button (Signature Atlassian Hero button) */}
              <Link href="/kegiatan">
                <Button
                  variant="yellow"
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-semibold bg-[#fca700] hover:bg-[#fca700]/90 text-[#101214] shadow-md shadow-[#fca700]/20 transition-all hover:scale-[1.02]"
                >
                  Jelajahi Kegiatan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Ghost / Outline Secondary Button */}
              <Link href="/agenda">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-7 h-12 text-base border-slate-300 dark:border-white/30 text-[#101214] dark:text-white bg-white/80 dark:bg-transparent hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all shadow-xs"
                >
                  Jadwal Agenda
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Editorial Showcase Card with geometric framing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Blue Background Showcase Frame with 20px radius */}
            <div className="relative p-6 sm:p-8 rounded-[20px] bg-[#1868db] text-white shadow-2xl overflow-hidden">
              {/* Geometric accent slice */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#bf63f3]/30 rounded-bl-full pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#fca700]/30 rounded-tr-full pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                      TJ
                    </div>
                    <div>
                      <div className="font-heading font-bold text-base leading-tight">Karang Taruna Dusun</div>
                      <div className="text-xs text-white/80">Sumurgintung, Pagaden Barat</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 font-medium">Aktif</span>
                </div>

                <p className="text-sm text-white/90 leading-relaxed">
                  &ldquo;Menumbuhkan solidaritas pemuda yang mandiri, bermartabat, dan bermanfaat bagi kemajuan sosial dan ekonomi warga dusun.&rdquo;
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/10 rounded-[12px] p-3 backdrop-blur-xs">
                    <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
                      <Users className="w-3.5 h-3.5 text-[#fca700]" />
                      Pengurus
                    </div>
                    <div className="text-xl font-bold font-heading">Struktur Aktif</div>
                  </div>
                  <div className="bg-white/10 rounded-[12px] p-3 backdrop-blur-xs">
                    <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#eed7fc]" />
                      Transparansi
                    </div>
                    <div className="text-xl font-bold font-heading">Terbuka 100%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
