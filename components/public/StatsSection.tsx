'use client'

import { motion } from 'framer-motion'
import { Users, CalendarCheck, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    title: "Anggota Aktif",
    value: "45+",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Program Sukses",
    value: "24",
    icon: CalendarCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "Transparansi Dana",
    value: "100%",
    icon: Wallet,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
]

export default function StatsSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="border-none shadow-md bg-background/60 backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className={`p-4 rounded-full ${stat.bg} mb-4`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
