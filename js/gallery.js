let allPhotos = [];
let currentIndex = 0;

fetch('data/photos.json')
  .then(r => r.json())
  .then(albums => {
    buildFilters(albums);
    buildGallery(albums);
    initLightbox();
  })
  .catch(console.error);

function buildFilters(albums) {
  const nav = document.getElementById('filter-nav');
  albums.forEach(album => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = album.directory;
    btn.textContent = album.name;
    nav.appendChild(btn);
  });

  nav.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    nav.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterAlbums(btn.dataset.filter);
  });
}

function filterAlbums(filter) {
  document.querySelectorAll('.album').forEach(section => {
    section.classList.toggle('hidden', filter !== 'all' && section.dataset.album !== filter);
  });
}

function buildGallery(albums) {
  const gallery = document.getElementById('gallery');
  allPhotos = [];

  albums.forEach(album => {
    const section = document.createElement('section');
    section.className = 'album';
    section.dataset.album = album.directory;

    const header = document.createElement('div');
    header.className = 'album-header';
    const title = document.createElement('h2');
    title.className = 'album-title';
    title.textContent = album.name;
    const count = document.createElement('span');
    count.className = 'album-count';
    count.textContent = `${album.photos.length} photo${album.photos.length !== 1 ? 's' : ''}`;
    header.append(title, count);

    const grid = document.createElement('div');
    grid.className = 'photo-grid';

    album.photos.forEach(filename => {
      const src = `images/${album.directory}/${filename}`;
      const thumb = `images/${album.directory}/thumbnails/${filename}`;
      const caption = filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
      const index = allPhotos.length;
      allPhotos.push({ src, thumb, caption });

      const item = document.createElement('button');
      item.className = 'photo-item';
      item.setAttribute('aria-label', `Open ${caption}`);

      const img = document.createElement('img');
      img.alt = caption;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => img.classList.add('loaded'));
      // Fall back to the full-size image if no thumbnail was generated
      img.addEventListener('error', () => { if (img.src.includes('/thumbnails/')) img.src = src; }, { once: true });
      img.src = thumb;
      if (img.complete && img.naturalWidth) img.classList.add('loaded');

      const cap = document.createElement('span');
      cap.className = 'cap';
      cap.textContent = caption;

      item.append(img, cap);
      item.addEventListener('click', () => openLightbox(index));
      grid.appendChild(item);
    });

    section.append(header, grid);
    gallery.appendChild(section);
  });
}

function initLightbox() {
  const lb = document.getElementById('lightbox');

  document.querySelector('.lb-close').addEventListener('click', closeLightbox);
  document.querySelector('.lb-prev').addEventListener('click', () => navigate(-1));
  document.querySelector('.lb-next').addEventListener('click', () => navigate(1));

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lb-content')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

function openLightbox(index) {
  currentIndex = index;
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showPhoto(index);
  document.querySelector('.lb-close').focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + allPhotos.length) % allPhotos.length;
  const img = document.getElementById('lb-img');
  img.classList.add('fading');
  setTimeout(() => {
    showPhoto(currentIndex);
    img.classList.remove('fading');
  }, 150);
}

function showPhoto(index) {
  const { src, thumb, caption } = allPhotos[index];
  const img = document.getElementById('lb-img');
  // Show the thumbnail instantly, then swap in full resolution once loaded
  img.src = thumb;
  img.alt = caption;
  const full = new Image();
  full.onload = () => { if (allPhotos[currentIndex].src === src) img.src = src; };
  full.src = src;
  document.getElementById('lb-caption').textContent = caption;
}
