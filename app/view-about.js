// The method page: how the deals were found and checked, what the verdicts
// and the score mean, and the full list of sources the prices were read
// from. Everything the front page claims, explained in one place.

import { CHECKED_AT, DEALS } from './data-deals.js';
import { esc } from './card.js';
import { dealScore, scoreParts, verdictLabel } from './deal-math.js';

export function renderAbout(app) {
  const sources = new Map();
  for (const deal of DEALS) {
    if (!sources.has(deal.sourceUrl)) sources.set(deal.sourceUrl, deal.sourceName);
  }
  // Two worked examples taken from the list itself, so the arithmetic a
  // reader checks here is the arithmetic on the deal pages: the
  // highest-scoring deal, and an inflated anchor whose bigger percentage
  // scores lower.
  const topDeal = [...DEALS].sort((a, b) => dealScore(b) - dealScore(a))[0];
  const topParts = scoreParts(topDeal);
  const inflatedDeal = DEALS.find((deal) => deal.verdict === 'inflated');
  const inflatedParts = scoreParts(inflatedDeal);
  const workedExamples =
    topDeal && inflatedDeal
      ? `<p>Worked in full on two deals from the list itself: the ${esc(topDeal.name)} is ${topParts.pct}% off
    with a ${verdictLabel(topDeal.verdict).toLowerCase()} verdict, so round(${topParts.pct} &times; 0.75 + ${topParts.verdictPoints}) = ${topParts.score}.
    The ${esc(inflatedDeal.name)} is ${inflatedParts.pct}% off but earns only ${inflatedParts.verdictPoints} verdict points,
    so round(${inflatedParts.pct} &times; 0.75 + ${inflatedParts.verdictPoints}) = ${inflatedParts.score} — the bigger percentage scores lower,
    because its anchor price is nominal. Every deal page shows this same working for its own score.</p>`
      : '';
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
    <p>Each deal scores out of 100 by one fixed formula: score = round(discount % × 0.75 + verdict points),
    capped at 100, where the verdict points are 30 for a new low, 22 for a strong price, 10 for a fair price
    and 2 for an inflated anchor. So 40% off with a strong-price verdict scores round(40 × 0.75 + 22) = 52,
    while 30% off a genuine new low scores round(30 × 0.75 + 30) = 53 — a modest discount on a real low
    outranks 60% off an inflated anchor, which scores only round(60 × 0.75 + 2) = 47. The score is computed
    from the deal's two prices every time it is shown, never stored, and every deal page shows its score
    next to the same explanation in short form.</p>
    ${workedExamples}
    <h2>The fine print</h2>
    <p>Prices were true when checked and can change or sell out at any time — the store page is always the
    final word. "Usual price" is the list or comparable-value price shown next to the sale price by the store
    or the source. Store links open the product at the store in a new tab; this site sells nothing itself and
    holds no stock.</p>
    <h2>Sources the prices were read from</h2>
    <ul class="source-list">${sourceItems}</ul>
  </article>`;
}
