'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]"></div>
      
      <div className="container relative mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Sinergi Pemuda untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tirtajaya 01</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Wadah pembinaan dan pengembangan generasi muda yang aktif, kreatif, dan inovatif. Bersama membangun lingkungan yang lebih baik.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/kegiatan">
              <Button size="lg" className="h-12 px-8 rounded-full text-base bg-primary hover:bg-primary/90">
                Lihat Kegiatan Kami <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/agenda">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base">
                Agenda Terdekat
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
