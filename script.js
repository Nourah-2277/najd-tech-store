// Najd Tech Store — corrected interactive script

document.addEventListener('DOMContentLoaded', () => {
  // Shared helpers
  const goTo = (url) => { window.location.href = url; };
  const scrollToTarget = (selector) => {
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('[data-href]').forEach(button => {
    button.addEventListener('click', () => goTo(button.dataset.href));
  });

  document.querySelectorAll('[data-target]').forEach(button => {
    button.addEventListener('click', () => scrollToTarget(button.dataset.target));
  });

  // Catalog: search, category filter, and sorting
  const productsContainer = document.querySelector('.products');
  if (productsContainer) {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('category-Filter');
    const sortSelect = document.getElementById('sortSelect');
    const noResults = document.getElementById('noResults');
    const applyFiltersButton = document.getElementById('applyFiltersButton');

    const filterProducts = () => {
      const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const category = categoryFilter ? categoryFilter.value : 'all';
      const cards = Array.from(productsContainer.querySelectorAll('.product-card'));
      let found = false;

      cards.forEach(card => {
        const name = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const description = (card.querySelector('p')?.textContent || '').toLowerCase();
        const cardCategory = card.dataset.category || '';
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesSearch = !search || name.includes(search) || description.includes(search);
        const shouldShow = matchesCategory && matchesSearch;
        card.style.display = shouldShow ? 'flex' : 'none';
        if (shouldShow) found = true;
      });

      if (noResults) noResults.style.display = found ? 'none' : 'block';
    };

    const sortProducts = () => {
      const sort = sortSelect ? sortSelect.value : 'Sort: Featured';
      const cards = Array.from(productsContainer.querySelectorAll('.product-card'));
      cards.sort((a, b) => {
        const priceA = Number((a.querySelector('h4')?.textContent || '').replace(/\D/g, '')) || 0;
        const priceB = Number((b.querySelector('h4')?.textContent || '').replace(/\D/g, '')) || 0;
        if (sort === 'Price Low') return priceA - priceB;
        if (sort === 'Price High') return priceB - priceA;
        return 0;
      });
      cards.forEach(card => productsContainer.appendChild(card));
    };

    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    if (urlCategory && categoryFilter) categoryFilter.value = urlCategory;

    searchInput?.addEventListener('input', filterProducts);
    categoryFilter?.addEventListener('change', filterProducts);
    sortSelect?.addEventListener('change', () => { sortProducts(); filterProducts(); });
    applyFiltersButton?.addEventListener('click', () => { sortProducts(); filterProducts(); });

    sortProducts();
    filterProducts();
  }

  // ── Product page ──
  const isProductPage = document.getElementById('product-details');
  if (isProductPage) {

    const products = {
      novabook:   { name: 'NovaBook X14 Pro',   icon: '💻', price: 'SAR 4,299', rating: '⭐ 4.9', cat: 'Laptops',   badge: 'Best seller',  badgeCls: 'best-seller',  desc: 'A sleek high-performance laptop for students, creators, and professionals.', specs: [{ icon:'⚙️', title:'Intel Core i7', sub:'Smooth multitasking' }, { icon:'🧠', title:'16GB RAM / 512GB SSD', sub:'Fast launch speed' }, { icon:'🔋', title:'14-hour battery', sub:'Optimized for all-day use' }, { icon:'🛡️', title:'Secure checkout', sub:'Protected order flow' }] },
      aerophone:  { name: 'AeroPhone Ultra',    icon: '📱', price: 'SAR 3,699', rating: '⭐ 4.8', cat: 'Phones',    badge: 'New arrival',  badgeCls: 'new-arrival',  desc: 'A next-gen flagship smartphone with AI camera and all-day battery.', specs: [{ icon:'📷', title:'200MP AI Camera', sub:'Stunning photos day and night' }, { icon:'⚡', title:'Snapdragon 8 Gen 3', sub:'Ultra-fast performance' }, { icon:'🔋', title:'5000mAh Battery', sub:'45W fast charging' }, { icon:'🛡️', title:'2-Year Warranty', sub:'Full regional coverage' }] },
      echopods:   { name: 'EchoPods Max',       icon: '🎧', price: 'SAR 649',   rating: '⭐ 4.7', cat: 'Audio',     badge: 'Popular',      badgeCls: 'popular',      desc: 'Premium wireless earbuds with noise cancellation and custom sound profile.', specs: [{ icon:'🔇', title:'Active Noise Cancellation', sub:'Block out the world' }, { icon:'🎵', title:'Custom Audio Driver', sub:'Deep bass, crisp highs' }, { icon:'🔋', title:'36h Total Battery', sub:'With charging case' }, { icon:'📶', title:'Bluetooth 5.3', sub:'Low-latency connection' }] },
      pulsewatch: { name: 'Pulse Watch S3',     icon: '⌚', price: 'SAR 899',   rating: '⭐ 4.8', cat: 'Wearables', badge: 'Top rated',    badgeCls: 'top-rated',    desc: 'A premium smartwatch that tracks health and productivity in one sleek wearable.', specs: [{ icon:'❤️', title:'Health Tracking', sub:'Heart rate, SpO2, sleep' }, { icon:'🏃', title:'GPS + Sports Modes', sub:'100+ workout types' }, { icon:'🔋', title:'7-Day Battery', sub:'Always-on display' }, { icon:'💧', title:'5ATM Water Resistant', sub:'Swim-proof build' }] },
      visionpad:  { name: 'VisionPad Air',      icon: '🖥️', price: 'SAR 2,899', rating: '⭐ 4.6', cat: 'Laptops',   badge: 'Student pick', badgeCls: 'student-pick', desc: 'A lightweight powerhouse tablet with M2 chip and stunning 12.9" display.', specs: [{ icon:'🖥️', title:'12.9" Liquid Retina', sub:'ProMotion 120Hz display' }, { icon:'⚙️', title:'M2 Chip', sub:'Desktop-class performance' }, { icon:'🔋', title:'10-Hour Battery', sub:'Work all day' }, { icon:'✏️', title:'Pencil Support', sub:'Perfect for notes and art' }] },
      snapcam:    { name: 'SnapCam 8K',         icon: '📷', price: 'SAR 1,499', rating: '⭐ 4.7', cat: 'Audio',     badge: 'Creator gear', badgeCls: 'creator-gear', desc: 'A professional mirrorless camera with 8K video and AI autofocus.', specs: [{ icon:'🎥', title:'8K Video Recording', sub:'30fps cinematic quality' }, { icon:'🤖', title:'AI Subject Tracking', sub:'Never miss a moment' }, { icon:'🔋', title:'600-Shot Battery', sub:'Shoot all day' }, { icon:'💾', title:'Dual SD Card Slots', sub:'Backup while you shoot' }] },
      gamecore:   { name: 'GameCore Mini',      icon: '🎮', price: 'SAR 2,399', rating: '⭐ 4.5', cat: 'Phones',    badge: 'Hot deal',     badgeCls: 'hot-deal',     desc: 'A compact gaming console with 4K support and regional game store.', specs: [{ icon:'🎮', title:'4K @ 120fps Gaming', sub:'Ultra-smooth gameplay' }, { icon:'💾', title:'1TB NVMe SSD', sub:'Zero load times' }, { icon:'📶', title:'Wi-Fi 6E + Bluetooth', sub:'Lag-free online gaming' }, { icon:'🌐', title:'Regional Game Store', sub:'Arabic content included' }] },
      fitband:    { name: 'FitBand Neo',        icon: '📿', price: 'SAR 349',   rating: '⭐ 4.4', cat: 'Wearables', badge: 'Budget smart', badgeCls: 'budget-smart', desc: 'An affordable smart fitness band with health tracking and AMOLED display.', specs: [{ icon:'❤️', title:'Heart Rate Monitor', sub:'24/7 continuous tracking' }, { icon:'😴', title:'Sleep Analysis', sub:'Smart sleep stage tracking' }, { icon:'🔋', title:'14-Day Battery', sub:'Worry-free wearable' }, { icon:'💧', title:'Water Resistant', sub:'Splash and sweat proof' }] },
    };

    // Load selected product into detail view
    const loadProduct = (key) => {
      const d = products[key];
      if (!d) return;
      document.getElementById('product-title').textContent  = d.name;
      document.getElementById('product-name').textContent   = d.name;
      document.getElementById('product-icon').textContent   = d.icon;
      document.getElementById('product-price').textContent  = d.price;
      document.getElementById('product-rating').textContent = d.rating;
      document.getElementById('product-desc').textContent   = d.desc;
      document.getElementById('specs-list').innerHTML = d.specs.map(s => `
        <div class="spec-item">
          <div class="spec-icon-bg">${s.icon}</div>
          <div class="spec-text"><strong>${s.title}</strong><p>${s.sub}</p></div>
        </div>`).join('');
      // Scroll to top of detail
      document.getElementById('product-view').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Render all products grid
    const grid = document.getElementById('all-products-grid');
    if (grid) {
      grid.innerHTML = Object.entries(products).map(([key, d]) => `
        <div class="product-card" data-product="${key}" style="cursor:pointer;">
          <div class="image-container">
            <span class="badge ${d.badgeCls}">${d.badge}</span>
            <div class="product-icon">${d.icon}</div>
          </div>
          <div class="product-info-row">
            <h3>${d.name}</h3>
            <span class="rating">${d.rating}</span>
          </div>
          <p class="description">${d.cat} • Smartly selected for modern buyers.</p>
          <div class="product-footer">
            <h4>${d.price}</h4>
          </div>
        </div>`).join('');

      // Click any card → load it in detail view
      grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => loadProduct(card.dataset.product));
      });
    }

    // Load default product
    const urlParams = new URLSearchParams(window.location.search);
    loadProduct(urlParams.get('product') || 'novabook');

    // Action buttons
    document.querySelector('.btn-add-cart')?.addEventListener('click', () => {
      const name = document.getElementById('product-name').textContent;
      alert(`✅ ${name} was added to your cart.`);
      goTo('cart.html');
    });
    document.querySelector('.btn-save-item')?.addEventListener('click', () => {
      const name = document.getElementById('product-name').textContent;
      alert(`💾 ${name} saved successfully.`);
    });
    document.querySelector('.btn-chat-seller')?.addEventListener('click', () => {
      window.open('https://wa.me/966538380082', '_blank', 'noopener');
    });
  }

  // Cart page: quantity controls and totals
  const cartItems = document.querySelectorAll('#cart-items .product-card');
  if (cartItems.length) {
    const cleanNumber = (text) => Number(String(text).replace(/[^0-9]/g, '')) || 0;

    const updateCartTotal = () => {
      let subtotal = 0;
      cartItems.forEach(item => {
        const price = cleanNumber(item.querySelector('.price')?.textContent || '0');
        const qty = Number(item.querySelector('.qty-control span')?.textContent || '1');
        subtotal += price * qty;
      });

      const subtotalBox = document.querySelectorAll('.summary-row strong')[0];
      const totalBox = document.querySelector('.summary-total strong');
      const delivery = 30;
      const discount = 150;
      const total = subtotal + delivery - discount;

      if (subtotalBox) subtotalBox.textContent = `SAR ${subtotal.toLocaleString()}`;
      if (totalBox) totalBox.textContent = `SAR ${total.toLocaleString()}`;
    };

    document.querySelectorAll('.qty-control').forEach(control => {
      const minusBtn = control.querySelector('button:first-child');
      const plusBtn = control.querySelector('button:last-child');
      const qtyText = control.querySelector('span');

      minusBtn?.addEventListener('click', () => {
        const qty = Math.max(1, Number(qtyText.textContent) - 1);
        qtyText.textContent = qty;
        updateCartTotal();
      });

      plusBtn?.addEventListener('click', () => {
        qtyText.textContent = Number(qtyText.textContent) + 1;
        updateCartTotal();
      });
    });

    document.querySelector('.go-checkout')?.addEventListener('click', (event) => {
      event.preventDefault();
      goTo('checkout.html#checkout-form');
    });

    updateCartTotal();
  }

  // Checkout page: form validation and order confirmation
  const checkoutForm = document.querySelector('.checkout-form');
  const placeOrderBtn = document.querySelector('.checkout-btn');
  if (checkoutForm && placeOrderBtn) {
    placeOrderBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const requiredFields = checkoutForm.querySelectorAll('input[type="text"], input[type="email"]');
      let valid = true;

      requiredFields.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ff4d4d';
          valid = false;
        } else {
          input.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        }
      });

      if (!valid) {
        alert('Please fill in all required fields before placing the order.');
        return;
      }

      alert('✅ Your order has been placed successfully.');
      goTo('dashboard.html#recent-orders');
    });
  }

  // Account page: login/register tab and validation
  const authForm = document.querySelector('.auth-form');
  if (authForm) {
    const tabs = document.querySelectorAll('.tab');
    const authTitle = document.querySelector('.auth-panel h3');
    const submitBtn = authForm.querySelector('button[type="submit"]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const isRegister = tab.textContent.trim() === 'Register';
        if (authTitle) authTitle.textContent = isRegister ? 'Create your new account' : 'Welcome back';
        if (submitBtn) submitBtn.textContent = isRegister ? 'Create account' : 'Login to dashboard';
      });
    });

    authForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = authForm.querySelector('input[type="email"]');
      const passwordInput = authForm.querySelector('input[type="password"]');
      const fields = [emailInput, passwordInput].filter(Boolean);
      const valid = fields.every(input => input.value.trim());
      fields.forEach(input => input.style.borderColor = input.value.trim() ? 'rgba(255,255,255,0.04)' : '#ff4d4d');

      if (!valid) {
        alert('Please enter your email and password.');
        return;
      }

      alert('✅ Success. Welcome to Najd Tech Store.');
      goTo('dashboard.html#dashboard-overview');
    });
  }

  // Legacy login page support
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = loginForm.querySelector('input[type="email"]');
      const password = loginForm.querySelector('input[type="password"]');
      if (!email.value.trim() || !password.value.trim()) {
        alert('Please enter your email and password.');
        return;
      }
      goTo('dashboard.html#dashboard-overview');
    });
  }

  // Dashboard page: chart, table simulation, and live stats
  const dashboard = document.getElementById('dashboard-overview');
  if (dashboard) {
    document.querySelectorAll('.bar').forEach(bar => {
      const targetHeight = bar.style.height || '60%';
      bar.style.height = '0px';
      setTimeout(() => {
        bar.style.transition = 'height 1s ease-out';
        bar.style.height = targetHeight;
      }, 200);
    });

    const addButton = document.querySelector('.btn-add');
    const ordersTable = document.querySelector('.orders-table tbody');
    addButton?.addEventListener('click', () => {
      if (!ordersTable) return;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#NTS-${Math.floor(1000 + Math.random() * 9000)}</td>
        <td>Ahmed K.</td>
        <td>Smart Watch G3</td>
        <td><span class="status-delivered" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">Pending</span></td>
        <td>SAR 1,200</td>
      `;
      row.style.opacity = '0';
      ordersTable.prepend(row);
      setTimeout(() => {
        row.style.transition = 'opacity 0.5s ease';
        row.style.opacity = '1';
      }, 10);
      scrollToTarget('#recent-orders');
    });

    const salesValue = document.querySelector('.stat-card:nth-child(1) .value');
    if (salesValue) {
      let currentSales = 84320;
      setInterval(() => {
        currentSales += Math.floor(Math.random() * 100);
        salesValue.textContent = `SAR ${currentSales.toLocaleString()}`;
      }, 5000);
    }
  }
});
