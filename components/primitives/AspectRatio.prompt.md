**Purpose** — reserves proportional space before its content loads, so media, maps, video and iframes never shift the layout.

**Properties** — `ratio` named / 'w/h' / number · `radius` · `background` · children (stretched to fill).

**Variants** — square 1:1 avatars and tiles · video 16:9 default for embeds and cameras · wide 21:9 line-status banners · photo 4:3 · portrait 3:4.

**States** — none; the `background` token is what shows while the child loads.

**Accessibility** — a wrapper only. The child carries the alt text, title or label.

**Responsive rules** — always full width of its parent track; height follows from the ratio. Change the ratio at a breakpoint rather than fixing a height.

**Do** — Reserve the space before the media arrives, always.

**Don't** — don't set a height on it, don't wrap text in it, don't use it where the content's own size should win.

**Examples**
```jsx
<AspectRatio ratio="video" background="surface-sunken"><iframe title="Line 3 camera" /></AspectRatio>
```
