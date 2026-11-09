# Rencana Tampilan dan Redaksi Website YPGB

Versi 2, 6 November 2026. Fakta diambil dari [data-ypgb.md](data-ypgb.md). Tanda **[perlu data]** = isi yang belum tersedia.
Rencana ini menjadi dasar skrip seed. Skrip belum ditulis dan belum dijalankan.

## Cara membaca

Setiap halaman ditulis berurutan dari atas ke bawah. Setiap baris berisi:
- **Blok:** nama blok di admin Payload.
- **Pengaturan:** latar (`page` parchment, `white`, `warm`, `brand` umber, `brandDeep`), jumlah kolom, dan anchor.
- **Isi:** teksnya.

Untuk **Rich Text**, jenis isinya disebut satu per satu:
- *Paragraf*, *Heading H2/H3/H4* (H1 tidak tersedia), *Daftar bernomor/berbutir*, dan *Kutipan* (quote bawaan editor).
- Blok sisipan: **Big Quote**, **Image Carousel**, **Button**, dan **Inline CTA**.

Catatan tampilan:
- **Halaman dengan sidebar** (Tentang Kami dan subhalamannya) menampilkan blok dalam mode *contained*: tanpa latar warna, tanpa foto latar, dan tanpa jarak antarbagian. Pengaturan latar di halaman ini diabaikan, jadi ditulis "–".
- **Tombol Accent** sudah dipakai di footer CTA yang tampil di semua halaman. Di dalam halaman, gunakan Primary untuk ajakan utama.

---

## 0. Struktur situs

| URL | Halaman | Status |
| --- | --- | --- |
| `/` | Beranda | ubah |
| `/tentang-kami` | Tentang Kami (visi, misi, tujuan) | ubah; slug lama `about-us` |
| `/tentang-kami/sejarah` | Sejarah | **baru** |
| `/tentang-kami/motto-dan-nilai` | Motto dan Nilai | **baru** |
| `/tentang-kami/unit` | Unit Sekolah | ubah |
| `/tentang-kami/pengurus` | Pengurus | **baru**; blok Pengurus dipindah dari Beranda |
| `/penerimaan` | Penerimaan Peserta Didik Baru | **baru**; disimpan sebagai draf sampai info PPDB tersedia |
| `/karier` | Karier | **baru** |
| `/berita`, `/galeri`, `/jurnal`, `/doa`, `/dokumen`, `/kotak-saran` | tetap | hanya teks hero dan SEO yang diubah |

Subhalaman di bawah Tentang Kami membuat sidebar halaman itu berguna: pengunjung bisa berpindah antara Sejarah, Motto dan Nilai, Unit, dan Pengurus.

---

## 1. Beranda (`/`)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Centered carousel** | latar `warm`; 3 foto yang sudah ada | lihat 1.1 |
| 1 | **Grid List** | `white`, 4 kolom, anchor `sekilas` | lihat 1.2 |
| 2 | **Quote** | `page`, rata tengah, anchor `visi` | lihat 1.3 |
| 3 | **Media + Text** | `page`, foto kiri, anchor `tentang-kami` | lihat 1.4 |
| 4 | **Card Grid**, Standard, Manual | `white`, 3 kolom, anchor `mengapa` | lihat 1.5 |
| 5 | **Card Grid**, Photo cards, Manual | `brand`, 4 kolom, anchor `jenjang` | lihat 1.6 |
| 6 | **News List**, Latest, Grid | `warm`, anchor `berita`, 3 artikel | lihat 1.7 |
| 7 | **Testimonials** | `brandDeep`, anchor `testimoni` | **disembunyikan** sampai ada testimoni asli (lihat 1.8) |

Blok **Pengurus** dipindah ke `/tentang-kami/pengurus`. Orang tua yang baru mengenal YPGB lebih dulu mencari jenjang dan keunggulan daripada susunan pengurus.

### 1.1 Hero

- **Judul:** Tumbuh Bersama – Bercahaya Selamanya
- **Lead:** Sub Cura Pastoris Boni Crescimus. Di bawah tuntunan Gembala yang Baik, kita bertumbuh.
- **Tombol:**

| Label | Gaya | Tujuan |
| --- | --- | --- |
| Kenali Kami | Outline | `/tentang-kami` |
| Penerimaan Siswa Baru | Primary | `/penerimaan`. Sampai halaman itu terbit: "Lihat Unit Sekolah" ke `/tentang-kami/unit` |

*Alternatif:* judul tetap memakai motto Latin, dan slogan ditulis di lead. Saya menyarankan slogan sebagai judul, karena langsung dipahami orang tua. Motto tetap tampil di bawahnya.

