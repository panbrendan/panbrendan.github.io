# panbrendan.github.io

Personal site. Plain HTML/CSS/JS, no build step: push to `main` and GitHub Pages deploys it.

Preview locally (the pages fetch JSON, so they need a server):

```sh
python3 -m http.server 8000
```

## Adding a project

Add an entry to `data/projects.json`, in the order you want it shown. Entries with `"featured": true`
show as app tiles on the home page and as full rows on the Projects page; the rest go under
"From the archive". The first link is the main one (the App Store, for apps): it's the dark button
on the Projects page and the pill on the home tile.

```json
{
  "name": "My Project",
  "featured": true,
  "kind": "Puzzle game · iOS",
  "year": "2026",
  "tagline": "One short line.",
  "description": "A paragraph or two.",
  "highlights": ["Optional bullet", "Another"],
  "tags": ["JavaScript"],
  "icon": "images/projects/icons/my-project.jpg",
  "image": "images/projects/my-project.jpg",
  "imageAlt": "What the image shows",
  "imagePosition": "center top",
  "gallery": [{ "src": "images/projects/extra.jpg", "alt": "..." }],
  "links": [{ "label": "App Store", "url": "https://apps.apple.com/us/app/..." }]
}
```

`icon`, `image`, `imagePosition`, `highlights` and `gallery` only matter for featured projects.
Icons are 256x256 JPGs (the CSS rounds the corners); the live App Store icon is at
`https://itunes.apple.com/lookup?id=APP_ID` under `artworkUrl512`. Cover images display at
about 2:1, so 1024x500 store feature graphics fit perfectly. Gallery screenshots are 414x900.

## Adding a photo album

1. Put a 3200px copy of each photo in `images/NEW_ALBUM/` and a 1400px copy, with the same
   filename, in `images/NEW_ALBUM/thumbnails/`.
   **Strip the metadata first.** Phone photos carry GPS coordinates, and anything in `images/`
   is public. Re-saving through Pillow without `exif=` drops it while keeping the colour profile:
   ```python
   from PIL import Image, ImageOps
   im = Image.open(src); icc = im.info.get('icc_profile')
   im = ImageOps.exif_transpose(im).convert('RGB'); im.thumbnail((3200, 3200)); im.info = {}
   im.save(dst, 'JPEG', quality=86, optimize=True, progressive=True, icc_profile=icc)
   ```
   (`sips` keeps the GPS data, so don't use it for photos.)
2. Add the album to `data/photos.json`. Albums show newest first, in file order. A photo is a
   filename, captioned from the name (`lake_needwood.jpg` shows as "Lake Needwood"), or an
   object with its own caption:
   ```json
   { "name": "My Album", "directory": "NEW_ALBUM",
     "photos": ["lake_needwood.jpg", { "file": "mt_fuji.jpg", "caption": "Mt. Fuji" }] }
   ```

The grid loads thumbnails and the lightbox upgrades to full resolution. If a thumbnail is
missing, the grid falls back to the full-size file.
