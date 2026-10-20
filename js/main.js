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
const slug = p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const icon = (p, cls, size) => p.icon
  ? `<img class="${cls}" src="${esc(p.icon)}" alt="" width="${size}" height="${size}" loading="lazy">`
  : '';

// Home: one tile per app; the tile opens its write-up, the pill opens the store
function appCard(p) {
  const link = p.links[0];
  return `
    <article class="app">
      ${icon(p, 'app-icon', 60)}
      <p class="app-kind">${esc(p.kind)}</p>
      <h3 class="app-name"><a href="projects.html#${slug(p)}">${esc(p.name)}</a></h3>
      <p class="app-tagline">${esc(p.tagline)}</p>
      ${link ? `<a class="app-store" href="${esc(link.url)}" ${ext}>${esc(link.label)} <span class="arrow-ne">&nearr;</span></a>` : ''}
    </article>`;
}

function indexChip(p) {
  return `<a href="#${slug(p)}">${icon(p, 'chip-icon', 24)}${esc(p.name)}</a>`;
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
    <article class="feature reveal" id="${slug(p)}">
      <div class="feature-media">
        <div class="feature-hero"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy"${imgPos(p)}></div>
        ${gallery}
      </div>
      <div>
        <div class="feature-head">
          ${icon(p, 'feature-icon', 64)}
          <div>
            <p class="feature-num">${String(i + 1).padStart(2, '0')} &nbsp;/&nbsp; ${metaLine(p)}</p>
            <h2>${esc(p.name)}</h2>
          </div>
        </div>
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

const appGrid = document.getElementById('app-grid');
const indexEl = document.getElementById('app-index');
const featuresEl = document.getElementById('project-features');
const minorEl = document.getElementById('project-minor');

if (appGrid || featuresEl) {
  fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
      const featured = projects.filter(p => p.featured);
      const rest = projects.filter(p => !p.featured);
      if (appGrid) renderInto(appGrid, featured.map(appCard).join(''));
      if (indexEl) renderInto(indexEl, featured.map(indexChip).join(''));
      if (featuresEl) {
        renderInto(featuresEl, featured.map(featureRow).join(''));
        // Content arrives after load, so honour a #project link once it exists
        const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) { target.classList.add('in'); target.scrollIntoView(); }
      }
      // The archive section only shows when there are non-featured projects
      if (minorEl) {
        if (rest.length) renderInto(minorEl, rest.map(minorCard).join(''));
        else minorEl.closest('section').remove();
      }
    })
    .catch(console.error);
}