### 1.2 Sekilas (Grid List, 4 kolom, tanpa judul bagian)

| Judul | Deskripsi |
| --- | --- |
| Sejak 1932 | Berakar dari Sekolah "San Muk" di tepian Sungai Kapuas. |
| 7 Unit Sekolah | Dari Taman Kanak-Kanak hingga Sekolah Menengah Atas. |
| 2.861 Peserta Didik | Bertumbuh bersama dalam satu keluarga besar. |
| 230 Guru | Mendampingi setiap peserta didik dengan kasih dan keteladanan. |

Catatan tampilan: judul Grid List memakai huruf heading ukuran biasa, belum berupa angka besar. Bila ingin angka yang lebih menonjol, dibutuhkan varian blok baru ("Statistik"). Itu perubahan tingkat komponen dan akan saya usulkan terpisah bila Anda mau.

### 1.3 Visi (Quote)

- **Teks:** Menjadi komunitas pendidikan Katolik–Kapusin yang unggul, inklusif, transformatif, dan berdaya saing global.
- **Deskripsi:** Visi Yayasan Pendidikan Gembala Baik Pontianak

### 1.4 Tentang Kami (Media + Text)

- **Judul bagian:** Tentang Kami
- **Subjudul:** Karya pendidikan Katolik–Kapusin di Pontianak sejak 1932.
- **Konten (Rich Text):**
  - *Paragraf:* Yayasan Pendidikan Gembala Baik Pontianak berakar dari sekolah misi yang dibuka para imam, bruder, dan suster pada tahun 1932 di dekat Pelabuhan Seng Hie. Masyarakat mengenalnya sebagai Sekolah "San Muk", yang berarti Gembala Baik. Kini yayasan menaungi tujuh unit sekolah, dari TK hingga SMA, di Jl. Jenderal Ahmad Yani dan Jl. Pangsuma.
  - *Paragraf:* Yayasan dikelola oleh Ordo Saudara Dina Kapusin Provinsi Pontianak. Dalam semangat Santo Fransiskus dari Assisi, kami mendampingi setiap peserta didik agar bertumbuh dalam iman, ilmu, dan karakter, dengan sederhana, bersaudara, dan peduli terhadap sesama serta alam ciptaan.
- **Tombol (links):**

| Label | Gaya | Tujuan |
| --- | --- | --- |
| Sejarah Kami | Brand deep, ikon panah | `/tentang-kami/sejarah` |
| Motto dan Nilai | Outline | `/tentang-kami/motto-dan-nilai` |

### 1.5 Mengapa Gembala Baik (Card Grid Standard, 6 kartu)

- **Judul bagian:** Mengapa Gembala Baik
- **Subjudul:** Enam alasan keluarga mempercayakan pendidikan putra-putrinya kepada kami.

| Ikon | Judul | Teks | Tautan |
| --- | --- | --- | --- |
| `clock` | Lebih dari 90 tahun berkarya | Sejak Sekolah "San Muk" tahun 1932, Gembala Baik terus melayani pendidikan di Pontianak dari generasi ke generasi. | Sejarah |
| `school` | Satu kompleks, TK hingga SMA | Anak dapat bertumbuh berkesinambungan dari jenjang ke jenjang dalam lingkungan dan nilai yang sama. | Unit Sekolah |
| `award` | Terakreditasi A | Unit-unit kami terakreditasi A. | – |
| `book-open-text` | Program bilingual | SD Plus menerapkan kurikulum Pearson Edexcel, SMP Plus membuka kelas bilingual, dan Gembala Baik merupakan Pearson Edexcel Exam Center. | Unit Sekolah `#program` |
| `heart-handshake` | Berakar pada nilai Katolik–Kapusin | Tujuh nilai utama membentuk pribadi yang berbelarasa, jujur, sederhana, dan melayani. | Motto dan Nilai |
| `users` | Terbuka bagi semua | Sejak lama peserta didik kami berasal dari beragam suku dan agama, tumbuh bersama dalam persaudaraan. | – |

Catatan fakta: akreditasi A baru terverifikasi untuk 5 unit (data Kemendikdasmen). Akreditasi SD Gembala Baik I dan SMP Plus belum dicek, sehingga teksnya ditulis "unit-unit kami", bukan "seluruh unit". Bila ketujuhnya sudah pasti A, teks bisa diubah menjadi "Seluruh unit".

### 1.6 Jenjang Pendidikan (Card Grid Photo, foto yang sudah ada)

