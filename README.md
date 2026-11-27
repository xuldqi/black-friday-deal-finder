# black-friday-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/xuldqi/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/xuldqi/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

RealDeal is a Black Friday and Cyber Monday deal finder whose deals were found and price-checked one by one on Black Friday, Fri 27 Nov 2026 (a main round in the morning and a second round later that morning; each deal shows the time its own price was read). It lists 32 real deals — TVs, headphones, laptops, phones, tablets, gaming, smart home gear and storage at Amazon, Best Buy and B&H — each with its product, store, a link to the product at that store, its sale price, its usual price, the discount worked out from those two prices, the time it was checked, the source the price was read from, and an honest verdict (new low, strong price, fair price, or inflated anchor) with the evidence behind it. Search and filters by category, store and discount all work, deals can be sorted five ways, some products are compared across stores, and every deal page shows the full arithmetic, including how its deal score is built from its own discount and verdict. Plain static files, no build step, no network calls: the deals are data in the repository and every figure is computed by the site's own code.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser.

---
<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
