'use client'

import { motion } from 'framer-motion'
import { Users, CalendarCheck, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function StatsSection({
  anggotaAktif = 0,
  programSukses = 0,
  saldoKas = 0
}: {
  anggotaAktif?: number
  programSukses?: number
  saldoKas?: number
}) {
  const formatRupiahCompact = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      notation: "compact",
      compactDisplay: "short"
    }).format(angka)
  }

  const stats = [
    {
      title: "Pengurus & Anggota Aktif",
      value: `${anggotaAktif}+`,
      caption: "Pemuda yang aktif berkontribusi",
      icon: Users,
      color: "text-[#1868db]",
      bg: "bg-[#e9f2fe] dark:bg-[#1c2b42]"
    },
    {
      title: "Program Kerja Sukses",
      value: `${programSukses}`,
      caption: "Kegiatan terlaksana dengan baik",
      icon: CalendarCheck,
      color: "text-[#36b37e]",
      bg: "bg-[#e3fcef] dark:bg-[#123824]"
    },
    {
      title: "Kas Tersedia",
      value: `Rp ${formatRupiahCompact(saldoKas)}`,
      caption: "Saldo transparan untuk kegiatan",
      icon: Wallet,
      color: "text-[#fca700]",
      bg: "bg-[#fffae6] dark:bg-[#332a00]"
    }
  ]

  return (
    <section className="py-12 bg-[#f0f1f2]/60 dark:bg-[#14171a] border-y border-[#f0f1f2] dark:border-[#292a2e]">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="rounded-[20px] bg-white dark:bg-[#181b20] border border-[#f0f1f2] dark:border-[#292a2e] shadow-[0_0_1px_0_rgba(9,30,66,0.31),0_1px_1px_0_rgba(9,30,66,0.15)] dark:shadow-none p-6 transition-all hover:translate-y-[-2px]">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-full ${stat.bg} shrink-0`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl font-extrabold text-[#101214] dark:text-white tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-semibold text-[#101214] dark:text-gray-200 mt-0.5">
                      {stat.title}
                    </p>
                    <p className="text-xs text-[#42526e] dark:text-[#b7b9be] mt-0.5">
                      {stat.caption}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
