import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ProjectDetail, { type ProjectDetailData } from '@/components/ProjectDetail';
import { useTranslation } from '@/i18n';
import { listPublicPortfolios } from '@/lib/adminApi';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import type { Portfolio } from '@/types/admin';

const categories = ['Lihat semua', 'Audio Visual', 'Media Konvensional', 'Media Dalam Ruang', 'Media Luar Ruang', 'Sewa LED'];

type ProjectDetailCopy = {
  subtitle: string;
  overview?: string;
  challenge?: string;
  solution?: string;
};

const projects = [
  {
    img: '/portfolio/indoor-1.jpg',
    title: 'Mall Pesona Square',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-2.jpg',
    title: 'Matahari Mall',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-3.jpg',
    title: 'Pascal 23',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-4.jpg',
    title: 'Event Dynamix',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-5.jpg',
    title: 'Bank BPD DIY',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-6.jpg',
    title: 'Bandara Soekarno Hatta Terminal 2',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-7.jpg',
    title: 'Gedung DPR MPR',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-8.jpg',
    title: 'Bank BPD DIY',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-9.jpg',
    title: 'Plaza Indonesia',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-10.jpg',
    title: 'LED VIDEOTRON P2.5 AL-Azhar',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-11.jpg',
    title: 'LED Videotron Indoor 2.5 Jambore',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-12.jpg',
    title: 'LED Videotron Indoor 2.5 Gedung Graha Dirgantara',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-1.jpg',
    title: 'Metro Tanah Abang',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-2.jpg',
    title: 'Main Gate Bandara Halim Perdana Kusuma',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-3.jpg',
    title: 'Menara T Tower',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-4.jpg',
    title: 'Pemerintahan Kabupaten Bojonegoro',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-5.jpg',
    title: 'Totem Minitron Sampoerna',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-6.jpg',
    title: 'Signature Park Pierre Tendean',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-7.jpg',
    title: 'Bank BPD DIY Senopati',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-8.jpg',
    title: 'Simpang Lima Semarang',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-9.jpg',
    title: 'RS EMC Pekayon',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-10.jpg',
    title: 'RS EMC Alam Sutera',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-11.jpg',
    title: 'JPO depan Plaza Lawu Madiun',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-12.jpg',
    title: 'LED Videotron P8 Simpang Lima Semarang',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-13.jpg',
    title: 'LED Videotron P5 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-14.jpg',
    title: 'LED Videotron P6 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-15.jpg',
    title: 'LED Videotron P3.9 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-16.jpg',
    title: 'LED Videotron P3.9 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-17.jpg',
    title: 'LED Videotron P8 Outdoor Sanur Bali',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/rental/rental-1.png',
    title: 'Rental LED Event 1',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-2.jpg',
    title: 'Event Nobar Videotron Madiun',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-3.jpg',
    title: 'Event Ynot Games Vol 2',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-4.jpg',
    title: 'Event Pupuk Kujang',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-5.jpg',
    title: 'Wisuda UGM',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-6.jpg',
    title: 'Indonesia International Motor Show Surabaya',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-7.jpg',
    title: 'MOEHI SMA Muhamadiyah 1 Yogyakarta',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-8.jpg',
    title: 'Event MotoGP Internasional 2025 Sirkuit Mandalika',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-9.jpg',
    title: 'JCI National Convention Padma Hotel',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-10.jpg',
    title: 'Budhi Hartono Sanjaja’s Birthday',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-11.jpg',
    title: 'Marcell & Rere’s Wedding',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-12.jpg',
    title: 'Indonesia Sport Summit 2025 GBK',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/audiovisual/IMG_6406-scaled.jpg',
    title: 'Golo Convention Golomori, Labuan Bajo NTT',
    category: 'Audio Visual',
  },
  {
    img: '/portfolio/audiovisual/IMG_9584-scaled.jpg',
    title: 'Meeting Room Sarinah',
    category: 'Audio Visual',
  },
  {
    img: '/portfolio/conventional/Billboard-Paramount-Petals.jpeg',
    title: 'Paramount Petals',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Display-Booth.jpeg',
    title: 'Display Booth',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Gambar-WhatsApp-2025-04-08-pukul-10.30.44_fca1b51d.jpg',
    title: 'Letter Sign Kuta Mandalika',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Lightbox-Indoor-Railink-Sudirman.jpeg',
    title: 'Stasiun Railink Sudirman',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Lightbox-Outdoor.jpeg',
    title: 'Lightbox Outdoor',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Shopsign-Toko-Taurus-Braga-Bandung.jpeg',
    title: 'Toko Taurus Braga',
    category: 'Conventional Media',
  },
];


