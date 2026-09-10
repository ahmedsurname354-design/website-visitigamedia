import { Mail } from 'lucide-react';
import { useTranslation } from '@/i18n';
import LightReveal from '@/components/LightReveal';

const content = {
  id: {
    eyebrow: 'Privasi', title: 'Kebijakan Privasi', updated: 'Terakhir diperbarui: 10 September 2026', intro: 'Kebijakan ini menjelaskan informasi yang diproses ketika Anda menggunakan website Visitiga atau menghubungi kami melalui formulir yang tersedia.',
    sections: [
      ['Informasi yang kami kumpulkan', 'Ketika Anda mengirim formulir, kami menerima nama, alamat email, nomor WhatsApp bila diberikan, isi pesan, dan informasi teknis yang diperlukan untuk menjaga keamanan pengiriman. Website juga membuat pengenal pengunjung acak di perangkat untuk mencatat kunjungan halaman.'],
      ['Cara informasi digunakan', 'Informasi digunakan untuk menanggapi pertanyaan, menyiapkan konsultasi atau penawaran, mengelola tindak lanjut calon pelanggan, menjaga keamanan formulir, serta memahami penggunaan website secara agregat.'],
      ['Penyimpanan dan penyedia layanan', 'Data website dan formulir diproses melalui penyedia infrastruktur hosting dan basis data yang digunakan Visitiga. Kami menyimpan informasi selama masih diperlukan untuk menindaklanjuti permintaan, menjalankan operasional, dan memenuhi kewajiban yang berlaku.'],
      ['Pilihan dan hak Anda', 'Anda dapat memilih untuk tidak memberikan nomor WhatsApp. Anda juga dapat meminta akses, koreksi, atau penghapusan data yang pernah dikirim dengan menghubungi kami melalui alamat email di bawah.'],
      ['Keamanan dan perubahan kebijakan', 'Kami menggunakan pembatasan akses dan kontrol teknis yang tersedia untuk melindungi data. Kebijakan ini dapat diperbarui ketika layanan atau cara pemrosesan data berubah; tanggal pembaruan akan dicantumkan pada halaman ini.'],
    ],
    contact: 'Pertanyaan mengenai privasi dapat dikirim ke',
  },
  en: {
    eyebrow: 'Privacy', title: 'Privacy Policy', updated: 'Last updated: September 10, 2026', intro: 'This policy explains the information processed when you use the Visitiga website or contact us through an available form.',
    sections: [
      ['Information we collect', 'When you submit a form, we receive your name, email address, WhatsApp number when provided, message, and technical information required to secure the submission. The website also creates a random visitor identifier on your device to record page visits.'],
      ['How information is used', 'Information is used to respond to enquiries, prepare consultations or quotations, manage lead follow-up, protect the form, and understand aggregate website usage.'],
      ['Storage and service providers', 'Website and form data is processed through the hosting and database infrastructure providers used by Visitiga. We retain information while it is needed to follow up requests, operate the business, and meet applicable obligations.'],
      ['Your choices and rights', 'Providing a WhatsApp number is optional. You may request access to, correction of, or deletion of information you submitted by contacting us at the email address below.'],
      ['Security and policy changes', 'We use available access restrictions and technical controls to protect information. This policy may be updated when our services or data practices change; the revision date will be shown on this page.'],
    ],
    contact: 'Privacy questions can be sent to',
  },
};

export default function PrivacyPage() {
  const { lang } = useTranslation();
  const copy = content[lang];
  return (
    <article className="editorial-section min-h-screen pt-32 sm:pt-40">
      <div className="editorial-container max-w-4xl">
        <LightReveal>
          <p className="editorial-eyebrow">{copy.eyebrow}</p>
          <h1 className="editorial-title">{copy.title}</h1>
          <p className="mt-4 text-sm text-[#87796e]">{copy.updated}</p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#6f6258]">{copy.intro}</p>
        </LightReveal>
        <div className="privacy-content mt-12 space-y-10">
          {copy.sections.map(([heading, body], index) => <LightReveal key={heading} delay={Math.min(index * 0.035, 0.14)}><section className="privacy-card"><h2>{heading}</h2><p>{body}</p></section></LightReveal>)}
        </div>
        <LightReveal className="privacy-contact mt-12 rounded-2xl bg-[#f1eae1] p-6 sm:p-8">
          <p className="text-[#6f6258]">{copy.contact}</p>
          <a href="mailto:marcomm@visitiga.com?subject=Privasi%20Website%20Visitiga" className="mt-3 inline-flex items-center gap-2 font-semibold text-orange-700"><Mail aria-hidden="true" className="h-4 w-4" />marcomm@visitiga.com</a>
        </LightReveal>
      </div>
    </article>
  );
}
