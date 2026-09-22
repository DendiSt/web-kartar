'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useMemo } from 'react'

export function KeuanganChart({ data }: { data: any[] }) {
  // Aggregate data by month (simple version)
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { name: string, Pemasukan: number, Pengeluaran: number }> = {}
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const name = d.toLocaleDateString('id-ID', { month: 'short' })
      monthlyData[key] = { name, Pemasukan: 0, Pengeluaran: 0 }
    }

    data.forEach(item => {
      const d = new Date(item.tanggal)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (monthlyData[key]) {
        if (item.tipe === 'pemasukan') {
          monthlyData[key].Pemasukan += Number(item.jumlah)
        } else {
          monthlyData[key].Pengeluaran += Number(item.jumlah)
        }
      }
    })

    return Object.values(monthlyData)
  }, [data])

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(value)
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Statistik Keuangan (6 Bulan Terakhir)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatRupiah} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0)}
              cursor={{ fill: 'transparent' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
