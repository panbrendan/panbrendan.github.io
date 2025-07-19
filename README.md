# Photo Gallery

## Adding a new album

1. Create a folder `images/NEW_ALBUM_NAME`.
2. Drop your full-sized JPGs into that folder.
3. Generate thumbnails at ~300px wide and put them under
   `images/NEW_ALBUM_NAME/thumbnails/` with the *same* filenames.
4. Edit `data/photos.json`:
   ```json
   {
     "name": "My Album Title",
     "directory": "NEW_ALBUM_NAME",
     "photos": ["filename1.jpg", "filename2.jpg", ...]
   }
5. Commit & push - Github Pages will auto-deploy

---

#### Why this setup?

- **Flexibility**: Albums + photos live in JSON; adding is a 1-line edit.
- **Performance**: Thumbnails in a grid, full-res served only on demand.
- **Theme**: Dark, minimal, responsive, with lightbox details.
- **Zero build step**: Pure HTML/CSS/JS → instant deploy on any GitHub Pages.

Feel free to tweak colors in `style.css` and swap out Lightbox for any other gallery script!