/* Ubah teks setiap proyek di blok yang sesuai dengan path gambarnya. */
const projectDetailsByImage: Partial<Record<string, ProjectDetailCopy>> = {
  '/portfolio/indoor-1.jpg': {
    subtitle: 'LED Videotron P3.9 Intdoor berukuran 4m x 6m yang berlokasi di Pesona Square Mall, Depok.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-2.jpg': {
    subtitle: 'LED Videotron P3.9 Indoor berukuran 1m x 3m yang berlokasi di Matahari Dept Store Karawaci.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-3.jpg': {
    subtitle: 'LED Videotron Rental P3.9 Indoor berukuran 1m x 3m yang berlokasi di Paskal 23, Bandung.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-4.jpg': {
    subtitle: 'LED Videotron Rental P3.9 Indoor berukuran 4m x 8m yang berlokasi di Tasikmalaya.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-5.jpg': {
    subtitle: 'LED Videotron P2.5 Indoor berukuran 2.5m x 4.5m yang berlokasi di Bank BPD DIY, Yogyakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-6.jpg': {
    subtitle: 'LED Videotron P3.9 Indoor berukuran 1.5m x 3m yang berlokasi di Bandara Soekarno Hatta Terminal 2.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-7.jpg': {
    subtitle: 'LED Videotron Rental P3.9 Indoor berukuran 4m x 8m yang berlokasi di Gedung MPR DPR, Jakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-8.jpg': {
    subtitle: 'LED Videotron P2.5 Indoor berukuran 2m x 6m yang berlokasi di Bank BPD DIY, Yogyakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-9.jpg': {
    subtitle: 'LCD IQOS Indoor dengan ukuran 49″ yang berlokasi di Plaza Indonesia, Jakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-10.jpg': {
    subtitle: 'LED Videotron Indoor P2.5 berukuran 6m x 3m di Universitas Al-Azhar Indonesia, Jakarta Selatan.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-11.jpg': {
    subtitle: 'instalasi LED Videotron indoor tipe P2.5 ukuran 2 x 3 meter sebanyak 2 unit di kawasan Cibubur Jambore, Jakarta Timur.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/indoor-12.jpg': {
    subtitle: 'instalasi LED Videotron indoor tipe P2.5 ukuran 2 x 3 meter sebanyak 2 unit di Gedung Graha Dirgantara',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-1.jpg': {
    subtitle: 'LED Videotron P10 Outdoor berukuran 8m x 16m yang berlokasi di Metro Tanah Abang, Jakarta Selatan.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-2.jpg': {
    subtitle: 'LED Videotron P10 Outdoor berukuran 4m x 8m yang berlokasi di Main Gate Bandara Halim Perdana Kusuma.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-3.jpg': {
    subtitle: 'LED Videotron Curve P10 Outdoor berukuran 12m x 20m yang berlokasi di T Tower, Jakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-4.jpg': {
    subtitle: 'LED Videotron P10 Outdoor berukuran 4m x 8m yang berlokasi di Pemerintahan Kabupaten Bojonegoro.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-5.jpg': {
    subtitle: 'LED Minitron Totem  P8 Outdoor berukuran 1m x 2m yang berlokasi di jl. sumpah pemuda, Palembang.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-6.jpg': {
    subtitle: 'LED Videotron P10 Outdoor berukuran 11.52m x 5.76m yang berlokasi di Signature park jl. pierre tendean, Semarang.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-7.jpg': {
    subtitle: 'LED Videotron P6 Outdoor berukuran 4m x 5m yang berlokasi di Bank BPD DIY Senopati, Yogyakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-8.jpg': {
    subtitle: 'LED Videotron OL 10 Pro Outdoor berukuran 10m x 5m yang berlokasi di Jl. KH. Ahmad Dahlan Bunderan Simpanglima, Semarang.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-9.jpg': {
    subtitle: 'LED Videotron Outdoor berukuran 3m x 6m yang berlokasi di RS EMc Pekayon, Bekasi.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-10.jpg': {
    subtitle: 'LED Videotron Outdoor berukuran 3m x 6m yang berlokasi di RS EMCAlam Sutera, Tangerang Selatan.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-11.jpg': {
    subtitle: 'LED Videotron P10 Outdoor berukuran 8m x 4m yang berlokasi di JPO depan Plaza Lawu Madiun.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-12.jpg': {
    subtitle: 'LED Videotron P8 berukuran 6m x 12m yang berlokasi di Simpang Lima Semarang',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-13.jpg': {
    subtitle: 'LED Videotron Outdoor P5 berukuran 10m x 2m yang berlokasi di Sirkuit Mandalika, Lombok, NTB.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-14.jpg': {
    subtitle: 'LED Videotron Outdoor P6 berukuran 5m x 3m yang berlokasi di Bazaar Mandalika, Lombok, NTB.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-15.jpg': {
    subtitle: 'LED Videotron Outdoor P3.9 berukuran 6m x 3m yang Stage Bazaar Mandalika, Lombok, NTB.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-16.jpg': {
    subtitle: 'LED Videotron Outdoor P3.9 berukuran 2m x 19m yang berlokasi di sirkuit Mandalika, Lombok, NTB.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/outdoor/outdoor-17.jpg': {
    subtitle: 'LED Videotron Outdoor P8 berukuran 6m x 12m yang berlokasi di Sanur, Bali.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-1.png': {
    subtitle: 'Tulis deskripsi singkat proyek di sini.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-2.jpg': {
    subtitle: 'LED Videotron P3.9 berukuran 6m x 4m digunakan dalam acara nonton bareng (nobar) pertandingan Timnas Indonesia vs Australia di Madiun.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-3.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 4m x 2m di 2 titik ikut memeriahkan pelaksanaan Event Ynot Games Vol2 di Gor C-Tra Bandung.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-4.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 5m x 2.5m yang ikut menemani event Pupuk Kujang Cikampek, Jakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-5.jpg': {
    subtitle: 'LED Videotron Rental P3.9 di Event Wisuda UGM Yogyakarta',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-6.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 14m x 5m yang ikut menemani event Indonesia International Motor Show Surabaya.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-7.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 3m x 2m yang ikut menemani event Chelsea’s Birthday Party Surabaya.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-8.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 6m x 4m yang ikut menemani event MOEHI di SMA Muhamadiyah 1 Yogyakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-9.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 5m x 9m 5 titik dan di podium 1m x 3m yang ikut menemani kemeriahan event MotoGP Internasional Sirkuit Mandalika, Lombok, NTB.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-10.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 6m x 3m center, 2m x 3m kanan kiri yang ikut menemani event JCI National Convention di Padma Hotel, Semarang Jawa Tengah.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-11.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 8m x 3m yang ikut menemani event Budhi Hartono Sanjaja’s Birthday di PO Hotel Semarang, Jawa Tengah.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/rental/rental-12.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 5m x 8m yang ikut menemani event Marcell & Rere’s Wedding di MAC Ballroom Semarang, Jawa Tengah',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/audiovisual/IMG_6406-scaled.jpg': {
    subtitle: 'LED Videotron Rental P3.9 berukuran 3m x 2.5m, dan 3 Digital Signage yang ikut menemani event Indonesia Sport Summit 2025 Indonesia Arena, GBK, Jakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/audiovisual/IMG_9584-scaled.jpg': {
    subtitle: 'Instalasi LED Videotron indoor  P1.8 ukuran 13 x 4 meter, dan Audio System dengan kelengkapan dibawah, di Golo Convention Golomori,Labuan Bajo, Nusa Tenggara Timur.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/conventional/Billboard-Paramount-Petals.jpeg': {
    subtitle: 'Billboard Outdoor berukuran 6m x 12m yang berlokasi di Paramount Petals, Tangerang.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/conventional/Display-Booth.jpeg': {
    subtitle: 'Sebuah display booth untuk produk berukuran 1.5m x 0.6m x 1.5m yang berlokasi di Bekasi.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/conventional/Gambar-WhatsApp-2025-04-08-pukul-10.30.44_fca1b51d.jpg': {
    subtitle: 'Letter Sign berukuran 35m x 3m yang berlokasi di Kuta Mandalika Lombok Tengah.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/conventional/Lightbox-Indoor-Railink-Sudirman.jpeg': {
    subtitle: 'Lightbox Indoor berukuran 1.2m x 2m yang berlokasi di Stasiun Railink Sudirman, Jakarta.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/conventional/Lightbox-Outdoor.jpeg': {
    subtitle: 'Lightbox Outdoor berukuran 1m x 2m yang berlokasi di Surabaya.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
  '/portfolio/conventional/Shopsign-Toko-Taurus-Braga-Bandung.jpeg': {
    subtitle: 'Shopsign Backlite Outdoor berukuran 3.2m x 6m yang berlokasi di Toko Taurus Jl. Braga, Bandung.',
    overview: 'Tulis ringkasan proyek di sini.',
    challenge: 'Tulis tantangan proyek di sini.',
    solution: 'Tulis solusi yang diberikan di sini.',
  },
};

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('Lihat semua');
  // null means Supabase is unavailable; an empty array means the admin has
  // intentionally removed every project, so do not resurrect static content.
  const [remoteProjects, setRemoteProjects] = useState<Portfolio[] | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ img: string; title: string; category: string; client?: string; description?: string; overview?: string; challenge?: string; solution?: string } | null>(null);
  const { ref, isInView } = useScrollReveal();
  const { lang } = useTranslation();

  useEffect(() => { void listPublicPortfolios().then(setRemoteProjects).catch(() => setRemoteProjects([])); }, []);
  const displayedProjects = remoteProjects !== null
    ? remoteProjects.map((project) => ({ img: project.image_url, title: project.title, category: project.category, client: project.client, description: project.description, overview: project.overview, challenge: project.challenge, solution: project.solution }))
    : projects;
  const displayedCategories = remoteProjects !== null
    ? ['Lihat semua', ...Array.from(new Set(displayedProjects.map((project) => project.category)))]
    : categories;

  const handleBackToProjects = () => {
    setSelectedProject(null);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  };

  const filteredProjects = useMemo(
    () => (selectedCategory === 'Lihat semua' ? displayedProjects : displayedProjects.filter((project) => project.category === selectedCategory)),
    [displayedProjects, selectedCategory]
  );

  if (selectedProject) {
    const galleryPool = selectedCategory === 'Lihat semua'
      ? displayedProjects
      : displayedProjects.filter((project) => project.category === selectedCategory);
    const selectedIndex = galleryPool.findIndex((project) => project.img === selectedProject.img);
    const relatedProjects = [
      ...galleryPool.slice(selectedIndex + 1),
      ...galleryPool.slice(0, selectedIndex),
    ].slice(0, 4);
    const customDetailCopy = projectDetailsByImage[selectedProject.img];
    const subtitle = selectedProject.description || customDetailCopy?.subtitle || `Instalasi ${selectedProject.category.toLowerCase()} yang dirancang khusus untuk menciptakan pengalaman visual yang jelas dan berdampak tinggi.`;
    const defaultDetailCopy: ProjectDetailCopy = {
      subtitle,
      overview: lang === 'id' ? 'Proyek ini memadukan teknologi layar, penempatan yang tepat, dan pelaksanaan yang andal untuk menciptakan solusi visual yang mendukung ruang serta tujuan komunikasi klien.' : 'This project brings together display technology, thoughtful placement, and dependable execution to create a visual solution that supports the client’s space and communication goals.',
      challenge: lang === 'id' ? 'Instalasi harus tetap menarik secara visual sekaligus menyatu dengan lokasi, kebutuhan operasional, dan kondisi pandang audiens.' : 'The installation needed to remain visually striking while fitting naturally within the location, operational requirements, and viewing conditions of its audience.',
      solution: lang === 'id' ? 'Kami menghadirkan solusi media LED menyeluruh dengan konfigurasi layar yang tepat dan pendekatan instalasi yang rapi, sehingga menghasilkan tampilan visual yang jelas dan andal.' : 'We delivered an end-to-end LED media solution with the right display configuration and a refined installation approach, resulting in a clear and reliable visual presence.',
    };
    defaultDetailCopy.overview = lang === 'id'
      ? `Proyek ${selectedProject.title} menghadirkan ${subtitle} Instalasi ini dirancang untuk mendukung kebutuhan komunikasi visual di lokasi secara optimal.`
      : `The ${selectedProject.title} project delivers ${subtitle} The installation is designed to support the location's visual communication needs effectively.`;
    const isPlaceholder = (value: string | undefined) => value?.startsWith('Tulis ');
    const detailCopy = {
      subtitle,
      overview: selectedProject.overview || (isPlaceholder(customDetailCopy?.overview) ? defaultDetailCopy.overview! : customDetailCopy?.overview ?? defaultDetailCopy.overview!),
      challenge: selectedProject.challenge || (isPlaceholder(customDetailCopy?.challenge) ? defaultDetailCopy.challenge! : customDetailCopy?.challenge ?? defaultDetailCopy.challenge!),
      solution: selectedProject.solution || (isPlaceholder(customDetailCopy?.solution) ? defaultDetailCopy.solution! : customDetailCopy?.solution ?? defaultDetailCopy.solution!),
    };
    const detail: ProjectDetailData = {
      title: selectedProject.title,
      subtitle: detailCopy.subtitle,
      category: selectedProject.category,
      coverImage: selectedProject.img,
      role: lang === 'id' ? 'Desain & Instalasi' : 'Design & Installation',
      timeline: lang === 'id' ? 'Berdasarkan proyek' : 'Project-based',
      client: selectedProject.client || (lang === 'id' ? 'Klien Rahasia' : 'Confidential Client'),
      techStack: ['LED Display', 'Content System', 'On-site Installation'],
      overview: detailCopy.overview,
      challenge: detailCopy.challenge,
      solution: detailCopy.solution,
      gallery: relatedProjects.map((project) => ({
        src: project.img,
        alt: project.title,
        caption: project.title,
        onClick: () => {
          setSelectedProject(project);
          requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
        },
      })),
    };

    return <ProjectDetail project={detail} onBack={handleBackToProjects} />;
  }

  return (
    <section id="portfolio" className="relative theme-section-alt py-24 md:py-32">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-16"
        >
          <div className="max-w-2xl">
            <p className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              Karya Kami
            </p>
            <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight">
              Proyek <span className="text-orange-500">Unggulan</span>
            </h1>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-12">
          {displayedCategories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredProjects.map((proj, i) => (
            <motion.button
              type="button"
              key={proj.img}
              layout="position"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative block rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff1df]"
              onClick={() => setSelectedProject(proj)}
            >
              <img
                src={optimizedImageUrl(proj.img, 900)}
                onError={({ currentTarget }) => restoreOriginalImage(currentTarget, proj.img)}
                alt={proj.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="portfolio-card__category text-orange-500 text-xs font-semibold tracking-widest uppercase mb-1">
                  {proj.category}
                </p>
                <h3 className="portfolio-card__title text-white font-bold text-xl">
                  {proj.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
