document.addEventListener('DOMContentLoaded', function() {

    // --- LOGIKA LAMA: Smooth scrolling untuk navigasi ---
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- LOGIKA BARU: Animasi Mengetik Simultan ---

    // 1. Pilih semua elemen target: judul, paragraf, dan tautan
    const titleTargets = document.querySelectorAll('.preview-card h3');
    const paragraphTargets = document.querySelectorAll('.preview-card p');
    const linkTargets = document.querySelectorAll('.preview-card .btn-lanjut');
    const animationTrigger = document.querySelector('#materi');

    // 2. Simpan teks asli dan kosongkan elemen agar siap untuk animasi
    const originalTitles = [];
    titleTargets.forEach(target => {
        originalTitles.push(target.innerText);
        target.innerText = '';
    });

    const originalParagraphs = [];
    paragraphTargets.forEach(target => {
        originalParagraphs.push(target.innerText);
        target.innerText = '';
    });

    const originalLinks = [];
    linkTargets.forEach(target => {
        originalLinks.push(target.innerText);
        target.innerText = '';
    });

    // 3. Fungsi untuk membuat efek mengetik (tetap sama, dengan callback)
    const typeWriter = (element, text, speed, callback) => {
        let i = 0;
        if (text) {
            element.classList.add('typing-cursor');
        }

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing-cursor');
                if (callback) {
                    callback();
                }
            }
        }
        type();
    };

    // 4. Gunakan Intersection Observer untuk mendeteksi kapan section terlihat
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika section #materi masuk ke layar
            if (entry.isIntersecting) {
                // Jalankan animasi untuk setiap kartu SECARA BERSAMAAN
                titleTargets.forEach((titleElement, index) => {
                    const paragraphElement = paragraphTargets[index];
                    const linkElement = linkTargets[index];
                    
                    // Logika setTimeout yang memberi jeda antar kartu telah DIHAPUS.
                    // Animasi sekarang dimulai untuk semua kartu secara langsung.
                    
                    // Urutan 1: Ketik Judul
                    typeWriter(titleElement, originalTitles[index], 50, () => {
                        // Urutan 2: Ketik Paragraf (setelah judul selesai)
                        typeWriter(paragraphElement, originalParagraphs[index], 30, () => {
                            // Urutan 3: Ketik Tautan "Pelajari lebih lanjut" (setelah paragraf selesai)
                            typeWriter(linkElement, originalLinks[index], 50, null);
                        });
                    });
                });
                
                // Hentikan pengamatan setelah animasi dijalankan sekali
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.4 // Animasi dimulai saat 40% dari section terlihat
    });

    // 5. Mulai amati section #materi
    if (animationTrigger) {
        observer.observe(animationTrigger);
    }
});