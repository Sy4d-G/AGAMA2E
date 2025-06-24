document.addEventListener('DOMContentLoaded', function() {

    // --- Logika untuk Navigasi Mobile (Hamburger Menu) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            burger.classList.toggle('toggle');
        });
    }

    // --- Logika Smooth Scrolling ---
    const allNavLinks = document.querySelectorAll('nav a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('#')) {
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    if(nav && nav.classList.contains('nav-active')){
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                        navLinks.forEach(link => link.style.animation = '');
                    }
                }
            }
        });
    });

    // --- Logika Animasi Mengetik ---
    const animationTrigger = document.querySelector('#materi');

    if(animationTrigger){
        const titleTargets = document.querySelectorAll('.preview-card h3');
        const paragraphTargets = document.querySelectorAll('.preview-card p');
        const linkBtnTargets = document.querySelectorAll('.preview-card .btn-lanjut');

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
        linkBtnTargets.forEach(target => {
            originalLinks.push(target.innerText);
            target.innerText = '';
        });

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

        const observerOptions = {
            /* PERUBAHAN UTAMA DI SINI:
            Opsi pemicu diubah agar lebih andal di semua perangkat.
            rootMargin: '0px 0px -100px 0px' -> Artinya, anggap layar 100px lebih pendek. Animasi akan terpicu saat elemen berada 100px dari bawah layar.
            threshold: 0 -> Artinya, animasi akan terpicu begitu 1 piksel pertama dari elemen masuk ke area pemicu.
            */
            rootMargin: '0px 0px -100px 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    titleTargets.forEach((titleElement, index) => {
                        typeWriter(titleElement, originalTitles[index], 50, () => {
                            typeWriter(paragraphTargets[index], originalParagraphs[index], 30, () => {
                                typeWriter(linkBtnTargets[index], originalLinks[index], 50, null);
                            });
                        });
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions); // Menggunakan opsi yang sudah diperbaiki

        observer.observe(animationTrigger);
    }
});