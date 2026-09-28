// Nav: backdrop on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) {
    a.classList.add('active');
    a.setAttribute('aria-current', 'page');
  }
});

// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

const setMenu = open => {
  navLinks.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
};

toggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Theme toggle: follows the OS until the visitor picks one
document.getElementById('theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Reveal-on-scroll
const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' })
  : null;

function reveal(el) {
  if (observer) observer.observe(el);
  else el.classList.add('in');
}

document.querySelectorAll('.reveal').forEach(reveal);

// Projects: rendered from data/projects.json on the home and projects pages
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ext = 'target="_blank" rel="noopener noreferrer"';
const tagList = tags => `<ul class="tags">${tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
const imgPos = p => p.imagePosition ? ` style="object-position:${esc(p.imagePosition)}"` : '';
const metaLine = p => [p.kind, p.year].filter(Boolean).map(esc).join(' &middot; ');

function featuredCard(p) {
  const href = p.links[0] ? p.links[0].url : 'projects.html';
  const external = /^https?:/.test(href);
  return `
    <a class="card" href="${esc(href)}" ${external ? ext : ''}>
      <div class="card-media"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy"${imgPos(p)}></div>
      <div class="card-body">
        <div class="card-meta"><span class="eyebrow">${metaLine(p)}</span></div>
        <h3 class="card-title">${esc(p.name)} <span class="arrow-ne">${external ? '&nearr;' : '&rarr;'}</span></h3>
        <p class="card-text">${esc(p.tagline)}</p>
        ${tagList(p.tags)}
      </div>
    </a>`;
}

function featureRow(p, i) {
  const gallery = (p.gallery || []).length
    ? `<div class="feature-gallery">${p.gallery.map(g =>
        `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">`).join('')}</div>`
    : '';
  const links = p.links.length
    ? `<div class="feature-links">${p.links.map((l, j) =>
        `<a class="btn${j === 0 ? ' btn-primary' : ''}" href="${esc(l.url)}" ${ext}>${esc(l.label)} <span class="arrow-ne">&nearr;</span></a>`).join('')}</div>`
    : '<p class="feature-note">Links coming soon.</p>';

  return `
    <article class="feature reveal" id="${esc(p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">
      <div class="feature-media">
        <div class="feature-hero"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy"${imgPos(p)}></div>
        ${gallery}
      </div>
      <div>
        <p class="feature-num">${String(i + 1).padStart(2, '0')} &nbsp;/&nbsp; ${metaLine(p)}</p>
        <h2>${esc(p.name)}</h2>
        <p class="feature-tagline">${esc(p.tagline)}</p>
        <p class="feature-desc">${esc(p.description)}</p>
        <ul class="feature-list">${(p.highlights || []).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
        ${tagList(p.tags)}
        ${links}
      </div>
    </article>`;
}

function minorCard(p) {
  const link = p.links[0];
  const tag = link ? 'a' : 'div';
  const attrs = link ? ` href="${esc(link.url)}" ${ext}` : '';
  return `
    <${tag} class="minor"${attrs}>
      <span class="eyebrow">${metaLine(p)}</span>
      <h3>${esc(p.name)} ${link ? '<span class="arrow-ne">&nearr;</span>' : ''}</h3>
      <p>${esc(p.description)}</p>
      ${tagList(p.tags)}
    </${tag}>`;
}

function renderInto(el, html) {
  el.innerHTML = html;
  el.querySelectorAll('.reveal').forEach(reveal);
}

const featuredGrid = document.getElementById('featured-grid');
const featuresEl = document.getElementById('project-features');
const minorEl = document.getElementById('project-minor');

if (featuredGrid || featuresEl) {
  fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
      const featured = projects.filter(p => p.featured);
      const rest = projects.filter(p => !p.featured);
      if (featuredGrid) renderInto(featuredGrid, featured.map(featuredCard).join(''));
      if (featuresEl) renderInto(featuresEl, featured.map(featureRow).join(''));
      if (minorEl) renderInto(minorEl, rest.map(minorCard).join(''));
    })
    .catch(console.error);
}
