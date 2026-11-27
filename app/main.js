// Router: three hash routes, each view in its own module. The list view is
// imported statically so the front page paints in one load; the deal and
// method views load only when visited.
//   #/              the deal list        #/c/<category>  list, filtered
//   #/deal/<id>     one deal in full     #/about         how deals are checked
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { renderList } from './view-list.js';

const app = document.getElementById('app');

async function render() {
  window.__shotReady = false;
  const parts = location.hash.replace(/^#\//, '').split('/');
  document.querySelectorAll('.site-nav a').forEach((a) => a.classList.remove('active'));
  if (parts[0] === 'deal' && parts[1]) {
    const mod = await import('./view-deal.js');
    mod.renderDeal(app, parts[1]);
  } else if (parts[0] === 'about') {
    document.querySelector('[data-nav="about"]')?.classList.add('active');
    const mod = await import('./view-about.js');
    mod.renderAbout(app);
  } else {
    document.querySelector('[data-nav="deals"]')?.classList.add('active');
    renderList(app, parts[0] === 'c' ? parts[1] : null);
  }
  window.scrollTo(0, 0);
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}

window.addEventListener('hashchange', render);
render();
