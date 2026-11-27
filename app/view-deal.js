// One deal in full: the price arithmetic shown step by step, the verdict and
// the evidence behind it, the same product's prices at other stores where we
// checked them, and the source the price was read from, with a link to it.

import { CATEGORIES, DEALS } from './data-deals.js';
import { categoryIcon, checkedLabel, esc } from './card.js';
import { dealScore, discountPct, formatMoney, savings, scoreParts, trimNumber, verdictLabel } from './deal-math.js';

const categoryName = (key) => (CATEGORIES.find(([k]) => k === key) || [key, key])[1];

export function renderDeal(app, id) {
  const deal = DEALS.find((d) => d.id === id);
  if (!deal) {
    app.innerHTML = `
    <section class="detail">
      <p><a href="#/">&larr; All deals</a></p>
      <h1>That deal is not on the list</h1>
      <p>It may have sold out, or the link is wrong. The full checked list is on the <a href="#/">front page</a>.</p>
    </section>`;
    return;
  }
  const pct = discountPct(deal);
  const score = dealScore(deal);
  const parts = scoreParts(deal);
  const alsoRows = (deal.alsoAt || [])
    .map(
      (other) =>
        `<tr><td>${esc(other.store)}</td><td>${formatMoney(other.price)}</td><td>${other.price <= deal.price ? 'matches or beats it' : formatMoney(other.price - deal.price) + ' more'}</td></tr>`,
    )
    .join('');
  const alsoBlock = alsoRows
    ? `<h2>The same product elsewhere</h2>
       <table class="compare">
         <thead><tr><th>Store</th><th>Price</th><th>Against ${esc(deal.store)}</th></tr></thead>
         <tbody>${alsoRows}</tbody>
       </table>`
    : '';

  app.innerHTML = `
  <article class="detail">
    <p><a href="#/">&larr; All deals</a></p>
    <p class="deal-cat detail-cat">${categoryIcon(deal.category)} ${esc(categoryName(deal.category))}</p>
    <h1>${esc(deal.name)}</h1>
    <p class="detail-blurb">${esc(deal.blurb)}</p>
    <div class="detail-price-box">
      <p class="deal-prices detail-prices">
        <span class="deal-price">${formatMoney(deal.price)}</span>
        <span class="deal-usual">${formatMoney(deal.usual)}</span>
        <span class="deal-off">-${pct}%</span>
      </p>
      <p class="deal-save">You save ${formatMoney(savings(deal))} at ${esc(deal.store)}${deal.unit ? ` · ${esc(deal.unit)}` : ''}${deal.ends ? ` · this sale ends ${esc(deal.ends)}` : ''}</p>
      <p><a class="btn btn-store btn-big" href="${deal.url}" target="_blank" rel="noopener">View this product at ${esc(deal.store)}</a></p>
    </div>
    <h2>Is it really a deal?</h2>
    <p><span class="verdict verdict-${deal.verdict}">${verdictLabel(deal.verdict)}</span>
    <span class="score-inline">Deal score ${score}/100, from this deal's own numbers: ${parts.pct}% off &times; 0.75 = ${trimNumber(parts.discountPoints)}, plus ${parts.verdictPoints} points for the ${verdictLabel(deal.verdict).toLowerCase()} verdict, rounded.</span></p>
    <p>${esc(deal.evidence)}</p>
    ${alsoBlock}
    <h2>How this price was checked</h2>
    <p>Price read on ${checkedLabel(deal)} from ${esc(deal.sourceName)}.
    Read it yourself: <a href="${deal.sourceUrl}" target="_blank" rel="noopener">${esc(deal.sourceName)}</a>.
    Prices move quickly on Black Friday, so confirm the price on the store page before you pay.</p>
  </article>`;
}
