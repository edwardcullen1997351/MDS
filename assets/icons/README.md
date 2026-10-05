# assets/icons/

**Empty, and it is the last thing standing between this system and an offline release.**

`Icon` resolves every glyph as `basePath + name + '.svg'`, and the default base path is the
pinned CDN `https://unpkg.com/lucide-static@0.469.0/icons/`. That works on a normal page and
fails in exactly the environments a console system gets deployed into: an air-gapped plant
network, a strict `img-src` CSP, or a browser with no route to unpkg. The failure is quiet —
every glyph renders as an empty box, the layout is unchanged, and nothing throws.

`Icon.setBasePath()` has existed since the component shipped. The files it should point at have
not.

## Vendoring, in three steps

```sh
npm i -D lucide-static@0.469.0          # the version Icon.jsx pins
cp node_modules/lucide-static/icons/*.svg assets/icons/
```

```js
// once, at app startup — before the first render
Icon.setBasePath('/assets/icons');
```

Keep the version pinned to the one in `components/core/Icon.jsx`. Lucide renames glyphs between
minors (`more-horizontal` → `ellipsis`, `alert-triangle` → `triangle-alert`), and a rename is
another silent empty box.

## Copying only what is used

The full set is ~1,500 files. To vendor just this system's glyphs, generate the list from source
rather than maintaining it by hand — it goes stale the first time someone adds a Button:

```sh
grep -rhoE "(icon|iconLeft|iconRight|name)[:=] *['\"][a-z][a-z0-9-]*['\"]" \
  components/ templates/ \
  | grep -oE "['\"][a-z][a-z0-9-]*['\"]" | tr -d "\"'" | sort -u > icons.used
```

Filter that against `ls node_modules/lucide-static/icons/` before copying — the pattern also
catches `variant`/`size`/`tone` string values, which are not glyphs and have no file.

Glyphs the system's own components request internally, which must be present whatever the
product uses: `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `check`, `x`,
`search`, `calendar`, `loader`, `square`, `square-check`, `circle`, `triangle-alert`, `info`,
`ellipsis`, `arrow-up`, `arrow-down`.

## Why these are not inlined

Every other approach was considered and is worse. Inlining the used set into the bundle at build
time couples icon choice to a rebuild, so a product cannot use a glyph the design system did not
predict. Committing SVG source into `Icon.jsx` as a path registry makes the component a
data file and puts a licence text in the middle of a React component. Fetching and caching at
runtime is what happens today and is precisely the thing that fails offline.

Lucide is ISC-licensed; vendoring the files requires keeping `LICENSE` alongside them.
