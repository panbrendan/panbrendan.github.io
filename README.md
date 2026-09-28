# panbrendan.github.io

Personal site. Plain HTML/CSS/JS, no build step: push to `main` and GitHub Pages deploys it.

Preview locally (the pages fetch JSON, so they need a server):

```sh
python3 -m http.server 8000
```

## Adding a project

Add an entry to `data/projects.json`. Entries with `"featured": true` show on the home page
and as full rows on the Projects page; the rest go under "From the archive".

```json
{
  "name": "My Project",
  "featured": true,
  "kind": "Browser game",
  "year": "2026",
  "tagline": "One short line.",
  "description": "A paragraph or two.",
  "highlights": ["Optional bullet", "Another"],
  "tags": ["JavaScript"],
  "image": "images/projects/my-project.jpg",
  "imageAlt": "What the image shows",
  "imagePosition": "center top",
  "gallery": [{ "src": "images/projects/extra.jpg", "alt": "..." }],
  "links": [{ "label": "Play it", "url": "https://example.com" }]
}
```

`image`, `imagePosition`, `highlights` and `gallery` only matter for featured projects.
Cover images display at about 2:1, so 1024x500 store feature graphics fit perfectly.

## Adding a photo album

1. Create `images/NEW_ALBUM/` and drop the full-size JPGs in it.
2. Generate web-sized versions with the same filenames:
   ```sh
   mkdir -p images/NEW_ALBUM/thumbnails
   for f in images/NEW_ALBUM/*.jpg; do
     sips -s format jpeg -s formatOptions 78 -Z 1400 "$f" --out images/NEW_ALBUM/thumbnails/$(basename "$f")
   done
   ```
3. Add the album to `data/photos.json`:
   ```json
   { "name": "My Album", "directory": "NEW_ALBUM", "photos": ["one.jpg", "two.jpg"] }
   ```

The grid loads thumbnails and the lightbox upgrades to full resolution. If a thumbnail is
missing, the grid falls back to the full-size file.
