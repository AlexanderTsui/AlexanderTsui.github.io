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

## Resources

- Code: <https://github.com/ziplab/Block3D>
- Project page: <https://alexandertsui.github.io/block3d/>
- Weights are not redistributed; see the code repository README for the required
  upstream initialization files.
