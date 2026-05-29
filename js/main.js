/* ============================================ */
/* PUENTE DE DOS TIERRAS - Main JavaScript      */
/* ============================================ */

// ==========================================
// PRODUCT CATALOG
// ==========================================
const PRODUCTS = [
  { id: 'clasico-premium', name: 'Clásico Premium', category: 'Premium', priceAr: 45100, priceMx: 32, alc: '44%', vol: '750ml', image: 'img/clasico-premium.png' },
  { id: 'artesanal-rustico', name: 'Artesanal Rústico', category: 'Artesanal', priceAr: 42300, priceMx: 30, alc: '42%', vol: '750ml', image: 'img/artesanal-rustico.png' },
  { id: 'moderno-black', name: 'Moderno Black', category: 'Premium', priceAr: 56400, priceMx: 40, alc: '46%', vol: '750ml', image: 'img/moderno-black.png' },
  { id: 'international-export', name: 'International Export', category: 'Premium', priceAr: 62000, priceMx: 44, alc: '48%', vol: '750ml', image: 'img/international-export.png' },
];

// ==========================================
// CART MODULE
// ==========================================
const Cart = {
  KEY: 'puente-cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
  },

  addItem(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const items = this.getItems();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id: product.id, qty: 1 });
    }
    this.saveItems(items);
    this.updateBadge();
    return product;
  },

  removeItem(productId) {
    let items = this.getItems().filter(i => i.id !== productId);
    this.saveItems(items);
    this.updateBadge();
  },

  updateQty(productId, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.saveItems(items);
      this.updateBadge();
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  getTotalItems() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  getTotal(country) {
    const isMX = country === 'mexico';
    return this.getItems().reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return sum;
      const price = isMX ? product.priceMx : product.priceAr;
      return sum + (price * item.qty);
    }, 0);
  },

  updateBadge() {
    document.querySelectorAll('.cart-count').forEach(badge => {
      const total = this.getTotalItems();
      badge.textContent = total;
      badge.style.display = total > 0 ? 'flex' : 'none';
    });
  }
};

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================================
// FORMAT PRICE
// ==========================================
function formatPrice(amount, country) {
  const isMX = country === 'mexico';
  if (isMX) {
    return 'USD $' + amount.toLocaleString('en-US');
  }
  return '$' + amount.toLocaleString('es-AR') + ' ARS';
}

function getCountry() {
  return localStorage.getItem('selected-country') || 'argentina';
}

