# Drew David S. Abanilla — Artist & Author

A personal portfolio showcasing Drew's illustrations, graphic design, animations, stories, published books, and achievements. Explore interactive galleries and story readers, or get in touch through the contact links.

Live site: https://drew-david-s-abanilla-profile-syste.vercel.app/

Each book and reading view has its own shareable URL. The selected chapter or page appears in the reader URL, and browser Back returns to the previous view.

## Project files

- `index.html` contains the page structure.
- `styles.css` contains the site styles.
- `js/data.js` contains portfolio text, artwork, and book data.
- `js/app.js` renders the site and handles its interactions.
- Loader overlay: inline `#loaderEl` block at the top of `index.html`
  (markup + `<style>` + self-contained `<script>`). It shows a navy/gold
  spinner with a progress bar, hides on the `portfolio:ready` event that
  `js/app.js` fires after first render (plus `window load`, with timeout
  fallbacks), and respects `prefers-reduced-motion`. Keep the copy in the
  repo-root `index.html` (Perchance entry point, paths under `src/`) in sync
  when the loader changes.

## Entry points

- Vercel serves this folder as root: absolute paths (`/styles.css`,
  `/js/app.js`, page-relative asset names in `js/data.js`).
- Perchance preview uses the repo-root `index.html`, which mirrors this file
  with `src/`-prefixed paths. `js/app.js` auto-detects that case from its own
  module URL (`…/src/js/app.js`) and prefixes every asset key
  (`img`, `backdrop`, `file`, `pageDir`, `pdf`, `bookCover`) plus
  `profile.png`, so no data edits are needed per host.
