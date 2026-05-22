// Nav: backdrop on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

// Projects loader — only runs on projects.html
if (document.getElementById('project-grid')) {
  fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
      const grid = document.getElementById('project-grid');
      projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const tagsHTML = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
        const linksHTML = [
          p.url    ? `<a href="${p.url}"    class="project-link" target="_blank" rel="noopener noreferrer">Live</a>`   : '',
          p.github ? `<a href="${p.github}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''
        ].filter(Boolean).join('');

        card.innerHTML =
          `<div class="project-name">${p.name}</div>` +
          `<div class="project-desc">${p.description}</div>` +
          `<div class="project-tags">${tagsHTML}</div>` +
          (linksHTML ? `<div class="project-links">${linksHTML}</div>` : '');

        grid.appendChild(card);
      });
    })
    .catch(console.error);
}