- **Judul bagian:** Jenjang Pendidikan
- **Subjudul:** Tujuh unit sekolah dalam satu naungan, mendampingi anak sejak usia dini hingga siap melangkah ke perguruan tinggi dan dunia kerja.

| Kartu | Teks | Tautan |
| --- | --- | --- |
| Taman Kanak-Kanak | Anak belajar melalui bermain, mengenal kasih Tuhan, sesama, dan lingkungan, serta membangun kebiasaan baik sejak dini. | "Lihat Unit", `/tentang-kami/unit#tk` |
| Sekolah Dasar | Fondasi literasi, numerasi, dan karakter, dengan pilihan kelas reguler atau bilingual di SD Gembala Baik I, SD Gembala Baik II, dan SD Plus Gembala Baik. | `#sd` |
| Sekolah Menengah Pertama | Masa peralihan menuju kemandirian. Tersedia kelas reguler di SMP Gembala Baik dan kelas bilingual di SMP Plus Gembala Baik. | `#smp` |
| Sekolah Menengah Atas | Mengasah nalar kritis dan menentukan arah masa depan, dengan kelas reguler dan kelas Plus untuk persiapan perguruan tinggi. | `#sma` |

### 1.7 Berita (News List)

- **Judul bagian:** Kabar dari Sekolah
- **Tombol aksi bagian:** "Lihat Semua" ke `/berita`

### 1.8 Testimoni

- Disembunyikan, karena testimoni "Cukup Baik" bukan testimoni asli.
- Setelah 4–6 testimoni asli terkumpul, blok ditampilkan kembali dengan judul **Kata Mereka tentang Gembala Baik**.
- Komposisi: orang tua, alumni, guru, dan murid.

---

## 2. Tentang Kami (`/tentang-kami`, sidebar aktif)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Centered** | `brand`, Medium, foto latar yang sudah ada | **Judul:** Tentang Kami · **Lead:** Komunitas pendidikan Katolik–Kapusin yang bertumbuh bersama sejak 1932. |
| 1 | **Rich Text**, 1 kolom | – | *Paragraf:* dua paragraf dari 1.4. *Paragraf:* "Kami percaya pendidikan bukan sekadar pengalihan ilmu, melainkan perjumpaan pribadi yang menumbuhkan manusia seutuhnya: hati, akal budi, dan tindakan." |
| 2 | **Quote** | anchor `visi`, rata tengah | Visi (sama dengan 1.3) |
| 3 | **List**, Numbered, 1 kolom | anchor `misi` | **Judul:** Misi · **Intro:** Untuk mewujudkan visi tersebut, yayasan menjalankan misi berikut. · 7 butir misi dari Buku Profil (sudah ada di CMS, dipindah dari Rich Text ke List) |
| 4 | **List**, Numbered, 1 kolom | anchor `tujuan` | **Judul:** Tujuan Umum · **Intro:** Pendidikan di Gembala Baik bertujuan membentuk pribadi yang: · 7 butir tujuan umum |
| 5 | **Grid List**, 2 kolom | anchor `arah-pengembangan` | **Judul:** Arah Pengembangan · **Intro:** Tujuh arah yang kami tempuh untuk mencapai tujuan tersebut. · 7 butir Tujuan Khusus (lihat 2.1) |

Kutipan "Testing" yang ada sekarang dihapus.

### 2.1 Arah Pengembangan (Grid List)

| Judul | Deskripsi |
| --- | --- |
| Iman dan Karakter | Menumbuhkan iman yang hidup, sikap berbelarasa, serta perilaku yang mencerminkan kasih, keadilan, dan penghormatan terhadap martabat manusia. |
| Integritas dan Disiplin | Membentuk pribadi yang jujur, bertanggung jawab, dan disiplin, serta memiliki etika dan komitmen dalam menjalankan tugas. |
| Inklusivitas dan Persaudaraan | Menciptakan lingkungan yang menghargai keberagaman, mendorong kerja sama, dan membangun relasi yang harmonis. |
| Kepedulian Ekologis | Menanamkan tanggung jawab terhadap pelestarian lingkungan sebagai bagian dari pembentukan karakter dan iman. |
| Pembelajaran Holistik | Pembelajaran bermakna yang berpusat pada peserta didik serta mengembangkan pengetahuan, keterampilan, dan sikap. |
| Kepemimpinan dan Partisipasi | Menumbuhkan kepemimpinan yang melayani, partisipasi aktif, dan tanggung jawab sosial. |
| Inovasi dan Adaptasi | Mengembangkan kreativitas, pemanfaatan teknologi secara bijak, dan kesiapan menghadapi tantangan global. |

---

