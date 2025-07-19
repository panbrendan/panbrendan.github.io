// Fetch your manifest and build each album
fetch('data/photos.json')
  .then(r => r.json())
  .then(albums => {
    const gallery = document.getElementById('gallery');
    albums.forEach(({ name, directory, photos }) => {
      // Album title
      const section = document.createElement('section');
      const h2 = document.createElement('h2');
      h2.textContent = name;
      section.appendChild(h2);

      // Thumbnail grid
      const grid = document.createElement('div');
      grid.className = 'photo-grid';

      photos.forEach(filename => {
        const link = document.createElement('a');
        link.href = `images/${directory}/${filename}`;
        link.setAttribute('data-lightbox', directory);
        link.setAttribute('data-title', name);

        const img = document.createElement('img');
        img.src = `images/${directory}/${filename}`;
        img.alt = filename;

        link.appendChild(img);
        grid.appendChild(link);
      });

      section.appendChild(grid);
      gallery.appendChild(section);
    });
  })
  .catch(console.error);
