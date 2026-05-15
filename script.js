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

  // Product page: show selected category, add to cart, save, chat
  const productSections = Array.from(document.querySelectorAll('.product-page'));
  if (productSections.length) {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get('category') || 'laptops';
    let selected = productSections.find(section => section.dataset.category === selectedCategory) || productSections[0];

    productSections.forEach(section => {
      section.style.display = section === selected ? 'flex' : 'none';
    });

    document.querySelectorAll('.addtocart').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.closest('.product-page')?.querySelector('h1')?.textContent || 'Product';
        alert(`✅ ${productName} was added to your cart.`);
        goTo('cart.html#cart-items');
      });
    });

    document.querySelectorAll('.save').forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.closest('.product-page')?.querySelector('h1')?.textContent || 'Product';
        alert(`${productName} saved successfully.`);
      });
    });

    document.querySelectorAll('.chat').forEach(button => {
      button.addEventListener('click', () => {
        window.open('https://wa.me/966538380082', '_blank', 'noopener');
      });
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
