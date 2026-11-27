// Rendering of one deal as a card for the list grid. Every figure on the card
// comes from deal-math, so the card, the detail page and the filters always
// agree with each other.

import { CHECKED_AT } from './data-deals.js';
import { dealScore, discountPct, formatMoney, savings, verdictLabel } from './deal-math.js';

const CATEGORY_ICONS = {
  audio: '<path d="M4 15v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
  tvs: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 21h6"/>',
  computers: '<rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M2 19h20"/>',
  phones: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17.5h2"/>',
  gaming: '<path d="M6 8h12a5 5 0 0 1 5 5c0 2.8-2.2 5-5 5-1.5 0-2.6-.6-3.6-1.6L13.4 15h-2.8l-1 1.4C8.6 17.4 7.5 18 6 18c-2.8 0-5-2.2-5-5a5 5 0 0 1 5-5Z"/><path d="M7 11v4M5 13h4"/><circle cx="16.5" cy="11.5" r=".8" fill="currentColor"/><circle cx="19" cy="14" r=".8" fill="currentColor"/>',
  smarthome: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v10h12V10"/><circle cx="12" cy="14" r="2"/>',
  home: '<path d="M5 10h14l-1.5 10h-11L5 10Z"/><path d="M8.5 10a3.5 3.5 0 0 1 7 0"/>',
  storage: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="8" cy="12" r="1.6"/><path d="M14 12h5"/>',
};

export function categoryIcon(category) {
  const paths = CATEGORY_ICONS[category] || CATEGORY_ICONS.storage;
  return `<svg class="deal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// When this deal's price was read: its own checkedAt when it was checked in
// a later round than the main one, else the shared CHECKED_AT.
export function checkedLabel(deal) {
  return deal.checkedAt || CHECKED_AT;
}

export function dealCard(deal, categoryName) {
  const pct = discountPct(deal);
  const score = dealScore(deal);
  return `
  <article class="deal-card">
    <div class="deal-card-top">
      <span class="deal-cat">${categoryIcon(deal.category)} ${esc(categoryName)}</span>
      <span class="verdict verdict-${deal.verdict}">${verdictLabel(deal.verdict)}</span>
    </div>
    <h3 class="deal-name"><a href="#/deal/${deal.id}">${esc(deal.name)}</a></h3>
    <p class="deal-store">at <strong>${esc(deal.store)}</strong>${deal.ends ? ` · sale ends ${esc(deal.ends)}` : ''}</p>
    <p class="deal-prices">
      <span class="deal-price">${formatMoney(deal.price)}</span>
      <span class="deal-usual">${formatMoney(deal.usual)}</span>
      <span class="deal-off">-${pct}%</span>
    </p>
    <p class="deal-save">You save ${formatMoney(savings(deal))}${deal.unit ? ` · ${esc(deal.unit)}` : ''}</p>
    <div class="score-row" title="Deal score: discount and verdict combined">
      <div class="score-bar"><span style="width:${score}%"></span></div>
      <span class="score-num">${score}/100</span>
    </div>
    <p class="deal-checked">Price checked ${checkedLabel(deal)} · Source: ${esc(deal.sourceName)}</p>
    <p class="deal-actions">
      <a class="btn btn-store" href="${deal.url}" target="_blank" rel="noopener">View at ${esc(deal.store)}</a>
      <a class="btn btn-detail" href="#/deal/${deal.id}">Why this verdict</a>
    </p>
  </article>`;
}
