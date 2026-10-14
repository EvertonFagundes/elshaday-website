/**
 * El-Shaday Variedades - JavaScript Interativo e Moderno
 * Controles de status ao vivo, navegação móvel, filtros dinâmicos e WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    initStoreStatus();
    initMobileNav();
    initScrollHeader();
    initStatsCounter();
    initHeroSearch();
    initContactWhatsAppForm();
    initBackToTop();
    initProductInquiryButtons();
});

/* ==========================================================================
   1. STATUS DA LOJA AO VIVO (ABERTO / FECHADO)
   Horário oficial:
   Segunda a Sábado: 08:00 às 19:00
   Domingo: 07:30 às 13:00
   ========================================================================== */
function initStoreStatus() {
    const badge = document.getElementById('store-status-badge');
    const badgeText = document.getElementById('store-status-text');
    if (!badge || !badgeText) return;

    function checkStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 60 + minutes;

        let isOpen = false;
        let nextSchedule = '';

        if (day === 0) {
            // Domingo: 07:30 (450 min) às 13:00 (780 min)
            if (currentTime >= 450 && currentTime < 780) {
                isOpen = true;
                nextSchedule = 'Fecha às 13:00';
            } else {
                isOpen = false;
                nextSchedule = 'Abre Segunda às 08:00';
            }
        } else {
            // Segunda a Sábado: 08:00 (480 min) às 19:00 (1140 min)
            if (currentTime >= 480 && currentTime < 1140) {
                isOpen = true;
                nextSchedule = 'Fecha às 19:00';
            } else {
                isOpen = false;
                if (day === 6 && currentTime >= 1140) {
                    nextSchedule = 'Abre Domingo às 07:30';
                } else {
                    nextSchedule = 'Abre às 08:00';
                }
            }
        }

        if (isOpen) {
            badge.className = 'store-status-badge';
            badgeText.textContent = `Aberto Agora • ${nextSchedule}`;
        } else {
            badge.className = 'store-status-badge closed';
            badgeText.textContent = `Fechado no Momento • ${nextSchedule}`;
        }
    }

    checkStatus();
    setInterval(checkStatus, 60000); // Atualiza a cada 1 minuto
}

/* ==========================================================================
   2. MENU MOBILE RESPONSIVO
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Fechar ao clicar em um link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains('open')) {
            nav.classList.remove('open');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

/* ==========================================================================
   3. HEADER ELEVADO NO SCROLL
   ========================================================================== */
function initScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   4. CONTADOR DE ESTATÍSTICAS ANIMADO
   ========================================================================== */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    const prefix = counter.getAttribute('data-prefix') || '';
                    const suffix = counter.getAttribute('data-suffix') || '';
                    let current = 0;
                    const step = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.innerHTML = `${prefix}${current.toLocaleString('pt-BR')}${suffix}`;
                    }, 35);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) observer.observe(statsBar);
}

/* ==========================================================================
   5. BUSCA RÁPIDA / FILTRO NO HERO
   ========================================================================== */
function initHeroSearch() {
    const searchInput = document.getElementById('hero-search-input');
    const searchBtn = document.getElementById('hero-search-btn');
    if (!searchInput) return;

    function executeSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        const deptSection = document.getElementById('departments');
        if (deptSection) {
            deptSection.scrollIntoView({ behavior: 'smooth' });
        }

        const cards = document.querySelectorAll('.dept-card');
        let matchedAny = false;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = 'flex';
                card.style.transform = 'scale(1.02)';
                card.style.borderColor = '#10b981';
                card.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                matchedAny = true;
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.borderColor = '';
                    card.style.boxShadow = '';
                }, 3000);
            } else {
                card.style.opacity = '0.35';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 3500);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            executeSearch();
        });
    }

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        }
    });
}

/* ==========================================================================
   6. FORMULÁRIO DE CONTATO DIRETO PARA WHATSAPP
   ========================================================================== */
function initContactWhatsAppForm() {
    const form = document.getElementById('whatsapp-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (document.getElementById('form-name')?.value || '').trim();
        const phone = (document.getElementById('form-phone')?.value || '').trim();
        const subject = (document.getElementById('form-subject')?.value || 'Dúvida Geral').trim();
        const message = (document.getElementById('form-message')?.value || '').trim();

        if (!name || !message) {
            alert('Por favor, preencha pelo menos seu nome e a mensagem desejada.');
            return;
        }

        const phoneTarget = '5573991669775';
        const formattedMsg = `Olá, El-Shaday Variedades!\n\nMeu nome é *${name}*.\nTelefone de contato: ${phone || 'Não informado'}\nAssunto: *${subject}*\n\nMensagem:\n${message}\n\n(Enviado pelo site da loja)`;

        const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(formattedMsg)}`;
        window.open(whatsappUrl, '_blank');
        form.reset();
    });
}

/* ==========================================================================
   7. BOTÃO VOLTAR AO TOPO
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   8. CONSULTA DE PRODUTOS ESPECÍFICOS VIA WHATSAPP
   ========================================================================== */
function initProductInquiryButtons() {
    document.querySelectorAll('.btn-ask-item, .btn-dept-whatsapp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = btn.getAttribute('data-product');
            if (productName) {
                e.preventDefault();
                const phoneTarget = '5573991669775';
                const msg = `Olá, El-Shaday Variedades! Vi no site o produto "*${productName}*" e gostaria de saber o preço e disponibilidade em estoque.`;
                const url = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(msg)}`;
                window.open(url, '_blank');
            }
        });
    });
}