// ==========================================
// MAIN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. COUNTRY SELECTION
  // ==========================================
  const modal = document.getElementById('country-modal');
  const btnArgentina = document.getElementById('btn-argentina');
  const btnMexico = document.getElementById('btn-mexico');
  const storedCountry = localStorage.getItem('selected-country');

  if (storedCountry) {
    modal.classList.add('hidden');
    document.body.classList.add('country-' + storedCountry);
    updateTexts(storedCountry);
    updateCatalogPrices(storedCountry);
  }

  btnArgentina.addEventListener('click', () => selectCountry('argentina'));
  btnMexico.addEventListener('click', () => selectCountry('mexico'));

  function selectCountry(country) {
    localStorage.setItem('selected-country', country);
    document.body.classList.remove('country-argentina', 'country-mexico');
    document.body.classList.add('country-' + country);
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.style.opacity = '';
      modal.style.transition = '';
    }, 300);
    updateTexts(country);
    updateCatalogPrices(country);
    renderCartPage();
  }

  // ==========================================
  // 2. UPDATE TEXTS BY COUNTRY
  // ==========================================
  function updateTexts(country) {
    const isMX = country === 'mexico';

    function setText(id, arText, mxText) {
      const el = document.getElementById(id);
      if (el) el.textContent = isMX ? mxText : arText;
    }

    setText('shipping-text', 'Envíos a todo Argentina', 'Envíos a todo México');
    setText('installments-text', '3 y 6 cuotas sin interés', 'Meses sin intereses');
    setText('hero-headline', 'Auténtico mezcal mexicano, en Argentina.', 'Auténtico mezcal artesanal, directo de Oaxaca.');
    setText('hero-subtitle',
      'Conectamos a productores mexicanos con vos, para que disfrutes un mezcal artesanal, de calidad y a un precio accesible.',
      'Conectamos a productores locales contigo, para que disfrutes un mezcal artesanal, de calidad y a un precio accesible.'
    );
    setText('product-price', '$45.100 ARS', 'USD $32');

    // FAQ
    const faqAR = [
      { q: '¿Qué es?', a: 'Un mezcal importado de alta calidad producido en México' },
      { q: '¿Cuánto sale?', a: 'Varía según el producto, para este ejemplo $45.100 ARS' },
      { q: '¿Cuándo se paga?', a: 'Al momento de hacer el pedido por la página' },
      { q: '¿Cuándo sucede?', a: 'Luego de realizar el pago del producto' },
      { q: '¿Cómo se paga?', a: 'Con cualquier medio online habilitado' },
      { q: '¿Cómo sucede?', a: 'Se entrega en la dirección del usuario' },
    ];
    const faqMX = [
      { q: '¿Qué es?', a: 'Un mezcal artesanal producido en el país' },
      { q: '¿Cuánto sale?', a: 'Varía según el producto, para este ejemplo USD $32' },
      { q: '¿Cuándo se paga?', a: 'Al momento de poseer el producto físico' },
      { q: '¿Cuándo sucede?', a: 'Luego de realizar el pago del producto' },
      { q: '¿Cómo se paga?', a: 'Con cualquier medio habilitado' },
      { q: '¿Cómo sucede?', a: 'De manera física' },
    ];
    const faqData = isMX ? faqMX : faqAR;
    document.querySelectorAll('.faq-card').forEach((card, i) => {
      if (faqData[i]) {
        const q = card.querySelector('.faq-question');
        const a = card.querySelector('.faq-answer');
        if (q) q.textContent = faqData[i].q;
        if (a) a.textContent = faqData[i].a;
      }
    });

    setText('sustainability-text',
      'Desde el proceso de producción hasta el empaque final, buscamos minimizar nuestro impacto ambiental. Cada botella que elegís es un paso hacia un futuro más sustentable.',
      'Desde el proceso de producción hasta el empaque final, buscamos minimizar nuestro impacto ambiental. Cada botella que eliges es un paso hacia un futuro más sustentable.'
    );
    setText('howtobuy-title', 'Comprar mezcal en Argentina nunca fue tan fácil', 'Comprar mezcal artesanal nunca fue tan fácil');
    setText('step1-title', 'Elegí tu mezcal', 'Elige tu mezcal');
    setText('step1-desc', 'Explorá nuestra selección de mezcales artesanales.', 'Explora nuestra selección de mezcales artesanales.');
    setText('step2-title', 'Comprá online', 'Compra en línea');
    setText('step2-desc', 'Proceso 100% seguro y múltiples medios de pago.', 'Proceso 100% seguro y múltiples métodos de pago.');
    setText('step3-title', 'Te lo enviamos', 'Te lo enviamos');
    setText('step3-desc', 'Recibilo en la puerta de tu casa en todo el país.', 'Recíbelo en la puerta de tu casa en todo el país.');
    setText('newsletter-heading', 'Enterate de lanzamientos, promociones y más.', 'Entérate de lanzamientos, promociones y más.');
    setText('newsletter-subtitle', 'Suscribite y obtené 10% OFF en tu primera compra.', 'Suscríbete y obtén 10% OFF en tu primera compra.');
    setText('newsletter-disclaimer', 'No compartimos tu información. Desuscribite cuando quieras.', 'No compartimos tu información. Cancela tu suscripción cuando quieras.');
    setText('footer-email', 'info@puentedostierras.com.ar', 'info@puentedostierras.com.mx');
    setText('footer-phone', '+54 11 1234 5678', '+52 55 1234 5678');
    setText('footer-location', 'Buenos Aires, Argentina', 'Ciudad de México, México');
  }

  // ==========================================
  // 2b. UPDATE CATALOG PRICES
  // ==========================================
  function updateCatalogPrices(country) {
    const isMX = country === 'mexico';
    document.querySelectorAll('.catalog-card-price').forEach(el => {
      const arPrice = el.dataset.priceAr;
      const mxPrice = el.dataset.priceMx;
      if (arPrice && mxPrice) el.textContent = isMX ? mxPrice : arPrice;
    });
  }

  // ==========================================
  // 3. MOBILE MENU
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 4. HEADER SCROLL
  // ==========================================
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ==========================================
  // 5. NEWSLETTER
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = '¡Gracias! ✓';
      btn.style.background = 'var(--primary-light)';
      input.value = '';
      setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 2500);
    });
  }

  // ==========================================
  // 6. SMOOTH SCROLL
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target && header) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
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
        setTimeout(() => entry.target.classList.add('animate-in'), index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // ==========================================
  // 8. CATALOG FILTERS
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catalogCards = document.querySelectorAll('.catalog-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        catalogCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden-card');
            card.style.animation = 'slideUp 0.4s ease forwards';
          } else {
            card.classList.add('hidden-card');
          }
        });
      });
    });
  }

  // ==========================================
  // 9. ADD TO CART BUTTONS
  // ==========================================
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.addToCart;
      const product = Cart.addItem(productId);
      if (product) {
        showToast(`${product.name} agregado al carrito`);
        // Animate button
        btn.textContent = '✓ Agregado';
        btn.classList.add('btn-added');
        setTimeout(() => {
          btn.textContent = 'Agregar';
          btn.classList.remove('btn-added');
        }, 1500);
      }
    });
  });

  // ==========================================
  // 10. CART PAGE
  // ==========================================
  function renderCartPage() {
    const cartEmpty = document.getElementById('cart-empty');
    const cartFilled = document.getElementById('cart-filled');
    const cartList = document.getElementById('cart-items-list');

    if (!cartEmpty || !cartFilled || !cartList) return; // Not on cart page

    const items = Cart.getItems();
    const country = getCountry();
    const isMX = country === 'mexico';

    if (items.length === 0) {
      cartEmpty.style.display = 'flex';
      cartFilled.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartFilled.style.display = 'grid';

    // Render items
    cartList.innerHTML = items.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';
      const unitPrice = isMX ? product.priceMx : product.priceAr;
      const subtotal = unitPrice * item.qty;

      return `
        <div class="cart-item" data-item-id="${item.id}">
          <div class="cart-item-product">
            <div class="cart-item-image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
              <h4>${product.name}</h4>
              <span class="cart-item-category">${product.category} · ${product.alc}</span>
            </div>
          </div>
          <div class="cart-item-price">${formatPrice(unitPrice, country)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-qty-action="minus" data-qty-id="${item.id}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-qty-action="plus" data-qty-id="${item.id}">+</button>
          </div>
          <div class="cart-item-subtotal">${formatPrice(subtotal, country)}</div>
          <button class="cart-item-remove" data-remove-id="${item.id}" title="Eliminar">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      `;
    }).join('');

    // Update totals
    const total = Cart.getTotal(country);
    document.getElementById('cart-subtotal').textContent = formatPrice(total, country);
    document.getElementById('cart-total').textContent = formatPrice(total, country);

    // Attach qty and remove handlers
    cartList.querySelectorAll('[data-qty-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.qtyId;
        const items = Cart.getItems();
        const item = items.find(i => i.id === id);
        if (!item) return;
        if (btn.dataset.qtyAction === 'plus') {
          Cart.updateQty(id, item.qty + 1);
        } else {
          if (item.qty <= 1) {
            Cart.removeItem(id);
          } else {
            Cart.updateQty(id, item.qty - 1);
          }
        }
        renderCartPage();
      });
    });

    cartList.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.removeItem(btn.dataset.removeId);
        renderCartPage();
      });
    });
  }

  // Clear cart button
  const clearBtn = document.getElementById('cart-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Cart.clear();
      renderCartPage();
    });
  }

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const country = getCountry();
      const total = Cart.getTotal(country);
      const items = Cart.getItems();
      const isMX = country === 'mexico';

      // Build WhatsApp message
      let msg = '¡Hola! Quiero hacer un pedido:\n\n';
      items.forEach(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (product) {
          const price = isMX ? product.priceMx : product.priceAr;
          msg += `• ${product.name} x${item.qty} - ${formatPrice(price * item.qty, country)}\n`;
        }
      });
      msg += `\nTotal: ${formatPrice(total, country)}`;

      const phone = '543873050468';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

      // Show confirmation
      showToast('¡Redirigiendo a WhatsApp!');
      setTimeout(() => window.open(url, '_blank'), 500);
    });
  }

  // ==========================================
  // INIT
  // ==========================================
  Cart.updateBadge();
  renderCartPage();

});
