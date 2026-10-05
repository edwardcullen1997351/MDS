**Purpose** — raster media with reserved space, an explicit fit rule and a striped fallback. An Image in Meridian never renders a broken-image glyph and never shifts the page.

**Properties** — `src alt ratio fit position radius background loading placeholder width height`.

**Variants** — ratio-locked (pass `ratio` — the default for anything in a grid or card) · intrinsic (no ratio, for logos and diagrams whose own size is correct) · placeholder (no `src`, or a failed load: diagonal stripes with a mono caption).

**States** — loading (background token showing) · loaded · error (falls back to the placeholder automatically).

**Accessibility** — `alt` is required for meaningful images and must describe the information, not the file. Decorative images pass `alt=""`. Text baked into an image must also exist as real text nearby.

**Responsive rules** — fills its container's width. Use `fit="cover"` for photography and `fit="contain"` for logos and screenshots, which must not crop. `loading="eager"` only above the fold.

**Do** — Always give a ratio and real alt text; let the placeholder cover the failure case.

**Don't** — don't ship an Image without `alt`, don't crop faces or gauges with `cover`, don't use Image for icons (that is Icon) or for decorative gradients.

**Examples**
```jsx
<Image src="/press/line-3.jpg" alt="Assembly line 3 during changeover" ratio="video" />
<Image ratio="square" placeholder="operator avatar" />
```
