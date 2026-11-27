// Search, filtering and sorting for the deal list. Pure functions over the
// deals array and a small state object, so the list view stays a thin shell:
//   state = { query, category, store, minDiscount, sort }
// minDiscount is a percentage (0, 25, 40 or 50); sort is one of the keys of
// SORTERS below.

import { dealScore, discountPct, savings } from './deal-math.js';

export const SORTERS = {
  score: ['Top scored', (a, b) => dealScore(b) - dealScore(a) || discountPct(b) - discountPct(a)],
  discount: ['Biggest discount %', (a, b) => discountPct(b) - discountPct(a)],
  saving: ['Biggest saving $', (a, b) => savings(b) - savings(a)],
  'price-asc': ['Price: low to high', (a, b) => a.price - b.price],
  'price-desc': ['Price: high to low', (a, b) => b.price - a.price],
};

export function emptyState() {
  return { query: '', category: 'all', store: 'all', minDiscount: 0, sort: 'score' };
}

export function matchesQuery(deal, query) {
  if (!query) return true;
  const haystack = (deal.name + ' ' + deal.store + ' ' + deal.category).toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function applyFilters(deals, state) {
  const kept = deals.filter(
    (deal) =>
      matchesQuery(deal, state.query) &&
      (state.category === 'all' || deal.category === state.category) &&
      (state.store === 'all' || deal.store === state.store) &&
      discountPct(deal) >= state.minDiscount,
  );
  const sorter = SORTERS[state.sort] || SORTERS.score;
  return kept.sort(sorter[1]);
}

export function storeList(deals) {
  return [...new Set(deals.map((deal) => deal.store))].sort();
}
