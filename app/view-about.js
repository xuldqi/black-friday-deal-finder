// The method page: how the deals were found and checked, what the verdicts
// and the score mean, and the full list of sources the prices were read
// from. Everything the front page claims, explained in one place.

import { CHECKED_AT, DEALS } from './data-deals.js';
import { esc } from './card.js';

export function renderAbout(app) {
  const sources = new Map();
  for (const deal of DEALS) {
    if (!sources.has(deal.sourceUrl)) sources.set(deal.sourceUrl, deal.sourceName);
  }
  const sourceItems = [...sources.entries()]
    .map(([url, name]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(name)}</a></li>`)
    .join('');

  app.innerHTML = `
  <article class="detail method">
    <h1>How these deals were checked</h1>
    <p>Every deal on this site was found and price-checked by the agent that built it, on the morning of
    Black Friday, ${CHECKED_AT}. Nothing here is scraped from a feed or copied from another deal site:
    each price was read either on the store's own product page or in a deals source that names the store
    and shows both the sale price and the usual price, and each deal names that source and links to it.
    A deal whose price could not be read anywhere was left out, however good it sounded.</p>
    <h2>The verdicts</h2>
    <ul class="verdict-list">
      <li><span class="verdict verdict-new-low">New low</span> The lowest price we could find any record of for this product.</li>
      <li><span class="verdict verdict-strong">Strong price</span> A genuinely good price, well under what the product usually sells for.</li>
      <li><span class="verdict verdict-fair">Fair price</span> A real discount, but an ordinary one — this product is on sale at this price fairly often.</li>
      <li><span class="verdict verdict-inflated">Inflated anchor</span> The struck-through "usual" price is nominal, so the percentage flatters the deal. The sale price itself may still be fine.</li>
    </ul>
    <h2>The deal score</h2>
    <p>Each deal scores out of 100. Three quarters of the score is the discount percentage; the rest is the
    verdict (a new low adds 30, a strong price 22, a fair price 10, an inflated anchor 2). That way a modest
    discount on a genuine new low can outrank a huge discount off a price nobody ever pays. The arithmetic is
    deliberately simple and shown on every deal page.</p>
    <h2>The fine print</h2>
    <p>Prices were true when checked and can change or sell out at any time — the store page is always the
    final word. "Usual price" is the list or comparable-value price shown next to the sale price by the store
    or the source. Store links open the product at the store in a new tab; this site sells nothing itself and
    holds no stock.</p>
    <h2>Sources the prices were read from</h2>
    <ul class="source-list">${sourceItems}</ul>
  </article>`;
}
