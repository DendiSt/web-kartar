import Image from 'next/image'

export const metadata = {
  title: 'Tentang Kami | Tirtajaya 01'
}

export default function TentangPage() {
  return (
    <div className="container py-12 md:py-24 max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl">Tentang Tirtajaya 01</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Membangun pemuda yang kreatif, inovatif, dan peduli terhadap lingkungan sosial.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
          {/* Replace this placeholder with a real group photo from your storage later */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">Foto Karang Taruna</span>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-heading">Sejarah Kami</h2>
          <p className="text-muted-foreground leading-relaxed">
            Karang Taruna "Tirtajaya 01" didirikan sebagai wadah pengembangan generasi muda non-partisan yang tumbuh atas dasar kesadaran dan rasa tanggung jawab sosial dari, oleh, dan untuk masyarakat khususnya generasi muda di wilayah dusun kami.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Sejak awal berdirinya, kami terus berkomitmen untuk menyelenggarakan berbagai kegiatan positif di bidang sosial, keagamaan, olahraga, dan seni budaya demi mempererat tali persaudaraan antar warga.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-8">
        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
          <h3 className="text-2xl font-bold font-heading text-primary">Visi</h3>
          <p className="text-muted-foreground leading-relaxed">
            Mewujudkan generasi pemuda yang mandiri, tangguh, terampil, berakhlak mulia, serta memiliki kepedulian sosial yang tinggi terhadap lingkungan dan masyarakat desa.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-secondary/5 border border-secondary/10 space-y-4">
          <h3 className="text-2xl font-bold font-heading text-secondary-foreground">Misi</h3>
          <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc list-outside pl-4">
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