## 3. Sejarah (`/tentang-kami/sejarah`)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Compact** | `brand` | **Judul:** Sejarah · **Lead:** Dari Sekolah "San Muk" di tepian Sungai Kapuas hingga tujuh unit sekolah hari ini. |
| 1 | **Rich Text** | – | lihat 3.1 |
| 2 | **Grid List**, 2 kolom | anchor `garis-waktu` | **Judul:** Garis Waktu · 12 butir (lihat 3.2) |
| 3 | **Rich Text** | – | lihat 3.3 |

### 3.1 Rich Text pembuka

- *Heading H2:* Sekolah "San Muk"
- *Paragraf:* Pada tahun 1932, Prefek Apostolik P. Pacificus Bos, OFM Cap. membeli bangunan milik saudagar Than Seng Hie di dekat Pelabuhan Seng Hie, Pontianak. Di sana P. Elias, OFM Cap. bersama para bruder Kapusin dan suster SFIC membuka sekolah misi bernama Sekolah Dasar "Tjahaja".
- *Paragraf:* Setelah gereja dan Paroki Gembala Baik berdiri di kompleks yang sama, sekolah ini lebih dikenal sebagai Sekolah "San Muk" atau "Siang Mok", sebutan dalam dialek Hakka dan Tio Ciu untuk 善牧, yang berarti Gembala Baik.
- **Big Quote** (sisipan), rata tengah:
  - **Teks:** San Muk, Siang Mok, Gembala Baik.
  - **Deskripsi:** Asal nama sekolah, dari kata Mandarin 善牧

### 3.2 Garis Waktu (Grid List)

| Judul | Deskripsi |
| --- | --- |
| 1932 | Sekolah misi dibuka di dekat Pelabuhan Seng Hie dan dikenal sebagai Sekolah "San Muk". |
| 1942–1945 | Kegiatan belajar terhenti selama masa pendudukan Jepang. |
| 1966 | Sekolah mulai memakai Bahasa Indonesia dan kurikulum nasional. |
| 1971 | Kurikulum nasional diterapkan penuh; TK Gembala Baik mulai diselenggarakan secara formal. |
| 1973 | Yayasan Pendidikan Gembala Baik memulai karyanya pada 17 Agustus 1973. |
| 1975 | Akta Pendirian yayasan ditandatangani; kelas siang dibuka dan menjadi cikal bakal SD Gembala Baik II. |
| 1983 | SMP Gembala Baik berdiri di Jl. Jenderal Ahmad Yani. |
| 1986 | SMA Gembala Baik berdiri. |
| 2007 | SD Plus Gembala Baik dirintis sebagai sekolah dasar bilingual. |
| 2008 | Yayasan diperbarui menjadi Yayasan Pendidikan Gembala Baik Pontianak; SMP membuka kelas bilingual. |
| 2011 | SMA membuka kelas Plus. |
| 2014 | TK dibuka di kompleks Jl. Jenderal Ahmad Yani; SD Gembala Baik II menempati gedung barunya. |

### 3.3 Rich Text penutup

- *Paragraf:* Sejak menjadi sekolah misi yang terbuka, Gembala Baik menerima peserta didik dari beragam suku dan agama. Semangat itu terus dijaga hingga kini.
- *Paragraf (miring):* Sejarah ini disusun dari dokumen dan penuturan lisan yang terbatas. Kami menerima masukan untuk melengkapinya melalui Kotak Saran.
- **Button** (sisipan): "Kirim Masukan", gaya Outline, ke `/kotak-saran`
- **Image Carousel** (opsional): foto-foto lama sekolah **[perlu foto]**

---

## 4. Motto dan Nilai (`/tentang-kami/motto-dan-nilai`)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Compact** | `brand` | **Judul:** Motto dan Nilai · **Lead:** Nilai-nilai yang menuntun cara kami mendidik dan bertumbuh bersama. |
| 1 | **Quote** | anchor `motto`, tengah | **Teks:** Sub Cura Pastoris Boni Crescimus · **Deskripsi:** Di bawah tuntunan Gembala yang Baik, kita bertumbuh. |
| 2 | **Grid List**, 2 kolom | – | **Judul:** Makna Motto · 4 butir (4.1) |
| 3 | **Quote** | anchor `slogan`, tengah | **Teks:** Tumbuh Bersama – Bercahaya Selamanya · **Deskripsi:** Slogan Yayasan Pendidikan Gembala Baik Pontianak |
| 4 | **Rich Text** | – | *Paragraf:* "Tumbuh bersama" berarti tidak ada yang ditinggalkan: peserta didik, guru, dan seluruh warga yayasan bertumbuh sebagai satu komunitas. "Bercahaya selamanya" berarti nilai yang ditanamkan tidak berhenti saat lulus, tetapi terus memancar dalam keluarga, masyarakat, Gereja, dan dunia. |
| 5 | **Grid List**, 2 kolom | anchor `nilai-utama` | **Judul:** Tujuh Nilai Utama · **Intro:** Disusun dari ajaran Gereja Katolik, spiritualitas Kapusin, pembelajaran mendalam, dan Standar Nasional Pendidikan. · 7 butir (4.2) |
| 6 | **Grid List**, 3 kolom | anchor `growth` | **Judul:** Enam Dimensi GROWTH · 6 butir (4.3) |
| 7 | **Media + Text** | foto kiri: logo | **Judul:** Makna Logo · Rich Text *Daftar berbutir* (4.4) |

