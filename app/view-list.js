// The deal list: a summary strip, the search box, the category / store /
// discount filters and the sort control, and the grid of deal cards. The
// controls re-render only the grid, and the result count always says how
// many of the checked deals match, so a filter that shows nothing reads as
// an empty result rather than a broken page.

import { CATEGORIES, DEALS } from './data-deals.js';
import { dealCard } from './card.js';
import { formatMoney, savings } from './deal-math.js';
import { applyFilters, emptyState, SORTERS, storeList } from './filters.js';

const categoryName = (key) => (CATEGORIES.find(([k]) => k === key) || [key, key])[1];

export function renderList(app, initialCategory) {
  const state = emptyState();
  if (initialCategory && CATEGORIES.some(([k]) => k === initialCategory)) {
    state.category = initialCategory;
  }
  const totalSaving = DEALS.reduce((sum, deal) => sum + savings(deal), 0);
  const storeOptions = storeList(DEALS)
    .map((store) => `<option value="${store}">${store}</option>`)
    .join('');
  const categoryChips = [['all', 'All deals'], ...CATEGORIES]
    .map(
      ([key, name]) =>
        `<button type="button" class="chip${state.category === key ? ' active' : ''}" data-category="${key}">${name}</button>`,
    )
    .join('');
  const sortOptions = Object.entries(SORTERS)
    .map(([key, [label]]) => `<option value="${key}">${label}</option>`)
    .join('');

  app.innerHTML = `
  <section class="hero">
    <h1>Black Friday deals, checked by hand.</h1>
    <p class="hero-sub">${DEALS.length} deals found and price-checked on Black Friday morning, each with its store,
    its usual price, when it was checked, where the price was read, and an honest verdict on whether it is really a deal.
    Together they save ${formatMoney(totalSaving)} against list prices.</p>
    <p class="hero-meta">Prices checked on Black Friday morning · Cyber Monday follows on Mon 30 Nov · Prices move fast today — the store page is the final word.</p>
  </section>
  <section class="controls" aria-label="Search and filters">
    <label class="control control-search">
      <span>Search deals</span>
      <input id="f-query" type="search" placeholder="Try &quot;Sony&quot;, &quot;TV&quot; or &quot;SSD&quot;" autocomplete="off">
    </label>
    <label class="control">
      <span>Store</span>
      <select id="f-store"><option value="all">All stores</option>${storeOptions}</select>
    </label>
    <label class="control">
      <span>Discount at least</span>
      <select id="f-discount">
        <option value="0">Any discount</option>
        <option value="25">25% or more</option>
        <option value="40">40% or more</option>
        <option value="50">50% or more</option>
      </select>
    </label>
    <label class="control">
      <span>Sort by</span>
      <select id="f-sort">${sortOptions}</select>
    </label>
  </section>
  <nav class="chips" aria-label="Categories">${categoryChips}</nav>
  <p class="result-count" id="result-count" role="status"></p>
  <section class="grid" id="grid"></section>`;

  const grid = app.querySelector('#grid');
  const count = app.querySelector('#result-count');

  function paint() {
    const deals = applyFilters(DEALS, state);
    count.textContent = deals.length
      ? `Showing ${deals.length} of ${DEALS.length} checked deals`
      : 'No checked deals match that search — try fewer words, or clear a filter.';
    grid.innerHTML = deals.map((deal) => dealCard(deal, categoryName(deal.category))).join('');
  }

  app.querySelector('#f-query').addEventListener('input', (event) => {
    state.query = event.target.value;
    paint();
  });
  app.querySelector('#f-store').addEventListener('change', (event) => {
    state.store = event.target.value;
    paint();
  });
  app.querySelector('#f-discount').addEventListener('change', (event) => {
    state.minDiscount = Number(event.target.value);
    paint();
  });
  app.querySelector('#f-sort').addEventListener('change', (event) => {
    state.sort = event.target.value;
    paint();
  });
  app.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      app.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      paint();
    });
  });

  paint();
}
