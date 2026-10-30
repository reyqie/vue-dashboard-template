# Lumina Vue Dashboard

Template dashboard interaktif berbasis Vue 3 dan TypeScript untuk workspace tim. Aplikasi ini berisi halaman ringkasan, analitik, proyek, keuangan, inbox, pengaturan, dan halaman login demo.

## Mulai

Persyaratan: Node.js 18 atau lebih baru dan npm.

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite (default: `http://localhost:5173`).

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run type-check` | Memeriksa tipe TypeScript dan komponen Vue |
| `npm run build` | Memeriksa tipe dan membuat build produksi di `dist/` |
| `npm run preview` | Menyajikan build produksi secara lokal |

## Fitur

- **Overview** — metrik workspace, tren pendapatan, sumber trafik, aktivitas, proyek aktif, dan rentang grafik.
- **Analytics** — metrik sesi/pengguna, grafik, heatmap engagement, serta tabel halaman yang dapat diurutkan.
- **Projects** — filter status, buat proyek, lihat detail, dan tandai proyek selesai.
- **Finance** — cari/filter transaksi, tambahkan transaksi, unduh CSV, serta ringkasan anggaran.
- **Inbox** — cari percakapan, tandai pesan sudah dibaca, dan kirim pesan demo.
- **Settings** — edit profil, pilih tema, preferensi notifikasi, aksesibilitas gerakan, dan kontrol keamanan demo.
- **Navigasi** — sidebar responsif, pencarian halaman dengan `Ctrl+K` atau `⌘K`, notifikasi menuju Inbox, dan dukungan tema Sakura, Space, serta Ocean.

Perubahan proyek, transaksi, percakapan, profil, foto profil, tema, preferensi, dan sidebar disimpan di `localStorage` browser. Jumlah pesan belum dibaca dan daftar proyek di Overview mengikuti data yang sama dengan halaman terkait. Data awal lainnya adalah mock data yang disediakan di `src/data/mock.ts`. Untuk memulai ulang data yang disimpan, hapus key `lumina-projects`, `lumina-transactions`, `lumina-conversations`, `lumina-profile`, `lumina-avatar`, `lumina-theme`, `lumina-preferences`, dan `lumina-sidebar` dari penyimpanan situs di browser.

## Mode demo

Halaman login menerima input yang valid dan menampilkan aplikasi demo; halaman ini **bukan autentikasi sungguhan**. Integrasi Google/SSO, reset kata sandi, perubahan kata sandi, 2FA, sesi, data grafik, dan transaksi finansial tidak terhubung ke backend. Jangan gunakan data sensitif atau menganggap data browser sebagai penyimpanan aman. Hubungkan aplikasi ke API dan layanan autentikasi sebelum dipakai di produksi.

## Struktur

```text
src/
  components/   Komponen layout, UI, dan grafik
  composables/  State bersama, tema, navigasi, dan toast
  data/         Data demo
  router/       Rute aplikasi
  views/        Halaman dashboard
```