### 4.1 Makna Motto

| Judul | Deskripsi |
| --- | --- |
| Sub | Kesediaan untuk berada di bawah tuntunan. Pendidikan dijalani dalam kepercayaan kepada Kristus. |
| Cura | Asuhan yang penuh perhatian, tanggung jawab, dan kasih. Pendidikan adalah pelayanan pembentukan pribadi secara utuh. |
| Pastoris Boni | Kristus Sang Gembala yang Baik (Yoh 10:11), teladan kepemimpinan yang melayani, membimbing, dan melindungi. |
| Crescimus | "Kita bertumbuh": seluruh warga yayasan bertumbuh bersama sebagai satu kawanan. |

### 4.2 Tujuh Nilai Utama

| Judul | Deskripsi |
| --- | --- |
| Kasih Setia yang Berbelarasa | Iman yang hidup melalui tindakan kasih yang inklusif, meneladani Kristus Sang Gembala Baik yang melayani tanpa diskriminasi. |
| Integritas Kapusin | Hidup jujur, sederhana, dan bertanggung jawab, seturut teladan Santo Fransiskus dari Assisi. |
| Persaudaraan Inklusif | Komunitas yang menerima, menghargai, dan merangkul keberagaman sebagai saudara. |
| Tanggung Jawab Ekologis | Menjaga kelestarian lingkungan sebagai bagian dari iman dan tanggung jawab bersama. |
| Kepemimpinan Melayani | Kepemimpinan yang memberdayakan dan memberi teladan, bukan menguasai. |
| Pembelajaran Mendalam Holistik | Belajar yang bermakna dan kontekstual, mengembangkan pribadi seutuhnya: tahu, menghayati, melakukan, dan menjadi. |
| Inovasi Adaptif | Berinovasi dan beradaptasi terhadap perubahan zaman dengan tetap berpegang pada nilai Katolik–Kapusin. |

### 4.3 GROWTH

| Judul | Deskripsi |
| --- | --- |
| Guided: Dituntun | Guru menjadi gembala yang menuntun dengan teladan dan kepedulian. |
| Rooted: Berakar | Fondasi iman dan integritas yang kokoh di tengah perubahan zaman. |
| Open: Terbuka | Terbuka terhadap kebenaran, ilmu pengetahuan, dan keberagaman. |
| Whole: Utuh | Pendidikan menyentuh aspek intelektual, emosional, sosial, dan spiritual. |
| Transformative: Berubah | Pembelajaran yang mendorong perubahan nyata, dari diri sendiri bagi masyarakat. |
| Humane: Manusiawi | Seluruh proses pendidikan berakar pada kasih dan martabat manusia. |

### 4.4 Makna Logo (Rich Text, Daftar berbutir)

- Yesus bertongkat gembala: guru sejati yang menjadi pemimpin, teladan, dan penuntun.
- Yesus memikul domba: kasih, perlindungan, dan tanggung jawab guru terhadap murid-muridnya.
- Segel elips: yayasan sebagai komunitas tempat bertumbuh bersama yang dinamis dan kokoh.
- Salib Tau: spiritualitas Kapusin, yaitu sederhana, persaudaraan, damai, dan mengasihi ciptaan.
- Warna cokelat tua: warna tanah dan jubah Santo Fransiskus, lambang kesederhanaan dan kerendahan hati.

---

