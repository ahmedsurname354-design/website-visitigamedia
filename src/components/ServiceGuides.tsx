import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { listPublicPortfolios } from '@/lib/adminApi';
import { getPrerenderData } from '@/lib/prerenderData';
import { featuredPortfolios, portfolioCopy } from '@/lib/portfolio';
import type { Portfolio } from '@/types/admin';

const relatedCategories = ['Indoor Media', 'Outdoor Media', 'Rental LED', 'Audio Visual'];

const guides = [
  {
    title: 'LED indoor',
    use: 'Untuk ruang rapat, kampus, ritel, dan area presentasi dengan penonton relatif dekat.',
    focus: 'Mulai dari jarak pandang dan ukuran bidang, lalu tentukan pixel pitch, sumber konten, jalur listrik, akses servis, serta posisi layar terhadap pencahayaan ruang.',
    workflow: 'Survei ruang, ukur bidang dan titik pandang, pilih konfigurasi, siapkan struktur dan kabel, lalu uji materi visual sebelum serah terima.',
    question: 'Apakah pitch lebih kecil selalu diperlukan?',
    answer: 'Tidak selalu. Pitch perlu dipilih bersama jarak pandang, ukuran layar, jenis konten, dan anggaran. Layar P2.5 di Al-Azhar adalah contoh konfigurasi proyek, bukan patokan untuk semua ruang.',
    project: 'Videotron Indoor Universitas Al-Azhar', slug: 'videotron-indoor-universitas-al-azhar',
  },
  {
    title: 'LED outdoor',
    use: 'Untuk fasad, area publik, sirkuit, dan media luar ruang yang harus tetap relevan dengan kondisi pemasangan setempat.',
    focus: 'Periksa struktur penopang, paparan cuaca, kebutuhan tingkat kecerahan, akses perawatan, sumber listrik, dan perizinan lokasi sebelum memilih modul.',
    workflow: 'Tinjau lokasi dan struktur, tentukan dimensi serta pitch, rencanakan pemasangan, kemudian uji tampilan dari sudut dan jarak pandang yang sebenarnya.',
    question: 'Apakah satu spesifikasi cocok untuk semua titik outdoor?',
    answer: 'Tidak. Dimensi dan pitch perlu mengikuti lokasi. Proyek di Sirkuit Mandalika menggunakan P5 pada bidang 10 x 2 meter; lokasi lain dapat memerlukan konfigurasi berbeda.',
    project: 'Videotron Outdoor Sirkuit Mandalika', slug: 'videotron-outdoor-mandalika',
  },
  {
    title: 'Rental LED',
    use: 'Untuk acara sementara seperti nonton bareng, konferensi, pertunjukan, atau aktivitas promosi.',
    focus: 'Tentukan ukuran panggung atau area tayang, sumber video, durasi acara, titik listrik, jadwal bongkar-pasang, serta penanggung jawab konten di lokasi.',
    workflow: 'Terima rundown dan kebutuhan input, cek venue, susun konfigurasi layar, pasang dan uji sinyal, dampingi acara sesuai lingkup kerja, lalu bongkar perangkat.',
    question: 'Kapan ukuran layar rental ditetapkan?',
    answer: 'Setelah tata letak lokasi dan jarak penonton diketahui. Proyek nobar di Madiun menggunakan layar P3.9 berukuran 6 x 4 meter, tetapi ukuran itu bukan paket baku.',
    project: 'Rental LED Nobar Timnas di Madiun', slug: 'rental-led-nobar-madiun',
  },
  {
    title: 'Audio visual',
    use: 'Untuk ruang rapat dan presentasi yang memerlukan tampilan gambar serta alur suara yang dapat digunakan peserta.',
    focus: 'Petakan posisi duduk, sumber presentasi, posisi layar, mikrofon, distribusi suara, dan cara operator mengendalikan perangkat.',
    workflow: 'Tentukan skenario penggunaan, cek akustik dan tata ruang, gambar jalur perangkat, pasang komponen, lalu uji tampilan dan suara dari posisi pengguna.',
    question: 'Apa yang perlu disiapkan sebelum survei ruang rapat?',
    answer: 'Denah atau ukuran ruang, jumlah dan posisi peserta, sumber presentasi, serta kebutuhan rapat hybrid bila ada. Spesifikasi diputuskan setelah alur penggunaan jelas.',
    project: 'Meeting Room Sarinah', slug: 'meeting-room-sarinah',
  },
];

