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