## 5. Unit Sekolah (`/tentang-kami/unit`)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Compact** | `brand` | **Judul:** Unit Sekolah · **Lead:** Tujuh unit sekolah, satu visi pendidikan. |
| 1 | **Rich Text** | – | *Paragraf:* Yayasan Pendidikan Gembala Baik menaungi tujuh unit sekolah, dari Taman Kanak-Kanak hingga Sekolah Menengah Atas. Enam unit berada di kompleks Persekolahan Gembala Baik, Jl. Jenderal Ahmad Yani, dan SD Gembala Baik I berada di Jl. Pangsuma No. 2. Setiap unit memiliki kekhasannya, namun berjalan dalam visi dan nilai yang sama. |
| 2 | **Unit List**, level TK, 3 kolom | anchor `tk`, judul "Taman Kanak-Kanak" | kartu unit dari koleksi Units |
| 3 | **Unit List**, level SD, 3 kolom | anchor `sd`, judul "Sekolah Dasar" | |
| 4 | **Unit List**, level SMP, 3 kolom | anchor `smp`, judul "Sekolah Menengah Pertama" | |
| 5 | **Unit List**, level SMA, 3 kolom | anchor `sma`, judul "Sekolah Menengah Atas" | |
| 6 | **Grid List**, 2 kolom | anchor `program`, judul "Program Bilingual dan Plus" | lihat 5.1 |
| 7 | **CTA**, Narrow | – | **Judul:** Ingin mengenal unit lebih dekat? · **Teks:** Sekretariat kami siap membantu pada Senin–Jumat, pukul 07.30–14.00 WIB. · **Tombol:** "Hubungi Sekretariat" (Primary, ke WhatsApp sekretariat) |

### 5.1 Program Bilingual dan Plus

| Judul | Deskripsi |
| --- | --- |
| SD Plus Gembala Baik | Sekolah dasar bilingual sejak 2007, memadukan Kurikulum Nasional dengan kurikulum Pearson Edexcel berstandar global. |
| SMP Plus Gembala Baik | Kelas bilingual dengan tambahan English, Mathematics, dan Science dalam bahasa Inggris (UK Curriculum). |
| SMA Gembala Baik Kelas Plus | Kurikulum yang sama dengan kelas reguler, ditambah penguasaan Karya Tulis Ilmiah dan Bahasa Inggris untuk persiapan perguruan tinggi. |
| Pearson Edexcel Exam Center | Gembala Baik merupakan pusat ujian resmi Pearson Edexcel (ID 96051). |

### 5.2 Isi koleksi Units (untuk seed)

Diisi dari [data-ypgb.md §5](data-ypgb.md): alamat, kepala sekolah, akreditasi, telepon, email, dan situs tiap unit.
- **TK:** telepon diisi WhatsApp 0853-4504-5425.
- **SD Gembala Baik I:** NPSN, akreditasi, dan kontak **[perlu data]**.
- **SMP Plus:** memakai data SMP, dengan koordinator Hutanto, S.T.

---

## 6. Pengurus (`/tentang-kami/pengurus`)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Compact** | `brand` | **Judul:** Pengurus Yayasan · **Lead:** Yayasan dikelola oleh Ordo Saudara Dina Kapusin Provinsi Pontianak. |
| 1 | **Pengurus List** | organ Pengurus | **Subjudul:** Para imam dan bruder Kapusin yang mendampingi seluruh unit dalam semangat pelayanan. |
| 2 | **Card Grid**, Standard, sumber koleksi Units | 3 kolom | **Judul:** Kepala Unit Sekolah. Bila kartu unit tidak menampilkan nama kepala sekolah, ganti dengan **Grid List** 7 butir (judul = unit, deskripsi = nama). |

Isi koleksi Pengurus: 7 orang dari [data-ypgb.md §7](data-ypgb.md), dengan masa jabatan **[perlu data]**. Dua entri yang ada sekarang mencantumkan "2018–Sekarang"; apakah masa jabatan itu berlaku untuk semuanya?

---

## 7. Karier (`/karier`)

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Centered** | `brand`, Small, foto latar | **Judul:** Berkarya Bersama Gembala Baik · **Lead:** Kami mengundang pendidik dan tenaga kependidikan yang ingin melayani dengan kasih dan bertumbuh bersama. |
| 1 | **Grid List**, 3 kolom | `page` | **Judul:** Mengapa Berkarya di Sini · 3 butir (7.1) |
| 2 | **News List**, Latest, List | `white`, kategori berita baru **Karier** | **Judul:** Lowongan Tersedia. Bila belum ada lowongan, tampil keterangan kosong (7.2) |
| 3 | **List**, Bulleted, 2 kolom | `page` | **Judul:** Berkas Lamaran · 8 butir dari [data-ypgb.md §8](data-ypgb.md) |
| 4 | **Rich Text** | `page` | *Heading H3:* Cara Melamar · *Paragraf:* Kirimkan berkas lamaran dalam satu berkas PDF ke ypgbpontianak@gmail.com dengan subjek "Lamaran – [Posisi] – [Nama]", atau antarkan langsung ke Kantor Yayasan Pendidikan Gembala Baik pada Senin–Jumat, pukul 07.30–14.00 WIB. · **Button** (sisipan): "Kirim Lamaran", Primary, tautan `mailto:ypgbpontianak@gmail.com` |

