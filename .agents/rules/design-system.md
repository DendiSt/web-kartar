# Design System Guideline — Atlassian Style Reference

Semua komponen, tata letak, dan pembaruan UI pada proyek ini **WAJIB** mengikuti panduan yang tertera di `DESIGN.md` (Atlassian Style Reference).

---

## 1. Tipografi & Font
* **Display / Headlines / Judul**: Menggunakan font **Manrope** (`--font-heading` / substitute dari Charlie Display).
  * Bobot: 400-500 (atau 700 untuk judul penting), dengan tracking optikal diperketat: `tracking-[-0.012em]`.
* **Body / UI / Label**: Menggunakan font **Inter** (`--font-sans` / substitute dari Charlie Text).
  * Bobot: 400 (regular) dan 500 (medium).

---

## 2. Palet Warna (Atlassian Palette)
* **Atlassian Blue (`#1868db`)**:
  * Warna tunggal untuk seluruh tombol aksi utama (Primary Action Button), link aktif, fokus input, dan aksen penting.
* **Midnight Navy (`#101214`)**:
  * Teks utama (*ink color*), background Dark Hero Banner, dan panel inverted gelap.
* **Pure White (`#ffffff`)**:
  * Kanvas utama halaman dan permukaan kartu (*Card*).
* **Fog White (`#f0f1f2`)**:
  * Background tombol sekunder, permukaan kartu pendukung, dan garis pemisah halus (*hairline border*).
* **Muted Indigo (`#42526e`)**:
  * Teks keterangan tambahan (*helper text*), label kecil, dan metadata sekunder.
* **Taxicab Yellow (`#fca700`)**:
  * **Hanya** digunakan sebagai tombol CTA di dalam banner gelap (*Dark Hero Banner*) untuk kontras tinggi, atau garis aksen flourish.
* **Lavender Wash (`#eed7fc`)**:
  * Digunakan sebagai pembatas antar-seksi editorial (*Lavender Feature Band*) full-bleed.
* **Confetti Decorative Accents**:
  * Violet (`#bf63f3`), Yellow (`#fca700`), Blue (`#1868db`), Green (`#36b37e`).
  * **Aturan penting**: Hanya dipakai sebagai framing/dekorasi tepi di seksi gelap (*Dark Hero/Video*), **TIDAK BOLEH** digunakan sebagai warna isi tombol/kontrol fungsional.

---

## 3. Border Radius & Bentuk (Shapes)
* **Buttons / Tombol**: Bentuk **Pill (`rounded-full` / 28px)**. Sifatnya *flat* tanpa drop shadow berat.
* **Cards / Kartu**: Radius **20px (`rounded-[20px]`)** dengan padding lapang (20-24px).
* **Badges / Tags**: Bentuk **Pill (`rounded-full`)** dengan teks 13px.
* **Images / Foto**: Radius minimal **5px (`rounded-[5px]`)**.
* **Inputs / Form**: Radius **8px (`rounded-[8px]`)**.

---

## 4. Filosofi Bayangan & Elevasi
* Desain mengutamakan estetika **flat & clean**.
* Hindari *drop shadow* tebal berwarna hitam. Jika membutuhkan elevasi, gunakan bayangan berona navy halus:
  `box-shadow: rgba(9, 30, 66, 0.31) 0px 0px 1px 0px, rgba(9, 30, 66, 0.25) 0px 1px 1px 0px;` (tersedia di class `.shadow-atlassian`).
