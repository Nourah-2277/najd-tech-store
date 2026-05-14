// ═══════════════════════════════════════════
//   NAJD TECH STORE — script.js
// ═══════════════════════════════════════════


// ─── CATALOG PAGE ───────────────────────────
if (document.querySelector('.products')) {

  const searchInput    = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('category-Filter');
  const sortSelect     = document.getElementById('sortSelect');
  const noResults      = document.getElementById('noResults');

  function filterProducts() {
    const search   = searchInput    ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value            : 'all';
    const cards    = document.querySelectorAll('.product-card');
    let   found    = false;

    cards.forEach(card => {
      const name     = card.querySelector('h3').textContent.toLowerCase();
      const cardCat  = card.dataset.category;
      const matchCat = category === 'all' || cardCat === category;
      const matchSrc = name.includes(search);

      card.style.display = (matchCat && matchSrc) ? 'flex' : 'none';
      if (matchCat && matchSrc) found = true;
    });

    if (noResults) noResults.style.display = found ? 'none' : 'block';
  }

  function sortProducts() {
    const sort      = sortSelect ? sortSelect.value : 'Sort: Featured';
    const container = document.querySelector('.products');
    const cards     = Array.from(document.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
      const priceA = parseInt(a.querySelector('h4').textContent.replace(/\D/g, ''));
      const priceB = parseInt(b.querySelector('h4').textContent.replace(/\D/g, ''));
      if (sort === 'Price Low')  return priceA - priceB;
      if (sort === 'Price High') return priceB - priceA;
      return 0;
    });

    cards.forEach(card => container.appendChild(card));
  }

  // ── لو جاء من product page بـ category في الـ URL ──
  const params      = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');

  if (urlCategory && categoryFilter) {
    categoryFilter.value = urlCategory;
    filterProducts();
  }

  if (searchInput)    searchInput.addEventListener('input',  filterProducts);
  if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
  if (sortSelect)     sortSelect.addEventListener('change', () => { sortProducts(); filterProducts(); });
}


// ─── PRODUCT PAGE ───────────────────────────
if (document.querySelector('.product-page')) {

  const params      = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');

  // أخفِ كل الـ sections أولاً (استخدمنا .product-page مباشرةً)
  document.querySelectorAll('.product-page').forEach(section => {
    section.style.display = 'none';
  });

  // أخفِ كل العناصر اللي فوق كل section (breadcrumb, title, trust-badges)
  document.querySelectorAll('.product-breadcrumb, .product-page-title, .trust-badges').forEach(el => {
    el.style.display = 'none';
  });

  let shownSection = null;

  if (urlCategory) {
    // أظهر فقط المنتج اللي يطابق الـ category
    const matched = document.querySelector(`.product-page[data-category="${urlCategory}"]`);
    if (matched) {
      shownSection = matched;
    } else {
      // fallback: أول منتج
      shownSection = document.querySelector('.product-page');
    }
  } else {
    // لو ما في category في الـ URL، اعرض الأول
    shownSection = document.querySelector('.product-page');
  }

  if (shownSection) {
    shownSection.style.display = 'flex';

    // أظهر الـ breadcrumb والـ title والـ trust-badges اللي قبلها مباشرةً
    let prev = shownSection.previousElementSibling;
    const toShow = [];
    while (prev && (prev.classList.contains('trust-badges') ||
                    prev.classList.contains('product-page-title') ||
                    prev.classList.contains('product-breadcrumb'))) {
      toShow.unshift(prev);
      prev = prev.previousElementSibling;
    }
    toShow.forEach(el => el.style.display = '');
  }

  // ── Thumbnails ──────────────────────────────
  document.querySelectorAll('.product-page').forEach(section => {
    const mainImg    = section.querySelector('.product-image > img');
    const thumbnails = section.querySelectorAll('.thumbnails img');

    thumbnails.forEach(thumb => {
      thumb.style.cursor = 'pointer';
      thumb.style.opacity = '0.7';
      thumb.style.border = '2px solid transparent';
      thumb.style.borderRadius = '6px';
      thumb.style.transition = 'all 0.2s';

      thumb.addEventListener('click', () => {
        if (mainImg) mainImg.src = thumb.src;

        thumbnails.forEach(t => {
          t.style.opacity = '0.7';
          t.style.border  = '2px solid transparent';
        });
        thumb.style.opacity = '1';
        thumb.style.border  = '2px solid #6366f1';
      });
    });
  });

  // ── Add to Cart ─────────────────────────────
  document.querySelectorAll('.addtocart').forEach(btn => {
    btn.addEventListener('click', () => {
      const section     = btn.closest('.product-page');
      const productName = section ? section.querySelector('h1').textContent : 'المنتج';
      alert('✅ the project was added to cart: ' + productName);
      window.location.href = 'cart.html';
    });
  });

  // ── Save Item ───────────────────────────────
  document.querySelectorAll('.save').forEach(btn => {
    btn.addEventListener('click', () => {
      const section     = btn.closest('.product-page');
      const productName = section ? section.querySelector('h1').textContent : 'المنتج';
      alert('the product saved successfully, it waiting you to be the owner😉: ' + productName);
    });
  });

  // ── Chat with Seller ────────────────────────
  document.querySelectorAll('.chat').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open('https://wa.me/966538380082', '_blank');
    });
  });
}