### 7.1 Mengapa Berkarya di Sini

| Judul | Deskripsi |
| --- | --- |
| Komunitas yang bersaudara | Berkarya bersama lebih dari 200 guru dalam tujuh unit sekolah yang saling mendukung. |
| Karya yang bermakna | Mendampingi peserta didik bertumbuh dalam iman, ilmu, dan karakter. |
| Tumbuh bersama | Kesempatan mengembangkan diri, termasuk menulis di Jurnal Yayasan. |

### 7.2 Keterangan kosong

Bila blok News List kosong, ada dua pilihan:
- Pakai teks kosong bawaan blok, bila ada.
- Atau tambahkan **Rich Text** dengan *Paragraf:* "Saat ini belum ada lowongan terbuka. Informasi lowongan akan diumumkan di halaman ini dan di Instagram @yp.gembalabaik."

Perlu dicek bagaimana blok News List tampil bila kategorinya kosong.

---

## 8. Penerimaan Peserta Didik Baru (`/penerimaan`, disimpan sebagai draf)

Kerangkanya disiapkan sekarang. Isinya diisi setelah info PPDB tersedia.

| # | Blok | Pengaturan | Isi |
| --- | --- | --- | --- |
| H | **Hero: Split** | `brand`, foto kanan | **Judul:** Penerimaan Peserta Didik Baru · **Lead:** Tahun Ajaran [perlu data]. Kami menyambut keluarga yang ingin bertumbuh bersama Gembala Baik. · **Tombol:** "Hubungi Sekretariat" (Primary, WhatsApp) dan "Lihat Unit Sekolah" (Outline) |
| 1 | **Grid List**, 4 kolom | `white`, anchor `alur` | **Judul:** Alur Pendaftaran · butir **[perlu data]** |
| 2 | **List**, Numbered | `page`, anchor `jadwal` | **Judul:** Jadwal Penting · **[perlu data]** |
| 3 | **Tabs** (TK / SD / SMP / SMA) | `page`, anchor `persyaratan` | **Judul:** Persyaratan · isi tiap tab berupa *Daftar berbutir* **[perlu data]** |
| 4 | **Downloads** | `warm`, kategori berkas baru **PPDB** | **Judul:** Brosur dan Formulir |
| 5 | **Rich Text** | `page`, anchor `tanya-jawab` | **Judul bagian:** Pertanyaan yang Sering Diajukan · tiap pertanyaan berupa *Heading H3* diikuti *Paragraf* jawaban **[perlu data]** |
| 6 | **CTA**, Big, foto latar | – | **Judul:** Ada pertanyaan tentang pendaftaran? · **Teks:** Sekretariat kami siap membantu pada Senin–Jumat, pukul 07.30–14.00 WIB. · **Tombol:** "Hubungi Melalui WhatsApp" (Primary) |

Pertanyaan yang disiapkan untuk bagian tanya-jawab:
- Apakah sekolah menerima peserta didik dari latar belakang agama yang berbeda?
- Apa perbedaan kelas reguler, bilingual, dan Plus?
- Berapa biaya pendidikan dan bagaimana cara pembayarannya?
- Apakah peserta didik Gembala Baik mendapat prioritas melanjutkan ke jenjang berikutnya?

---

## 9. Halaman lain (hanya hero dan SEO)

| Halaman | Hero (tetap Minimal) | Meta description |
| --- | --- | --- |
| Berita | Kabar, kegiatan, prestasi, dan pengumuman dari seluruh unit. | Kabar, kegiatan, prestasi, dan pengumuman dari ketujuh unit Yayasan Pendidikan Gembala Baik Pontianak. |
| Galeri | Dokumentasi kegiatan keluarga besar Gembala Baik. | Dokumentasi kegiatan peserta didik, guru, dan keluarga besar Yayasan Pendidikan Gembala Baik Pontianak. |
| Jurnal | Terbitan jurnal Yayasan Pendidikan Gembala Baik. | Terbitan jurnal Yayasan Pendidikan Gembala Baik Pontianak. |
| Doa | Kumpulan doa di lingkungan Yayasan Pendidikan Gembala Baik. | Kumpulan doa yang digunakan di lingkungan Yayasan Pendidikan Gembala Baik Pontianak. |
| Dokumen | (tetap) | Unduh pengumuman, surat, kalender pendidikan, dan logo resmi Yayasan Pendidikan Gembala Baik Pontianak. |
| Kotak Saran | (tetap) | Sampaikan saran untuk Yayasan Pendidikan Gembala Baik Pontianak. Nama dan kontak boleh dikosongkan. |

