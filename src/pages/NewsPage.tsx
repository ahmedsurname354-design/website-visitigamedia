import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, MoveRight } from 'lucide-react';
import { useTranslation, type Lang } from '@/i18n';

export interface NewsArticle {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  author: { name: string; role: string; initials: string };
  content: string[];
}

export const featuredArticles: NewsArticle[] = [
  {
    id: 1, category: 'Digital Advertising', title: 'Kenapa Iklan Digital Jauh Lebih Efektif untuk Brand Anda?',
    excerpt: 'Videotron membantu brand tampil lebih relevan, responsif, dan berkesan di ruang publik.', date: '18 Aug 2026', readTime: '6 min read',
    image: '/news/digital-advertising.jpg', author: { name: 'Visitiga Media', role: 'Editorial Team', initials: 'VM' },
    content: ['Di era serba digital, cara brand berkomunikasi telah berubah jauh dibandingkan tahun-tahun sebelumnya. Videotron menjadi salah satu media pemasaran luar ruang yang menarik karena menampilkan konten dinamis, penuh warna, dan mudah menarik perhatian.', 'Videotron memadukan gerak, warna, dan audio opsional sehingga dapat menangkap perhatian pejalan kaki maupun pengemudi dalam hitungan detik. Penempatan di pusat keramaian, persimpangan, atau area komersial meningkatkan frekuensi impresi secara signifikan.', 'Konten iklan digital dapat diperbarui secara real-time tanpa biaya cetak ulang. Promo, produk baru, dan event musiman bisa langsung ditayangkan sehingga brand mampu merespons tren, situasi, cuaca, maupun kejadian lokal dengan cepat.', 'Dengan video, animasi, motion graphic, QR code, dan call-to-action, videotron membuka peluang storytelling visual yang kuat. Data tayangan dan interaksi juga membantu brand mengukur efektivitas kampanye serta mengoptimalkan konten dan jadwal tayang.', 'Videotron bukan sekadar alat iklan, melainkan medium komunikasi visual yang membuat brand tampil modern, relevan, dan berdampak.']
  },
  {
    id: 2, category: 'Event', title: 'Visitiga Media Raih Kepercayaan sebagai Mitra LED Utama MotoGP Mandalika 2025',
    excerpt: 'Visitiga Media dipercaya menjadi mitra teknologi tampilan visual untuk MotoGP Mandalika 2025.', date: '12 Aug 2026', readTime: '5 min read',
    image: '/news/mandalika.png', author: { name: 'Visitiga Media', role: 'Editorial Team', initials: 'VM' },
    content: ['Visitiga Media kembali membuktikan kredibilitasnya sebagai penyedia jasa LED dan event organizer terkemuka di Indonesia dengan dipercaya menjadi mitra teknologi tampilan visual untuk MotoGP Mandalika 2025, yang digelar pada 3–5 Oktober 2025 di Sirkuit Internasional Pertamina Mandalika, Lombok.', 'Visitiga Media menyediakan lima set unit LED rental premium yang dirancang khusus untuk kebutuhan visual acara bertaraf internasional. Teknologi LED ini membantu penonton menikmati aksi balapan, waktu putaran, dan informasi teknis dengan kualitas visual terbaik.', 'Salah satu highlight kontribusi Visitiga Media adalah desain LED khusus di garis start Sirkuit Mandalika. Area ini menjadi titik paling krusial saat balapan dimulai dan lampu-lampu start menyala.', 'Untuk area podium, Visitiga Media menyediakan LED premium dengan resolusi tinggi P3.9, warna akurat dan konsisten, serta sistem audio-visual terintegrasi. Seluruhnya dirancang untuk mendukung momen penghargaan dan wawancara pemenang secara mewah dan profesional.', 'Keterlibatan ini menambah portofolio Visitiga Media dalam industri event olahraga dan festival nasional, dengan solusi media terintegrasi dari perencanaan hingga maintenance.']
  },
  {
    id: 3, category: 'Hospitality', title: 'Digital Signage Bukan Sekadar Layar',
    excerpt: 'Digital signage menghubungkan tamu dengan layanan, pengalaman, dan citra merek secara real-time.', date: '05 Aug 2026', readTime: '4 min read',
    image: '/news/digital-signage.png', author: { name: 'Visitiga Media', role: 'Editorial Team', initials: 'VM' },
    content: ['Digital signage telah berevolusi jauh dari fungsi dasar menampilkan informasi. Di sektor hospitality, teknologi ini menjadi alat strategis yang menghubungkan tamu dengan layanan, pengalaman, dan citra merek secara real-time dan kontekstual.', 'Layar interaktif di lobby dan entrance membantu tamu menemukan fasilitas tanpa harus bertanya ke pusat informasi. Penawaran F&B, promo, dan agenda acara yang ditampilkan secara visual juga dapat mendorong pembelian spontan.', 'Informasi real-time seperti jadwal shuttle, cuaca, atau pengumuman penting membuat konsumen merasa lebih terlayani sekaligus mengurangi beban operasional staf.', 'Konten visual berkualitas di area ramai seperti lobby, lift, dan lounge memperkuat identitas merek serta menciptakan kesan pertama yang konsisten. Integrasi dengan CRM atau PMS bahkan memungkinkan pesan yang lebih personal untuk tamu.', 'Visitiga membantu brand menyatukan jaringan digital signage menjadi ekosistem yang mudah dikelola, dari penjadwalan konten hingga pengumpulan data engagement.']
  },
];

