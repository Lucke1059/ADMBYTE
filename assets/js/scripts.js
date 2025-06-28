// 0) Animación de entrada
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');

    // ── FILTRADO: “Todos/Punto/Vet…” ──
    const programFilter = document.getElementById('programFilter');
    if (programFilter) {
        const links = programFilter.querySelectorAll('.nav-link');
        const summaryView = document.getElementById('summaryView');
        const detailedView = document.getElementById('detailedView');
        const cards = document.querySelectorAll('[data-category]');

        const showAll = () => {
            summaryView.style.display = '';
            detailedView.style.display = 'none';
        };
        const showCategory = cat => {
            summaryView.style.display = 'none';
            detailedView.style.display = '';
            cards.forEach(card => {
                const col = card.closest('.col-md-6') || card.closest('.col');
                col.style.display = (card.dataset.category === cat ? '' : 'none');
            });
        };

        // inicio en “Todos”
        showAll();

        links.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const filter = link.dataset.filter;
                filter === 'all' ? showAll() : showCategory(filter);
            });
        });
    }

    // ── Carga dinámicamente Header y Footer ──
    const load = (url, sel) =>
        fetch(url)
            .then(res => res.text())
            .then(html => document.querySelector(sel).innerHTML = html);

    Promise.all([
        load('/includes/header.html', '#header-placeholder'),
        load('/includes/footer.html', '#footer-placeholder')
    ]).then(() => {
        // 1) AOS
        AOS.init();

        // 2) Dark/Light Mode + actualizar color de partículas
        const modeToggle = document.getElementById('modeToggle');
        const updateParticleColor = () => {
            if (window.tsParticles && tsParticles.dom().length) {
                const instance = tsParticles.dom()[0];
                const isDark = document.body.classList.contains('dark-mode');
                const color = isDark ? '#ffffff' : '#333333';
                instance.options.particles.color.value = color;
                instance.refresh();
            }
        };

        if (modeToggle) {
            // estado inicial
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
                modeToggle.textContent = 'Modo Claro';
            }
            // actualizar color tras cargar
            updateParticleColor();

            modeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-mode');
                modeToggle.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
                localStorage.setItem('darkMode', isDark);
                updateParticleColor();
            });
        }

        // 3) Partículas en Home (#particles-js)
        if (window.tsParticles && document.getElementById('particles-js')) {
            tsParticles
                .load("particles-js", {
                    fpsLimit: 30,
                    particles: {
                        number: { value: 60 },
                        color: { value: "#ffffff" },    // placeholder
                        shape: { type: "circle" },
                        opacity: { value: 0.3 },
                        size: { value: { min: 1, max: 4 } },
                        move: { enable: true, speed: 1.5 }
                    },
                    interactivity: {
                        events: {
                            onHover: { enable: true, mode: "grab" },
                            onClick: { enable: true, mode: "push" }
                        }
                    }
                })
                .then(() => {
                    // una vez cargadas, ajusta el color según el modo
                    updateParticleColor();
                });
        }

        // 4) Typed.js
        if (window.Typed) {
            new Typed('#typed', {
                strings: [
                    'Soluciones a medida',
                    'Tiendas Online Pro',
                    'Software inteligente',
                    'Sitios Web espectaculares'
                ],
                typeSpeed: 80,
                backSpeed: 40,
                backDelay: 2000,
                loop: true
            });
        }

        // 5) VanillaTilt
        if (window.VanillaTilt) {
            VanillaTilt.init(document.querySelectorAll('.tilt'), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3
            });
        }

        // 6) Smooth-scroll para .scroll-down
        document.querySelectorAll('.scroll-down').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                document.querySelector(el.getAttribute('href'))
                    .scrollIntoView({ behavior: 'smooth' });
            });
        });

        // 7) Counters en Estadísticas
        const counters = document.querySelectorAll('.counter');
        if (counters.length && window.IntersectionObserver) {
            const obs = new IntersectionObserver((entries, o) => {
                entries.forEach(en => {
                    if (en.isIntersecting) {
                        const el = en.target;
                        const target = +el.dataset.target;
                        let c = 0;
                        const step = target / 100;
                        const t = setInterval(() => {
                            c = Math.min(c + step, target);
                            el.textContent = Math.floor(c);
                            if (c >= target) clearInterval(t);
                        }, 20);
                        o.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(c => obs.observe(c));
        }

        // 8) Formulario AJAX (Contacto)
        const form = document.getElementById('contactForm');
        if (form) {
            const msg = document.getElementById('successMessage');
            form.addEventListener('submit', e => {
                e.preventDefault();
                e.stopPropagation();
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    return;
                }
                const data = new FormData(form);
                fetch(form.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: data
                })
                    .then(r => r.json())
                    .then(j => {
                        if (j.success) {
                            form.reset();
                            form.classList.remove('was-validated');
                            form.style.display = 'none';
                            msg.classList.remove('d-none');
                        } else throw new Error();
                    })
                    .catch(() => {
                        alert('Hubo un problema al enviar. Intenta de nuevo más tarde.');
                    });
            });
        }
    });
}); // fin DOMContentLoaded

// 9) Progress-Bar global
window.addEventListener('scroll', () => {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = `${pct}%`;
});

// 10) Partículas en Hero Programas (fallback)
if (window.tsParticles && document.getElementById('particles-programas')) {
    tsParticles.load("particles-programas", {
        fpsLimit: 30,
        background: { color: "transparent" },
        particles: {
            number: { value: 40 },
            color: { value: "#FF7043" },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 1, outMode: "bounce" }
        },
        interactivity: {
            detectsOn: "canvas",
            events: { onHover: { enable: false }, onClick: { enable: false } }
        }
    });
}

// — Inicializar GLightbox —
if (window.GLightbox) {
    GLightbox({ selector: '.glightbox', loop: true, zoomable: true });
}

// — Inicializar Lottie micro-interactions —
if (window.lottie) {
    document.querySelectorAll('.lottie-icon').forEach(el => {
        const anim = lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: `../assets/animations/${el.dataset.animation}`
        });
        const card = el.closest('.program-card');
        card.addEventListener('mouseenter', () => anim.play());
        card.addEventListener('mouseleave', () => anim.stop());
    });
}