Perbaikan di halaman Doa: hapus tanda kutip penutup yang berlebih pada Big Quote Matius 21:22.

**SEO halaman yang diubah atau baru:**

| Halaman | Meta title | Meta description |
| --- | --- | --- |
| Beranda | Yayasan Pendidikan Gembala Baik Pontianak | Pendidikan Katolik–Kapusin sejak 1932. Tujuh unit sekolah dari TK hingga SMA di Pontianak, terakreditasi A, dengan program bilingual. |
| Tentang Kami | Tentang Kami | Visi, misi, dan tujuan Yayasan Pendidikan Gembala Baik Pontianak, komunitas pendidikan Katolik–Kapusin. |
| Sejarah | Sejarah | Perjalanan Gembala Baik dari Sekolah "San Muk" tahun 1932 hingga tujuh unit sekolah hari ini. |
| Motto dan Nilai | Motto dan Nilai | Sub Cura Pastoris Boni Crescimus: motto, slogan, tujuh nilai utama, dan makna logo YPGB Pontianak. |
| Unit Sekolah | Unit Sekolah | TK, SD, SMP, dan SMA Gembala Baik di Pontianak, termasuk program bilingual dan kelas Plus. |
| Pengurus | Pengurus Yayasan | Pengurus Yayasan Pendidikan Gembala Baik Pontianak dan kepala unit sekolah. |
| Karier | Karier | Lowongan dan cara melamar sebagai pendidik atau tenaga kependidikan di Yayasan Pendidikan Gembala Baik Pontianak. |

---

## 10. Global

### 10.1 Site Settings

| Field | Isi |
| --- | --- |
| Profile › Description | Pendidikan Katolik–Kapusin sejak 1932. Tujuh unit sekolah dari TK hingga SMA di Pontianak. |
| Profile › Founded year | 1973 |
| Contact › Address | kode pos diubah menjadi 78124 |

Field lain tetap.

### 10.2 Navigation, header

- **Tombol header:** "Penerimaan Siswa Baru" (Primary), aktif setelah `/penerimaan` terbit.
- **Item navbar (maksimal 5):** Tentang Kami · Unit Sekolah · Berita · Galeri · Karier
- **Panel menu:**
  - Tentang Kami, dengan submenu Sejarah, Motto dan Nilai, Unit Sekolah, Pengurus
  - Berita
  - Galeri
  - Jurnal
  - Doa
  - Karier
- **Tautan sekunder:**
  - Cek SPP (spp.ypgb.or.id, label sebelumnya "Inquiry SPP")
  - Dokumen
  - Kotak Saran

### 10.3 Navigation, footer

**CTA band** (blok CTA Big, foto latar yang sudah ada):
- **Judul:** Bergabung Bersama Kami
- **Teks:** Mari tumbuh bersama keluarga besar Gembala Baik, sebagai peserta didik maupun sebagai pendidik dan tenaga kependidikan.
- **Tombol:**

| Label | Gaya | Tujuan |
| --- | --- | --- |
| Penerimaan Siswa Baru | Accent | `/penerimaan` |
| Karier di YPGB | Parchment | `/karier` |

Sampai `/penerimaan` terbit, tombol pertama diarahkan ke Unit Sekolah.

**Grup tautan footer:**

| Grup | Tautan |
| --- | --- |
| Yayasan | Tentang Kami, Sejarah, Motto dan Nilai, Pengurus, Karier |
| Pendidikan | Unit Sekolah, Penerimaan Siswa Baru, Cek SPP, Dokumen |
| Kehidupan Sekolah | Berita, Galeri, Jurnal, Doa, Kotak Saran |

---

## 11. Rencana skrip seed (belum ditulis)

- **Satu skrip:** `scripts/seed-site.ts`. Aman dijalankan ulang, karena setiap dokumen dicocokkan lewat slug atau judul.
- **Urutan pembuatan:**
  1. Kategori (berita Karier, berkas PPDB)
  2. Units
  3. Pengurus
  4. Halaman induk, lalu subhalaman
  5. Site Settings
  6. Navigation
- **Halaman disimpan sebagai draf.** Anda memeriksa dan mem-publish-nya dari admin.
- **Foto:** di lokal, skrip memakai foto yang sudah ada. Untuk produksi, foto perlu diunggah lebih dulu atau disertakan di folder seed. Ini diputuskan saat persiapan produksi.
