/* ============================================ */
/* PUENTE DE DOS TIERRAS - Main JavaScript      */
/* ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. COUNTRY SELECTION SYSTEM
  // ==========================================
  const modal = document.getElementById('country-modal');
  const btnArgentina = document.getElementById('btn-argentina');
  const btnMexico = document.getElementById('btn-mexico');
  const storedCountry = localStorage.getItem('selected-country');

  // If country already stored, apply texts and hide modal
  if (storedCountry) {
    modal.classList.add('hidden');
    document.body.className = 'country-' + storedCountry;
    updateTexts(storedCountry);
  }

  btnArgentina.addEventListener('click', () => selectCountry('argentina'));
  btnMexico.addEventListener('click', () => selectCountry('mexico'));

  function selectCountry(country) {
    localStorage.setItem('selected-country', country);
    document.body.className = 'country-' + country;
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.style.opacity = '';
      modal.style.transition = '';
    }, 300);
    updateTexts(country);
  }

  // ==========================================
  // 2. UPDATE TEXTS BY COUNTRY
  // ==========================================
  function updateTexts(country) {
    const isMX = country === 'mexico';

    // Helper to safely set text
    function setText(id, arText, mxText) {
      const el = document.getElementById(id);
      if (el) el.textContent = isMX ? mxText : arText;
    }

    // Header top bar
    setText('shipping-text',
      'Envíos a todo Argentina',
      'Envíos a todo México'
    );
    setText('installments-text',
      '3 y 6 cuotas sin interés',
      'Meses sin intereses'
    );

    // Hero
    setText('hero-headline',
      'Auténtico mezcal mexicano, en Argentina.',
      'Auténtico mezcal artesanal, directo de Oaxaca.'
    );
    setText('hero-subtitle',
      'Conectamos a productores mexicanos con vos, para que disfrutes un mezcal artesanal, de calidad y a un precio accesible.',
      'Conectamos a productores locales contigo, para que disfrutes un mezcal artesanal, de calidad y a un precio accesible.'
    );

    // Product price
    setText('product-price',
      '$28.900 ARS',
      '$700 MXN'
    );

    // FAQ cards
    const faqArgentina = [
      { q: '¿Qué es?', a: 'Un mezcal importado de alta calidad producido en México' },
      { q: '¿Cuánto sale?', a: 'Varía según el producto, para este ejemplo $28.900 ARS' },
      { q: '¿Cuándo se paga?', a: 'Al momento de hacer el pedido por la página' },
      { q: '¿Cuándo sucede?', a: 'Luego de realizar el pago del producto' },
      { q: '¿Cómo se paga?', a: 'Con cualquier medio online habilitado' },
      { q: '¿Cómo sucede?', a: 'Se entrega en la dirección del usuario' },
    ];

    const faqMexico = [
      { q: '¿Qué es?', a: 'Un mezcal artesanal producido en el país' },
      { q: '¿Cuánto sale?', a: 'Varía según el producto, para este ejemplo $700 MXN' },
      { q: '¿Cuándo se paga?', a: 'Al momento de poseer el producto físico' },
      { q: '¿Cuándo sucede?', a: 'Luego de realizar el pago del producto' },
      { q: '¿Cómo se paga?', a: 'Con cualquier medio habilitado' },
      { q: '¿Cómo sucede?', a: 'De manera física' },
    ];

    const faqData = isMX ? faqMexico : faqArgentina;
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach((card, i) => {
      if (faqData[i]) {
        const question = card.querySelector('.faq-question');
        const answer = card.querySelector('.faq-answer');
        if (question) question.textContent = faqData[i].q;
        if (answer) answer.textContent = faqData[i].a;
      }
    });

    // Sustainability
    setText('sustainability-text',
      'Desde el proceso de producción hasta el empaque final, buscamos minimizar nuestro impacto ambiental. Cada botella que elegís es un paso hacia un futuro más sustentable.',
      'Desde el proceso de producción hasta el empaque final, buscamos minimizar nuestro impacto ambiental. Cada botella que eliges es un paso hacia un futuro más sustentable.'
    );

    // How to buy
    setText('howtobuy-title',
      'Comprar mezcal en Argentina nunca fue tan fácil',
      'Comprar mezcal artesanal nunca fue tan fácil'
    );
    setText('step1-title', 'Elegí tu mezcal', 'Elige tu mezcal');
    setText('step1-desc',
      'Explorá nuestra selección de mezcales artesanales.',
      'Explora nuestra selección de mezcales artesanales.'
    );
    setText('step2-title', 'Comprá online', 'Compra en línea');
    setText('step2-desc',
      'Proceso 100% seguro y múltiples medios de pago.',
      'Proceso 100% seguro y múltiples métodos de pago.'
    );
    setText('step3-title', 'Te lo enviamos', 'Te lo enviamos');
    setText('step3-desc',
      'Recibilo en la puerta de tu casa en todo el país.',
      'Recíbelo en la puerta de tu casa en todo el país.'
    );

    // Newsletter
    setText('newsletter-heading',
      'Enterate de lanzamientos, promociones y más.',
      'Entérate de lanzamientos, promociones y más.'
    );
    setText('newsletter-subtitle',
      'Suscribite y obtené 10% OFF en tu primera compra.',
      'Suscríbete y obtén 10% OFF en tu primera compra.'
    );
    setText('newsletter-disclaimer',
      'No compartimos tu información. Desuscribite cuando quieras.',
      'No compartimos tu información. Cancela tu suscripción cuando quieras.'
    );

    // Footer contact
    setText('footer-email',
      'info@puentedostierras.com.ar',
      'info@puentedostierras.com.mx'
    );
    setText('footer-phone',
      '+54 11 1234 5678',
      '+52 55 1234 5678'
    );
    setText('footer-location',
      'Buenos Aires, Argentina',
      'Ciudad de México, México'
    );
  }

  // ==========================================
  // 3. MOBILE MENU
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // ==========================================
  // 4. HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================
  // 5. NEWSLETTER FORM
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn = newsletterForm.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = '¡Gracias! ✓';
    btn.style.background = '#3D6B1E';
    input.value = '';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2500);
  });

  // ==========================================
  // 6. SMOOTH SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // 7. SCROLL ANIMATIONS
  // ==========================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation slightly for elements in same section
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

});