//CART PAGE

document.addEventListener("DOMContentLoaded", () => {

  const qtyControls = document.querySelectorAll(".qty-control");

  qtyControls.forEach(control => {
    const minusBtn = control.querySelector("button:first-child");
    const plusBtn = control.querySelector("button:last-child");
    const qtyText = control.querySelector("span");

    minusBtn.addEventListener("click", () => {
      let qty = parseInt(qtyText.textContent);
      if (qty > 1) {
        qty--;
        qtyText.textContent = qty;
        updateCartTotal();
      }
    });

    plusBtn.addEventListener("click", () => {
      let qty = parseInt(qtyText.textContent);
      qty++;
      qtyText.textContent = qty;
      updateCartTotal();
    });
  });

  const goCheckoutBtn = document.querySelector(".go-checkout");
  if (goCheckoutBtn) {
    goCheckoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "checkout.html";
    });
  }

  function cleanNumber(text) {
    return parseFloat(text.replace(/[^0-9]/g, ""));
  }

  function updateCartTotal() {
    let subtotal = 0;

    const items = document.querySelectorAll(".product-card");

    items.forEach(item => {
      const priceText = item.querySelector(".price").textContent;
      const price = cleanNumber(priceText);
      const qty = parseInt(item.querySelector(".qty-control span").textContent);
      subtotal += price * qty;
    });

    const subtotalBox = document.querySelectorAll(".summary-row strong")[0];
    subtotalBox.textContent = `SAR ${subtotal}`;

    const delivery = 30;
    const discount = 150;
    const total = subtotal + delivery - discount;

    const totalBox = document.querySelector(".summary-total strong");
    totalBox.textContent = `SAR ${total}`;
  }

  updateCartTotal();

});



  const form = document.querySelector(".checkout-form");
  const placeOrderBtn = document.querySelector(".checkout-btn");

  if (form && placeOrderBtn) {
    placeOrderBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const firstName = form.querySelector('input[placeholder="Abeer"]');
      const lastName = form.querySelector('input[placeholder="Alqahtani"]');
      const email = form.querySelector('input[type="email"]');
      const phone = form.querySelector('input[placeholder="05XXXXXXXX"]');
      const address = form.querySelector('input[placeholder="Street, district, city, postal code"]');

      if (
        !firstName.value.trim() ||
        !lastName.value.trim() ||
        !email.value.trim() ||
        !phone.value.trim() ||
        !address.value.trim()
      ) {
        alert("Please fill in all required fields before placing the order.");
        return;
      }

      alert("Your order has been placed successfully!");
    });
  }Account page :