export const popularArticles: NewsArticle[] = [
  { id: 4, category: 'Technology', title: 'LED Indoor vs LED Outdoor: Kenapa Tidak Bisa Disamakan?', excerpt: 'Kenali perbedaan kecerahan, ketahanan cuaca, dan pixel pitch sebelum memilih layar LED.', date: '29 Jul 2026', readTime: '6 min read', image: '/news/led-indoor-vs-outdoor.jpeg', author: { name: 'Visitiga Media', role: 'Editorial Team', initials: 'VM' }, content: ['Layar LED terlihat serupa dari jauh, tetapi komponennya dirancang untuk kondisi yang berbeda. Kecerahan, ketahanan terhadap cuaca, dan pixel pitch menentukan performa serta umur layar.', 'LED indoor umumnya memiliki kecerahan 600–1.000 nits untuk ruang ber-AC dan pencahayaan terkontrol. LED outdoor membutuhkan 3.000–10.000+ nits agar tetap terbaca di bawah sinar matahari langsung.', 'LED outdoor menggunakan enclosure tahan air dan debu, seperti IP65 atau IP66, pelapis anti-UV, ventilasi, serta sistem drainase. LED indoor tidak dirancang menghadapi perubahan suhu ekstrem, kelembapan, dan hujan.', 'Pixel pitch indoor biasanya lebih kecil, P1.25–P4, untuk jarak pandang dekat dan detail tinggi. Outdoor umumnya memakai P4–P16 karena jarak pandang lebih jauh. Memasang tipe yang salah dapat meningkatkan biaya energi, risiko kerusakan, dan downtime.', 'Pilih LED sesuai lokasi: indoor untuk ruang rapat atau studio, outdoor untuk billboard, facade, dan stadion, serta semi-outdoor dengan proteksi dan kecerahan menengah.'] },
  { id: 5, category: 'Audio Visual', title: 'Bukan Sekadar Layar: Dampak Teknologi Visual terhadap Hospitality, Retail, Pendidikan, dan Pemerintahan', excerpt: 'Teknologi visual adalah pengungkit hasil untuk layanan, penjualan, pembelajaran, dan operasional.', date: '23 Jul 2026', readTime: '7 min read', image: '/news/technology-visual.jpg', author: { name: 'Visitiga Media', role: 'Editorial Team', initials: 'VM' }, content: ['Di era digital, layar dan sistem audio-visual bukan lagi pelengkap, melainkan pengungkit hasil. Teknologi visual mengubah cara organisasi melayani tamu, menjual, mengajar, dan mengelola layanan.', 'Dalam hospitality, videowall, signage interaktif, dan Smart TV membantu menampilkan cerita merek, rekomendasi kuliner, hingga reservasi layanan. Hasilnya adalah pengalaman tamu yang lebih baik dan loyalitas yang meningkat.', 'Di retail, display dinamis, mirror interaktif, dan digital pricing menghubungkan stok, promo, serta perilaku belanja sehingga kunjungan lebih lama, konversi meningkat, dan nilai transaksi rata-rata naik.', 'Di pendidikan, layar interaktif, wireless presentation, dan lecture capture membuat kelas lebih eksploratif serta kolaboratif. Sementara di pemerintahan, pengumuman digital, kios mandiri, dan control room videowall membantu mempercepat layanan publik.', 'Solusi yang baik selalu dimulai dari tujuan bisnis dan KPI, didukung konten relevan, integrasi CMS dengan CRM atau ERP, skalabilitas, aksesibilitas, dan keamanan.'] },
];

