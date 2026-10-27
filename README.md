# zenwyn-naicker.github.io

My personal website: https://zenwyn-naicker.github.io

A single static page hosted on GitHub Pages, with no build step or dependencies.

## Structure

| Path | Contents |
| --- | --- |
| `index.html` | Page content |
| `assets/css/style.css` | Styles |
| `assets/js/main.js` | Hero background, project demos and timeline |
| `assets/video/` | Looping demo clips and their poster frames |
| `assets/projects/` | Phone screenshots for the two animated mobile demos |
| `assets/img/` | Profile photo and link preview image |
| `assets/docs/` | CV |

Most project demos are short muted video loops cut from the full demo videos. The two small phone demos are configured in the `DEMOS` object in `main.js`: a list of screenshots with optional tap targets, scrolling and transitions.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.
