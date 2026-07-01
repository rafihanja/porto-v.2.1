# Project Memory — Portfolio Rafih

> File ini ditulis otomatis oleh AI. JANGAN dihapus.
> Fungsinya: biar AI bisa ingat konteks project ini di sesi berikutnya.
> Terakhir diupdate: 2026-07-01T14:15:00+07:00

## Ringkasan Project
- **Apa ini:** Website portofolio pribadi Rafih Anja, seorang Junior Frontend Developer dari Tangerang.
- **Dibuat untuk:** Recruiter, klien potensial, atau siapa saja yang ingin mengenal profil Rafih.
- **Style/nuansa:** Dark, minimalis, premium — terminal/hacker aesthetic dengan animasi smooth GSAP + WebGL.

## Teknologi yang Dipakai
- Frontend: HTML5 + CSS3 + Vanilla JS (tanpa framework)
- Animasi: GSAP 3.12.2 (CDN) + ScrollTrigger, SplitType, Lenis 1.0.29 (smooth scroll)
- WebGL: Three.js r128 (shader background)
- Font: Inter, JetBrains Mono, Syne (Google Fonts)
- Hosting: Vercel (ada `.vercel/project.json`)
- Package manager: tidak ada (pure static)

## Struktur Folder
```
portfolio-rafih/
├── assets/
│   ├── CV_Rafih_Anja.pdf
│   ├── profile.jpg
│   ├── cek_zakat.png
│   ├── ranja_ai.png
│   ├── tasker.png
│   ├── weather.png
│   └── zenith.png
├── index.html        ← halaman utama (satu halaman / SPA)
├── ats-cv.html       ← halaman CV versi ATS (download)
├── main.js           ← semua logic JS (target ~800 baris)
└── style.css         ← semua styling
```

## Keputusan Desain yang Sudah Disepakati
- Single page app (satu file HTML, scroll vertikal + horizontal scroll untuk proyek).
- Bahasa bilingual: ID/EN toggle di navbar, semua teks punya `data-id` dan `data-en`.
- Skill percentages sengaja rendah realistis (52-59%) karena self-assessed junior level.
- WebGL (Three.js) untuk shader background — bukan CSS/SVG biasa.
- Custom micro cursor (dot + ring) pakai pure CSS/JS.
- Preloader dengan counter 0-100% + status teks animasi.
- Script dimuat via CDN (GSAP, Lenis, Three.js, SplitType) — tidak ada npm/node_modules.

## Progress Fase
| Fase | Status | Catatan |
|------|--------|---------|
| 1. Struktur & Layout | ✅ Selesai | HTML lengkap 5 section + footer |
| 2. Styling & Desain | ✅ Selesai | style.css lengkap |
| 3. Animasi & JS | ✅ Selesai | main.js dengan GSAP, Lenis, WebGL |
| 4. Konten & Assets | ✅ Selesai | Foto, CV PDF, screenshot proyek |
| 5. Deploy | ✅ Selesai | Deployed ke Vercel |
| 6. Canvas BG Upgrade | ✅ Selesai | Hybrid WebGL Nebula + 2D Particle Node Network |

## Yang Sudah Jadi (Detail)
- **Section Hero:** Heading split animation, terminal UI simulasi typewriter, scroll indicator
- **Section About:** Foto profil, bio, skill bars animated, CV download link
- **Section Journey:** Timeline 3 node (SMA → UIN Banten → Frontend Dev)
- **Section Projects (Horizontal Scroll):** 4 kartu proyek (Zenith Matcha, Cek Zakat, YT Shorts Bot, Ranja.AI)
- **Footer:** Email, GitHub, LinkedIn (belum ada URL), Twitter (belum ada URL), copyright
- **Preloader:** Counter + progress bar + status text
- **Custom Cursor:** dot + ring
- **Bilingual toggle:** ID/EN
- **Premium Canvas Background:** Shader noise 3D nebula (WebGL) + partikel magnetis interaktif (Canvas 2D) terintegrasi dengan scroll velocity dan mouse.

## Yang Belum Jadi / Known Issues
- [ ] LinkedIn dan Twitter di footer masih `href="#"` — belum diisi URL asli
- [ ] `weather.png` dan `tasker.png` ada di assets tapi tidak dipakai di section projects (ada 4 proyek, 2 gambar tidak terpakai)
- [ ] Tidak ada `sitemap.xml`, `robots.txt`, atau Open Graph meta tags
- [ ] Tidak ada meta description di `<head>`
- [ ] `ats-cv.html` belum dicek isinya
- [ ] GSAP dimuat via CDN dengan versi terpinned (3.12.2), bukan versi terbaru (3.15.0)
- [ ] Script dimuat dengan `defer` tapi `main.js` bergantung pada GSAP — perlu dicek urutan load

## Environment & Credential
- Tidak ada backend/API/env variable
- Semua asset lokal atau CDN publik

## Catatan untuk Sesi Berikutnya
- Kalau mau tambah proyek baru: tambah `.h-project-card` baru di section `#projects`
- Kalau mau update foto/CV: ganti file di folder `assets/`
- Kalau mau translate teks baru: selalu tambah `data-id="..."` dan `data-en="..."` di elemen
- Hati-hati dengan urutan `defer` script — Three.js, GSAP, Lenis harus ready sebelum `main.js` jalan
- `style.css?v=16` dan `main.js?v=18` — versi ini untuk cache busting, increment kalau ada update
