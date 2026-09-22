import { getStruktur } from '@/app/actions/struktur'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Users } from 'lucide-react'

export const metadata = {
  title: 'Struktur Organisasi | Tirtajaya 01'
}

export default async function StrukturPublicPage() {
  const data = await getStruktur()
  
  // Filter only active members
  const activeMembers = data.filter(item => item.is_active)

  return (
    <div className="container py-12 md:py-24 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl">Struktur Pengurus</h1>
        <p className="text-xl text-muted-foreground">
          Mengenal lebih dekat para penggerak Karang Taruna Tirtajaya 01.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Belum ada data pengurus.
          </div>
        ) : (
          activeMembers.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all bg-card/50">
              <div className="aspect-square relative bg-muted overflow-hidden">
                {item.foto_url ? (
                  <Image 
                    src={item.foto_url} 
                    alt={item.nama_lengkap} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <Users className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
              <CardContent className="p-5 text-center -mt-8 relative z-10">
                <div className="bg-background/95 backdrop-blur-sm shadow-sm border rounded-xl p-3">
                  <h3 className="font-heading font-bold text-[15px] line-clamp-1">{item.nama_lengkap}</h3>
                  <p className="text-primary text-sm font-medium mt-1">{item.jabatan}</p>
                  {item.divisi && (
                    <p className="text-xs text-muted-foreground mt-1">Div. {item.divisi}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