const sidebarArticles = [
  { title: 'Kenapa Iklan Digital Jauh Lebih Efektif untuk Brand Anda?', category: 'Digital Advertising', image: '/news/sidebar-digital-advertising.jpg', author: 'Visitiga Media', initials: 'VM' },
  { title: 'LED Indoor vs LED Outdoor: Kenapa Tidak Bisa Disamakan?', category: 'Technology', image: '/news/sidebar-led-technology.jpg', author: 'Visitiga Media', initials: 'VM' },
  { title: 'Digital Signage Bukan Sekadar Layar', category: 'Hospitality', image: '/news/sidebar-digital-signage.jpg', author: 'Visitiga Media', initials: 'VM' },
];

const indonesianArticles: Record<number, Partial<Pick<NewsArticle, 'category' | 'title' | 'excerpt'>>> = {
  1: { category: 'Inovasi', title: 'Era baru media luar ruang: lebih terang, lebih cerdas, dan dirancang untuk memberi dampak.', excerpt: 'Bagaimana ekosistem LED cerdas mengubah cara brand berbicara kepada audiens yang terus bergerak.' },
  2: { category: 'Studi Kasus', title: 'Merancang momen ritel yang menghentikan scroll—dan keramaian.', excerpt: 'Melihat lebih dekat lapisan di balik pengalaman storefront LED yang berkinerja tinggi.' },
  3: { category: 'Teknologi', title: 'Mengapa pixel pitch adalah detail yang mengubah setiap pengalaman menonton.', excerpt: 'Panduan sederhana untuk menyesuaikan resolusi LED dengan ruang dan audiens Anda.' },
  4: { category: 'Wawasan', title: 'Lima cara display dinamis mengubah perhatian menjadi tindakan.', excerpt: 'Prinsip di balik konten display yang mendapat perhatian kedua di ruang dengan lalu lintas tinggi.' },
  5: { category: 'Di Balik Proyek', title: 'Dari sketsa pertama hingga menyala: membangun LED wall ikonis.', excerpt: 'Proses kolaboratif kami dalam menciptakan instalasi yang andal dan tajam secara visual.' },
  6: { category: 'Brand', title: 'Storefront Anda hanya punya tiga detik untuk membuat kesan yang bertahan.', excerpt: 'Panduan praktis untuk membuat pengalaman brand fisik terasa begitu khas.' },
};

const indonesianSidebar: Record<number, { category: string; title: string }> = {
  0: { category: 'Opini', title: 'Kampanye terkuat dirancang untuk sudut pandang sekilas.' },
  1: { category: 'Perspektif', title: 'Hal yang sering keliru dipahami brand tentang “lebih banyak waktu layar”.' },
  2: { category: 'Teknologi', title: 'Kekuatan tenang dari display yang dikalibrasi sempurna.' },
};

void indonesianArticles;
void indonesianSidebar;

export function localizeArticle(article: NewsArticle, lang: Lang) {
  // The supplied editorial content is Indonesian, so it remains authoritative
  // in both language modes until an English editorial translation is provided.
  void lang;
  return article;
}