document.addEventListener('DOMContentLoaded', () => {

    // 1. Element Selectors
    const tabs = document.querySelectorAll('.tab');
    const authTitle = document.querySelector('.auth-panel h3');
    const authForm = document.querySelector('.auth-form');
    const submitBtn = document.querySelector('.btn.wide');

    // 2. Tab Switching Logic (Login / Register)
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab styling
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content based on selected tab
            if (tab.innerText === 'Register') {
                authTitle.innerText = 'Create your new account';
                submitBtn.innerText = 'Create account';
                submitBtn.style.filter = 'hue-rotate(45deg)';
            } else {
                authTitle.innerText = 'Welcome back';
                submitBtn.innerText = 'Login to dashboard';
                submitBtn.style.filter = 'none';
            }

            // Simple title animation on switch
            authTitle.animate([
                { opacity: 0, transform: 'translateY(-10px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 300 });
        });
    });

    // 3. Form Validation and Submission
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = authForm.querySelector('input[type="email"]');
        const passwordInput = authForm.querySelector('input[type="password"]');
        let isValid = true;

        // Simple validation check
        [emailInput, passwordInput].forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4d4d'; // Red border for errors
                isValid = false;
            } else {
                input.style.borderColor = 'rgba(255, 255, 255, 0.04)';
            }
        });

        if (isValid) {
            // Visual feedback for submission
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            // Simulate server request delay
            setTimeout(() => {
                alert(`Success! \nWelcome to Najd Tech Store.`);
                submitBtn.innerText = 'Success';
                submitBtn.disabled = false;

                // Reset form
                authForm.reset();
            }, 1500);
        }
    });

    // 4. Reset field status on user input
    authForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.04)';
        });
    });
});




document.addEventListener('DOMContentLoaded', () => {

    // 1. Chart Animation on Load
    // This part makes the bars "grow" when the dashboard opens
    const animateChart = () => {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            const targetHeight = bar.style.height; // Get the height from CSS inline style
            bar.style.height = '0px'; // Start from 0

            setTimeout(() => {
                bar.style.transition = 'height 1s ease-out';
                bar.style.height = targetHeight;
            }, 200);
        });
    };

    // 2. Add New Listing Logic
    // This simulates adding a new row to the "Recent Orders" table
    const btnAdd = document.querySelector('.btn-add');
    const ordersTable = document.querySelector('.orders-table tbody');

    btnAdd.addEventListener('click', () => {
        // Mock data for a new order
        const newOrder = {
            id: `#NTS-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: 'Ahmed K.',
            product: 'Smart Watch G3',
            status: 'Pending',
            amount: 'SAR 1,200'
        };

        // Create a new table row element
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newOrder.id}</td>
            <td>${newOrder.customer}</td>
            <td>${newOrder.product}</td>
            <td><span class="status-delivered" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">${newOrder.status}</span></td>
            <td>${newOrder.amount}</td>
        `;

        // Add animation class or effect
        row.style.opacity = '0';
        ordersTable.prepend(row); // Add to the top of the table

        // Fade in effect
        setTimeout(() => {
            row.style.transition = 'opacity 0.5s ease';
            row.style.opacity = '1';
        }, 10);
    });

    // 3. Navigation and Buttons
    const btnBack = document.querySelector('.btn-back');
    const btnLogin = document.querySelector('.btn-login');
    const btnExplore = document.querySelector('.btn-explore');

    btnBack.addEventListener('click', () => {
        alert('Navigating back to the Store front...');
        // window.location.href = 'index.html';
    });

    btnLogin.addEventListener('click', () => {
        console.log('Login triggered from Dashboard');
    });

    btnExplore.addEventListener('click', () => {
        alert('Loading Store Catalog...');
    });

    // 4. Update Stats Simulation
    // Randomly updates the "Total Sales" to make it look "Live"
    const updateStats = () => {
        const salesValue = document.querySelector('.stat-card:nth-child(1) .value');
        let currentSales = 84320;

        setInterval(() => {
            const randomIncrease = Math.floor(Math.random() * 100);
            currentSales += randomIncrease;
            salesValue.innerText = `SAR ${currentSales.toLocaleString()}`;
        }, 5000); // Updates every 5 seconds
    };

    // Initialize functions
    animateChart();
    updateStats();

});