const englishGuides = [
  {
    title: 'Indoor LED',
    use: 'For meeting rooms, campuses, retail spaces, and presentation areas where viewers are relatively close to the screen.',
    focus: 'Start with viewing distance and display size, then assess pixel pitch, content sources, power routing, service access, and the room lighting around the screen.',
    workflow: 'Survey the room, measure the display area and viewing positions, select the configuration, prepare the structure and cabling, then test the visual content before handover.',
    question: 'Is a smaller pixel pitch always necessary?',
    answer: 'No. Pitch should be considered together with viewing distance, screen size, content, and budget. The P2.5 display at Al-Azhar is one project configuration, not a rule for every room.',
    project: 'Al-Azhar Indonesia indoor videotron',
  },
  {
    title: 'Outdoor LED',
    use: 'For building facades, public spaces, circuits, and other outdoor placements that must suit the conditions of each site.',
    focus: 'Check the supporting structure, weather exposure, brightness requirements, maintenance access, power supply, and site permissions before selecting modules.',
    workflow: 'Review the location and structure, decide the size and pitch, plan installation, then test the display from the actual viewing angles and distances.',
    question: 'Does one specification fit every outdoor location?',
    answer: 'No. Size and pitch depend on the site. The Mandalika Circuit project uses P5 across a 10 x 2 metre area; another location may need a different configuration.',
    project: 'Mandalika Circuit outdoor videotron',
  },
  {
    title: 'LED rental',
    use: 'For temporary events such as public screenings, conferences, performances, and promotions.',
    focus: 'Confirm the stage or viewing area, video source, event duration, power points, installation schedule, and who will manage content on site.',
    workflow: 'Review the event schedule and inputs, inspect the venue, configure the screen, install and test the signal, support the event within the agreed scope, then dismantle the equipment.',
    question: 'When is the rental screen size decided?',
    answer: 'After the venue layout and viewing distance are known. The Madiun screening used a 6 x 4 metre P3.9 screen, but that size is not a fixed package.',
    project: 'Madiun public screening LED rental',
  },
  {
    title: 'Audiovisual',
    use: 'For meeting and presentation rooms where participants need both visual content and a workable audio setup.',
    focus: 'Map seating positions, presentation sources, screen placement, microphones, sound distribution, and how an operator will control the equipment.',
    workflow: 'Define use scenarios, review room acoustics and layout, plan equipment routes, install components, then test picture and sound from the users\' positions.',
    question: 'What should be ready before a meeting-room survey?',
    answer: 'A floor plan or room dimensions, the number and positions of participants, presentation sources, and any hybrid-meeting requirements. Specifications follow the actual use case.',
    project: 'Sarinah meeting room',
  },
];

export default function ServiceGuides() {
  const { lang } = useTranslation();
  const english = lang === 'en';
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => getPrerenderData()?.portfolios ?? []);
  useEffect(() => { void listPublicPortfolios().then(setPortfolios).catch(() => undefined); }, []);
  const featured = featuredPortfolios(portfolios);
  return <section className="bg-white py-20 text-neutral-900" aria-labelledby="service-guides-title">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <p className="text-sm font-semibold uppercase text-orange-600">{english ? 'Service guide' : 'Panduan layanan'}</p>
      <h2 id="service-guides-title" className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">{english ? 'Plan the display around the space and how it will be used.' : 'Rencanakan media sesuai ruang dan cara pakainya.'}</h2>
      <div className="mt-12 divide-y divide-neutral-200 border-t border-neutral-200">
        {guides.map((item, index) => {
          const guide = english ? { ...item, ...englishGuides[index] } : item;
          const related = featured.find((project) => project.slug === item.slug)
            ?? featured.find((project) => project.category === relatedCategories[index]);
          return <article key={item.slug} className="grid gap-6 py-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <div><span className="text-sm font-semibold text-orange-600">0{index + 1}</span><h3 className="mt-2 text-2xl font-semibold">{guide.title}</h3></div>
          <div className="grid gap-7 md:grid-cols-2">
            <div><h4 className="text-sm font-semibold uppercase text-neutral-500">{english ? 'Use cases' : 'Penggunaan'}</h4><p className="mt-2 leading-7">{guide.use}</p></div>
            <div><h4 className="text-sm font-semibold uppercase text-neutral-500">{english ? 'What to confirm' : 'Yang perlu dipastikan'}</h4><p className="mt-2 leading-7">{guide.focus}</p></div>
            <div><h4 className="text-sm font-semibold uppercase text-neutral-500">{english ? 'Workflow' : 'Alur kerja'}</h4><p className="mt-2 leading-7">{guide.workflow}</p></div>
            <div><h4 className="text-sm font-semibold uppercase text-neutral-500">{guide.question}</h4><p className="mt-2 leading-7">{guide.answer}</p></div>
            {related && <Link to={`/portfolio/${related.slug}/`} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 md:col-span-2">{portfolioCopy(related, lang).title}<ArrowUpRight className="size-4" /></Link>}
          </div>
        </article>;})}
      </div>
    </div>
  </section>;
}
