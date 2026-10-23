
import Image from 'next/image'

export const metadata = {
  title: 'Tentang Kami | Tirtajaya 01'
}

export default function TentangPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-20 max-w-4xl space-y-12 md:space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight">Tentang Tirtajaya 01</h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Membangun pemuda yang kreatif, inovatif, dan peduli terhadap lingkungan sosial.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="aspect-4/3 sm:aspect-square relative rounded-2xl overflow-hidden bg-muted shadow-md border border-border/80 group">
          <Image
            src="/images/fotokartar.jpeg"
            alt="Foto Bersama Pemuda Karang Taruna Tirtajaya 01"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 450px"
            priority
          />
        </div>
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">Sejarah Kami</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Karang Taruna &ldquo;Tirtajaya 01&rdquo; didirikan sebagai wadah pengembangan generasi muda non-partisan yang tumbuh atas dasar kesadaran dan rasa tanggung jawab sosial dari, oleh, dan untuk masyarakat khususnya generasi muda di wilayah dusun kami.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Sejak awal berdirinya, kami terus berkomitmen untuk menyelenggarakan berbagai kegiatan positif di bidang sosial, keagamaan, olahraga, dan seni budaya demi mempererat tali persaudaraan antar warga.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 pt-4 md:pt-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-primary">Visi</h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Mewujudkan generasi pemuda yang mandiri, tangguh, terampil, berakhlak mulia, serta memiliki kepedulian sosial yang tinggi terhadap lingkungan dan masyarakat desa.
          </p>
        </div>
        <div className="p-6 sm:p-8 rounded-2xl bg-secondary/5 border border-secondary/10 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-secondary-foreground">Misi</h3>
          <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed list-disc list-outside pl-4">
            <li>Menyelenggarakan kegiatan kepemudaan yang positif dan inovatif.</li>
            <li>Meningkatkan kepedulian sosial melalui program bakti masyarakat.</li>
            <li>Mengembangkan potensi di bidang olahraga, seni, dan kewirausahaan.</li>
            <li>Menjalin kemitraan yang baik dengan pemerintah desa dan tokoh masyarakat.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
