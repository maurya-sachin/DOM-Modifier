# DOM Modifier

A Chrome extension that lets you inject custom CSS into any website. You define rules — pick a URL pattern, a CSS selector, write your styles — and the extension applies them automatically whenever you visit a matching page.

I built this because I kept needing to fix z-index issues and hide annoying elements on sites I use daily, and I got tired of opening DevTools every time.

## How it works

- You create **rules** from the options page. Each rule has:
  - A **URL pattern** (supports wildcards like `*example.com*`)
  - A **CSS selector** (e.g. `.sidebar`, `#ad-banner`)
  - **CSS declarations** (e.g. `display: none !important;`)
- When you visit a page, the content script checks which rules match the current URL and injects `<style>` tags into the page
- Rules update live — no need to refresh the page after toggling a rule on/off
- Works on SPAs too (handles `pushState`, `replaceState`, `popstate`, `hashchange`)

## Install

1. Clone this repo
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder

No build step, no dependencies. It's plain JS.

## Project structure

```
manifest.json
src/
  shared/
    theme.css          # shared CSS variables and toggle component
    storage.js         # chrome.storage.local wrapper
    urlMatcher.js      # wildcard URL pattern matching
  content/
    content.js         # injects matching CSS rules into pages
  background/
    background.js      # opens options page on first install
  popup/
    popup.html/css/js  # toolbar popup with quick toggle
  options/
    options.html/css/js # full rule management UI
```

## Usage

- Click the extension icon to toggle it on/off globally
- Click **Open Settings** to manage rules
- Add a rule:
  - **URL Pattern**: `*localhost:3000*` or `*github.com*` — use `*` as a wildcard
  - **CSS Selector**: any valid CSS selector
  - **CSS**: whatever styles you want to apply
- Toggle individual rules on/off, edit, or delete them from the rules list

## Tech

- Chrome Manifest V3
- Vanilla JS (no framework, no build tools)
- `chrome.storage.local` for persistence
- Dark theme UI

## License

MIT
