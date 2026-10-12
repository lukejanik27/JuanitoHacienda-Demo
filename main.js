/* Juanito Hacienda — site scripts (vanilla JS, no dependencies) */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Mobile navigation ---------- */
  const toggle = $('.menu-toggle');
  const navLinks = $('#nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });
  }

  /* ---------- Highlight current page in nav ---------- */
  const norm = (s) => (s || 'index').replace(/\.html$/, '') || 'index';
  const here = norm(location.pathname.split('/').pop());
  $$('#nav-links a').forEach((a) => {
    if (norm(a.getAttribute('href')) === here) a.classList.add('active');
  });

  /* ---------- Footer year ---------- */
  $$('.year').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Hours: highlight today + open/closed status ---------- */
  // [open hour, close hour] in 24h time, indexed by getDay() (0 = Sunday)
  const HOURS = {
    0: [10, 20],
    1: [11, 21],
    2: [11, 21],
    3: [11, 21],
    4: [11, 21],
    5: [11, 23],
    6: [11, 23],
  };
  const fmtHour = (h) => {
    const suffix = h >= 12 && h < 24 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr} ${suffix}`;
  };
  const now = new Date();
  $$('.hours-table tr[data-day]').forEach((tr) => {
    if (Number(tr.dataset.day) === now.getDay()) tr.classList.add('today');
  });
  const statusEl = $('#open-status');
  if (statusEl) {
    const [open, close] = HOURS[now.getDay()];
    const hourNow = now.getHours() + now.getMinutes() / 60;
    const isOpen = hourNow >= open && hourNow < close;
    statusEl.classList.add('status-pill', isOpen ? 'open' : 'closed');
    statusEl.textContent = isOpen
      ? `Open now · until ${fmtHour(close)}`
      : `Closed now · opens ${fmtHour(open)} today`;
    if (!isOpen && hourNow >= close) statusEl.textContent = 'Closed for tonight · see you tomorrow!';
  }

  /* ---------- Menu data + rendering ---------- */
  const CATEGORIES = [
    { id: 'starters', label: 'Entradas', note: 'Starters' },
    { id: 'tacos', label: 'Tacos', note: 'Three per order, handmade tortillas' },
    { id: 'mains', label: 'Platos Fuertes', note: 'Main plates' },
    { id: 'desserts', label: 'Postres', note: 'Desserts' },
    { id: 'drinks', label: 'Bebidas', note: 'Drinks' },
  ];

  const MENU = [
    { cat: 'starters', name: 'Guacamole Hacienda', price: 12, tags: ['V', 'GF'], desc: 'Smashed to order with avocado, lime, cilantro, serrano and toasted pepitas. Served with warm tortilla chips.' },
    { cat: 'starters', name: 'Queso Fundido', price: 13, tags: ['GF'], desc: 'Bubbling Oaxaca and chihuahua cheese with roasted poblano and house chorizo. Warm flour tortillas on the side.' },
    { cat: 'starters', name: 'Elote Callejero', price: 8, tags: ['V', 'GF'], desc: 'Fire-grilled street corn, cotija, chile-lime crema and a dusting of tajín.' },
    { cat: 'starters', name: 'Ceviche de Camarón', price: 15, tags: ['GF'], desc: 'Lime-cured shrimp, cucumber, red onion and mango on crisp corn tostadas.' },

    { cat: 'tacos', name: 'Carne Asada', price: 16, tags: ['GF'], desc: 'Citrus-marinated skirt steak, charred onion, cilantro and salsa verde.' },
    { cat: 'tacos', name: 'Cochinita Pibil', price: 16, tags: ['GF'], desc: 'Slow-roasted achiote pork, pickled red onion and habanero salsa.' },
    { cat: 'tacos', name: 'Al Pastor', price: 16, tags: ['GF'], desc: 'Spit-roasted adobo pork with grilled pineapple, onion and cilantro.' },
    { cat: 'tacos', name: 'Baja Fish', price: 17, tags: [], desc: 'Beer-battered cod, shredded cabbage, chipotle crema and lime.' },
    { cat: 'tacos', name: 'Hongos y Rajas', price: 15, tags: ['V', 'GF'], desc: 'Roasted wild mushrooms and poblano strips with queso fresco.' },

    { cat: 'mains', name: 'Carne Asada Hacienda', price: 29, tags: ['GF'], desc: 'Twelve-ounce marinated skirt steak with grilled scallions, Mexican rice and charro beans.' },
    { cat: 'mains', name: 'Mole Poblano Enchiladas', price: 22, tags: [], desc: 'Shredded chicken enchiladas smothered in our 24-ingredient mole, sesame seeds and crema.' },
    { cat: 'mains', name: 'Chile Relleno', price: 20, tags: ['V'], desc: 'Roasted poblano stuffed with Oaxaca cheese, ranchero sauce, rice and beans.' },
    { cat: 'mains', name: 'Camarones al Mojo de Ajo', price: 26, tags: ['GF', 'Spicy'], desc: 'Garlic-guajillo shrimp with rice and grilled seasonal vegetables.' },
    { cat: 'mains', name: 'Fajitas del Patrón', price: 27, tags: ['GF'], desc: 'Sizzling skillet of steak and chicken with peppers and onions. Tortillas, guacamole and pico on the side.' },
    { cat: 'mains', name: 'Pozole Rojo', price: 18, tags: ['GF', 'Spicy'], desc: 'Hominy and tender pork in guajillo broth. Cabbage, radish, lime and oregano for topping.' },

    { cat: 'desserts', name: 'Churros con Chocolate', price: 9, tags: ['V'], desc: 'Cinnamon-sugar churros with warm Mexican chocolate for dipping.' },
    { cat: 'desserts', name: 'Tres Leches', price: 9, tags: ['V'], desc: 'Sponge cake soaked in three milks, finished with whipped cream and berries.' },
    { cat: 'desserts', name: 'Flan de Cajeta', price: 8, tags: ['V', 'GF'], desc: 'Silky caramel custard with goat-milk cajeta.' },

    { cat: 'drinks', name: 'Margarita de la Casa', price: 11, tags: [], desc: 'Blanco tequila, fresh lime, agave. Salted rim. Add a spicy jalapeño float for $1.' },
    { cat: 'drinks', name: 'Paloma Fresca', price: 11, tags: [], desc: 'Tequila, grapefruit, lime and a splash of soda.' },
    { cat: 'drinks', name: 'Horchata', price: 5, tags: ['V', 'GF'], desc: 'Creamy rice and cinnamon drink, made fresh every morning.' },
    { cat: 'drinks', name: 'Agua Fresca del Día', price: 5, tags: ['V', 'GF'], desc: 'Ask your server for today’s flavor: hibiscus, watermelon or tamarind.' },
    { cat: 'drinks', name: 'Chocolate Caliente', price: 6, tags: ['V'], desc: 'Stone-ground Mexican chocolate, cinnamon and a hint of chile.' },
    { cat: 'drinks', name: 'Cerveza', price: 6, tags: [], desc: 'A rotating list of Mexican lagers and local craft beers.' },
  ];

  const TAG_LABELS = { V: 'Vegetarian', GF: 'Gluten-free', Spicy: 'Spicy' };

  const menuGrid = $('#menu-grid');
  if (menuGrid) {
    let activeCat = 'all';
    let query = '';

    const itemHTML = (item) => `
      <article class="menu-item reveal visible">
        <div>
          <h3>${esc(item.name)}${item.tags
            .map((t) => `<span class="badge" title="${TAG_LABELS[t] || t}">${esc(t)}</span>`)
            .join('')}</h3>
          <p>${esc(item.desc)}</p>
        </div>
        <div class="price">$${item.price}</div>
      </article>`;

    const renderMenu = () => {
      const q = query.trim().toLowerCase();
      const matches = (i) =>
        (activeCat === 'all' || i.cat === activeCat) &&
        (!q || i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));

      let html = '';
      CATEGORIES.forEach((c) => {
        const items = MENU.filter((i) => i.cat === c.id && matches(i));
        if (!items.length) return;
        html += `<h3 class="cat-title">${esc(c.label)}<small>${esc(c.note)}</small></h3>`;
        html += items.map(itemHTML).join('');
      });
      menuGrid.innerHTML = html || '<p class="empty">No dishes match your search. Try something else!</p>';
    };

    const filterWrap = $('#menu-filters');
    if (filterWrap) {
      filterWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        activeCat = btn.dataset.cat;
        $$('.filter-btn', filterWrap).forEach((b) => b.classList.toggle('active', b === btn));
        renderMenu();
      });
    }
    const search = $('#menu-search');
    if (search) {
      search.addEventListener('input', () => {
        query = search.value;
        renderMenu();
      });
    }
    renderMenu();
  }

  /* ---------- Reviews ---------- */
  const SAMPLE_REVIEWS = [
    { name: 'Maria G.', rating: 5, date: 'September 2026', title: 'Tastes like home', text: 'The carne asada was perfectly charred and the tortillas were still warm from the press. We came for a quick lunch and stayed for two hours.' },
    { name: 'Dan K.', rating: 5, date: 'September 2026', title: 'Mole worth the drive', text: 'I drove forty minutes for the mole poblano enchiladas and I would do it again tomorrow. Deep, smoky, a little sweet. Incredible.' },
    { name: 'Priya S.', rating: 5, date: 'August 2026', title: 'Great for vegetarians', text: 'The hongos y rajas tacos and the chile relleno were both fantastic. Our server walked us through every vegetarian option without being asked.' },
    { name: 'Tom R.', rating: 4, date: 'August 2026', title: 'Lively and delicious', text: 'Friday night was busy and loud in the best way. Margaritas were excellent. We waited about 20 minutes past our reservation, but the staff apologized with free churros.' },
    { name: 'Alejandra V.', rating: 5, date: 'July 2026', title: 'Birthday done right', text: 'They sang, they brought flan with a candle, and the guacamole was made right at our table. My dad cried a little. Thank you!' },
    { name: 'Chris B.', rating: 4, date: 'July 2026', title: 'Solid Sunday brunch', text: 'The pozole rojo is the real deal and the live guitar was a lovely touch. Would love more brunch cocktail options.' },
    { name: 'Hannah L.', rating: 5, date: 'June 2026', title: 'Catered our wedding rehearsal', text: 'Juanito Hacienda catered for 60 guests and every tray came back empty. Professional, on time, and so generous with the portions.' },
    { name: 'Marcus W.', rating: 3, date: 'June 2026', title: 'Good food, slow service', text: 'The ceviche and tacos were great, but our drinks took a while to arrive on a busy night. I would go back and try again.' },
    { name: 'Sofia M.', rating: 5, date: 'May 2026', title: 'The horchata!', text: 'Everything was great, but the horchata is something else. Creamy, cinnamon-y, not too sweet. I ordered a second one for dessert.' },
  ];
  const STORAGE_KEY = 'jh_user_reviews_v1';

  const reviewsGrid = $('#reviews-grid');
  if (reviewsGrid) {
    const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
    const loadUser = () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    };
    const saveUser = (list) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        /* storage unavailable: review simply won't persist */
      }
    };

    let userReviews = loadUser();
    let ratingFilter = 'all';

    const reviewHTML = (r, isUser) => `
      <article class="review-card reveal visible">
        <div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div>
        <h3>${esc(r.title)}</h3>
        <blockquote>“${esc(r.text)}”</blockquote>
        <div class="meta">
          <span>${esc(r.name)} · ${esc(r.date)}</span>
          <span class="sample-tag">${isUser ? 'Your review (saved in this browser)' : 'Sample review'}</span>
        </div>
      </article>`;

    const renderReviews = () => {
      const all = [...userReviews.map((r) => ({ r, u: true })), ...SAMPLE_REVIEWS.map((r) => ({ r, u: false }))];
      const shown = all.filter(({ r }) => ratingFilter === 'all' || r.rating === Number(ratingFilter));
      reviewsGrid.innerHTML = shown.length
        ? shown.map(({ r, u }) => reviewHTML(r, u)).join('')
        : '<p class="empty">No reviews with that rating yet.</p>';

      const avg = all.reduce((sum, { r }) => sum + r.rating, 0) / all.length;
      const avgEl = $('#avg-rating');
      const cntEl = $('#review-count');
      const starEl = $('#avg-stars');
      if (avgEl) avgEl.textContent = avg.toFixed(1);
      if (cntEl) cntEl.textContent = `Based on ${all.length} reviews`;
      if (starEl) starEl.textContent = stars(Math.round(avg));
    };

    const filterWrap = $('#review-filters');
    if (filterWrap) {
      filterWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        ratingFilter = btn.dataset.rating;
        $$('.filter-btn', filterWrap).forEach((b) => b.classList.toggle('active', b === btn));
        renderReviews();
      });
    }

    const reviewForm = $('#review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(reviewForm)) return;
        const data = new FormData(reviewForm);
        userReviews.unshift({
          name: data.get('name').trim(),
          rating: Number(data.get('rating')),
          title: data.get('title').trim(),
          text: data.get('text').trim(),
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
        saveUser(userReviews);
        reviewForm.reset();
        showSuccess(reviewForm, 'Thank you! Your review has been added above.');
        renderReviews();
      });
    }
    renderReviews();
  }

  /* ---------- Generic form handling ---------- */
  function validateForm(form) {
    let ok = true;
    $$('.field', form).forEach((field) => {
      const input = $('input, select, textarea', field);
      const err = $('.error', field);
      if (!input || !err) return;
      const val = input.value.trim();
      let msg = '';
      if (input.required && !val) msg = 'This field is required.';
      else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Please enter a valid email address.';
      else if (input.type === 'tel' && val && val.replace(/\D/g, '').length < 10) msg = 'Please enter a valid phone number.';
      else if (input.type === 'date' && val && input.min && val < input.min) msg = 'Please choose today or a future date.';
      err.textContent = msg;
      if (msg) ok = false;
    });
    return ok;
  }

  function showSuccess(form, message) {
    const box = $('.success', form);
    if (!box) return;
    box.textContent = message;
    box.classList.add('show');
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => box.classList.remove('show'), 8000);
  }

  // Forms marked data-demo-form: validate, then show a confirmation.
  // NOTE: no data is sent anywhere. See README.md to connect a real form service.
  $$('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      form.reset();
      showSuccess(form, form.dataset.success || 'Thank you! We received your message.');
    });
    $$('input, select, textarea', form).forEach((el) =>
      el.addEventListener('input', () => {
        const err = $('.error', el.closest('.field'));
        if (err) err.textContent = '';
      })
    );
  });

  /* ---------- Reservation helpers ---------- */
  $$('input[type="date"][data-min-today]').forEach((el) => {
    const d = new Date();
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    el.min = iso;
  });

  const timeSelect = $('#time-options');
  if (timeSelect) {
    let opts = '<option value="">Select a time</option>';
    for (let mins = 11 * 60; mins <= 20 * 60 + 30; mins += 30) {
      const h24 = Math.floor(mins / 60);
      const m = mins % 60;
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      const label = `${h12}:${String(m).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
      opts += `<option value="${label}">${label}</option>`;
    }
    timeSelect.innerHTML = opts;
  }
})();