function Meta({ article, light = false }: { article: NewsArticle; light?: boolean }) {
  return <div className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${light ? 'text-[#735c4d]' : 'text-white/55'}`}><span>{article.date}</span><span className="h-1 w-1 rounded-full bg-orange-500" /><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{article.readTime}</span></div>;
}

function NewsCard({ article, lang }: { article: NewsArticle; lang: Lang }) {
  return <article className="group grid gap-5 border-b border-white/10 pb-8 sm:grid-cols-[12rem_1fr] sm:gap-7">
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900 sm:aspect-square">
      <img src={article.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-400 backdrop-blur">{article.category}</span>
    </div>
    <div className="flex flex-col items-start">
      <Meta article={article} light />
      <h3 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#241811] sm:text-3xl">{article.title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#735c4d]">{article.excerpt}</p>
      <Link to={`/news/${article.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-500 transition group-hover:gap-3 group-hover:text-orange-700">{lang === 'id' ? 'Baca selengkapnya' : 'Read more'} <ArrowRight className="h-4 w-4" /></Link>
    </div>
  </article>;
}

export default function NewsPage() {
  const { lang } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const featured = featuredArticles.map((article) => localizeArticle(article, lang));
  const popular = popularArticles.map((article) => localizeArticle(article, lang));
  const sidebar = sidebarArticles;
  const activeArticle = featured[activeSlide];
  const chooseSlide = useCallback(
    (direction: number) => setActiveSlide((current) => (current + direction + featuredArticles.length) % featuredArticles.length),
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => chooseSlide(1), 6500);
    return () => window.clearInterval(timer);
  }, [chooseSlide]);

  return (
    <div className="bg-[#fffaf3] text-[#241811]">
      <section className="relative isolate overflow-hidden border-b border-[#ead5c1] pt-28 sm:pt-36">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_0%,rgba(249,115,22,.22),transparent_28%),linear-gradient(120deg,#fffaf3_35%,#fff1df)]" />
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div><p className="text-xs font-bold uppercase tracking-[0.26em] text-orange-400">Visitiga Journal</p><h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{lang === 'id' ? 'Ide dalam ' : 'Ideas in '}<span className="text-orange-500">{lang === 'id' ? 'sorotan penuh.' : 'full light.'}</span></h1></div>
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-[#ead5c1] bg-orange-100 sm:min-h-[530px]">
            {featured.map((article, index) => <img key={article.id} src={article.image} alt="" className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform ${index === activeSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} />)}
            <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf3]/35 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
              <div className="theme-keep-light max-w-3xl"><h2 className="text-3xl font-black leading-[1.02] tracking-[-0.045em] text-white [text-shadow:0_3px_18px_rgba(0,0,0,.85)] sm:text-5xl lg:text-6xl">{activeArticle.title}</h2><p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/95 [text-shadow:0_2px_12px_rgba(0,0,0,.9)] sm:text-base">{activeArticle.excerpt}</p><div className="mt-6 flex flex-wrap items-center gap-5"><Meta article={activeArticle} /><Link to={`/news/${activeArticle.id}`} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400">{lang === 'id' ? 'Jelajahi berita' : 'Explore story'} <ArrowUpRight className="h-4 w-4" /></Link></div></div>
            </div>
            <div className="absolute right-5 top-5 flex gap-2"><button onClick={() => chooseSlide(-1)} aria-label={lang === 'id' ? 'Berita sebelumnya' : 'Previous story'} className="grid h-10 w-10 place-items-center rounded-full border border-orange-500/25 bg-[#fffaf3]/85 text-[#241811] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-600"><ChevronLeft className="h-5 w-5" /></button><button onClick={() => chooseSlide(1)} aria-label={lang === 'id' ? 'Berita selanjutnya' : 'Next story'} className="grid h-10 w-10 place-items-center rounded-full border border-orange-500/25 bg-[#fffaf3]/85 text-[#241811] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-600"><ChevronRight className="h-5 w-5" /></button></div>
            <div className="absolute bottom-5 right-6 flex gap-2">{featured.map((article, index) => <button key={article.id} onClick={() => setActiveSlide(index)} aria-label={`${lang === 'id' ? 'Lihat berita' : 'View story'} ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-orange-500' : 'w-3 bg-[#735c4d]/45 hover:bg-[#735c4d]'}`} />)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="grid gap-14 xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-16">
        <div><div className="mb-8 flex items-end justify-between border-b border-[#ead5c1] pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">{lang === 'id' ? 'Kabar terbaru' : 'The feed'}</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{lang === 'id' ? 'Berita Populer' : 'Popular News'}</h2></div><button className="hidden items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700 sm:flex">{lang === 'id' ? 'Semua berita' : 'All stories'} <MoveRight className="h-4 w-4" /></button></div><div className="space-y-8">{popular.map((article) => <NewsCard key={article.id} article={article} lang={lang} />)}</div></div>
        <aside className="space-y-8"><div className="border-y border-[#ead5c1] py-5"><p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-600">{lang === 'id' ? 'Jangan lewatkan' : 'Don’t miss'}</p><h2 className="mt-2 text-2xl font-black tracking-tight">{lang === 'id' ? 'Barangkali Anda terlewat' : 'In case you missed it'}</h2></div><div className="space-y-5">{sidebar.map((article, index) => <article key={article.title} className="group flex gap-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"><img src={article.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /><span className="absolute left-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[9px] font-black text-black">0{index + 1}</span></div><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600">{article.category}</p><h3 className="mt-1 text-sm font-bold leading-5 text-[#241811] transition group-hover:text-orange-700">{article.title}</h3><div className="mt-2 flex items-center gap-2 text-[11px] text-[#735c4d]"><span className="grid h-4 w-4 place-items-center rounded-full bg-orange-100 text-[7px] font-bold text-orange-700">{article.initials}</span>{article.author}</div></div></article>)}</div>
        </aside>
      </div></section>
    </div>
  );
}
