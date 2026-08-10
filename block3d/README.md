# Block3D Project Page

Static project page for **Block3D: Efficient Text-to-3D Generation via Block-Wise Diffusion**.

## Preview

Run a static server from this directory. A server with HTTP Range support is recommended for responsive video chapter seeking.

```powershell
npx --yes http-server -p 4178 -a 127.0.0.1 -c-1 .
```

Then open `http://127.0.0.1:4178/`.

## Deploy

The page has no build step. Publish `index.html`, `styles.css`, `script.js`, and `assets/` to GitHub Pages or any static web server.

This project page is published from the `block3d/` subdirectory of the public `AlexanderTsui.github.io` repository at:

`https://alexandertsui.github.io/block3d/`

The supplementary MP4 is hosted as the public GitHub Release asset `block3d-project-page-assets-v1` to keep the Pages commit lightweight while retaining HTTP Range support.

## Before public release

- Replace the placeholder author metadata in `index.html` with the final author list and links.
- Update the BibTeX entry in `index.html`.
- Replace the `Code` and `Weights` placeholders when public URLs are available.
- Update the project metadata when the publication status changes.
