// The arithmetic behind every number the site shows, in one place so a price
// can never disagree with itself: the discount percentage and the saving are
// always computed from the deal's two prices, never stored, and the deal
// score is a fixed formula of the discount and the verdict, explained on the
// method page.

export const VERDICTS = {
  'new-low': { label: 'New low', weight: 30 },
  strong: { label: 'Strong price', weight: 22 },
  fair: { label: 'Fair price', weight: 10 },
  inflated: { label: 'Inflated anchor', weight: 2 },
};

export function discountPct(deal) {
  return Math.round((1 - deal.price / deal.usual) * 100);
}

export function savings(deal) {
  return Math.round((deal.usual - deal.price) * 100) / 100;
}

// Score out of 100: three quarters of it is the discount percentage, the
// rest is the verdict's weight, so a modest discount on a genuinely new low
// can outrank a huge discount off an anchor price nobody pays.
export function dealScore(deal) {
  const weight = (VERDICTS[deal.verdict] || VERDICTS.fair).weight;
  return Math.min(100, Math.round(discountPct(deal) * 0.75 + weight));
}

export function formatMoney(value) {
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return '$' + text.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function verdictLabel(verdict) {
  return (VERDICTS[verdict] || VERDICTS.fair).label;
}
