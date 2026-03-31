# Sticky scroll templates

These templates are intended for use in News feature articles on science.org. They are built on [scrollama](https://github.com/russellsamora/scrollama).

## Setup

### Basic template

```html
<section id="scroll-1" class="scroll-wrapper">
  <div class="sticky-scroll">
    <figure>
      <img ... />
      <img ... />
      ...
    </figure>
    <div class="scroll-captions">
      <div class="step">...</div>
      <div class="step">...</div>
      ...
    </div>
  </div>
  <div class="credit">C. BICKEL/<i>Science</i></div>
</section>
```

### Calling stickyScroll()

```
stickyScroll(wrapperId, [aspectRatio]);
```
**wrapperId**
The `id` of the scroll wrapper. Must be unique for each sticky scroll on the page.

**aspectRatio**
Optional. Width / height. If not specified, it will be calculated from the width and height of the first image.

## Options

### Placement
Can be used as a [standalone section](https://jepajerowski.github.io/scrollEffects/docs/default.html) or [inside a figure](https://jepajerowski.github.io/scrollEffects/docs/imageRight.html).

#### Standalone section
```html
<section id="scroll-1" class="scroll-wrapper">
  <div class="sticky-scroll">
    <figure>...</figure>
    <div class="scroll-captions">...</div>
  </div>
  <div class="credit">C. BICKEL/<i>Science</i></div>
</section>
```

#### Inside figure
The `sticky-scroll` element should take the place of the `news-article__figure__image__wrapper` div in the figure template. Note: setting the figure to column-width, page-width or container-width will have no effect on the width of the sticky scroll.
```html
<figure id="scroll-1" class="news-article__figure border-light-gray">
  <figcaption class="news-article__figure__upper-caption mb-1x">
    <h3 class="text-lg letter-spacing-default">...</h3>
    <p>...</p>
  </figcaption>
  <div class="sticky-scroll">
    <figure>...</figure>
    <div class="scroll-captions">...</div>
  </div>
  <figcaption class="news-article__figure__caption">
    <span class="text-sm text-gray letter-spacing-default"><span class="text-xxs text-uppercase">C. BICKEL/<i>Science</i></span></span>
  </figcaption>
</figure>
```


### Variations
Classes can be added to `.sticky-scroll` for variations.
- Default: Sticky scroll is sized as close to full-width as it can be while still keeping the entire figure within the viewport. Captions appear on top of image. Images transition via fade. 
- `container-width`: The sticky scroll is limited to a max-width of 1110px.
- `image-right`: Image shifts right on desktop, with captions displaying to the left.
- `no-animation`: Used with `image-right`. Removes the shift-right animation; image is positioned to the right from the start. 
- `force-fill`: The sticky scroll fills full height and width of viewport. Will result in part of the image being hidden depending on viewport dimensions. Overrides `container-width` if used together.
- `wipe`: Adds a wipe transition between images which progresses as user scrolls.
- `no-layering`: Images swap instead of layering. See [Image Progression](#image-progression)

### Caption options

#### Caption color
Can be changed by adding a class to `.scroll-captions`:
- Default: dark text on white background
- `<div class="scroll-captions scroll-captions--on-dark">`: white text on dark background

#### Caption style
- Default: Styled as caption (sans serif)
- `<div class="scroll-captions scroll-captions--body">`: Styled as body text (serif)

#### Caption position
By default, captions are positioned to the left. 

The following classes can be added to `.scroll-captions` to change the caption position: 
- `scroll-captions--right` 
- `scroll-captions--center`

The following classes can be added to an individual `.step` to change the position for that step. This will override the position set at the `.scroll-captions` level.
- `step--left`
- `step--right`
- `step--center`

### Focus point
The `object-position` CSS property can be used on the `img` as an approximate "focus point", helpful when using the `force-fill` option.
```html
<img style="object-position: 45% 40%" src="..." />
```

## Image progression
### Default
Images stay visible and each successive image is layered over the last, so transparent PNGs can be used to gradually add annotations/layers.

The images and captions are 1 to 1, e.g. the second image is revealed as the second `step` scrolls over the image.

For a simple sticky scroll without any image changes, just include one `img`:
```html
<figure>
  <img src="..." />
</figure>
<div class="scroll-captions">
  <div class="step">...</div>
  <div class="step">...</div>
  ...
</div>
```

To have multiple captions scroll over the same image within a scrolly, include a transparent PNG or GIF as the `img` for each corresponding step, with an empty `alt` attribute:

```html
<figure>
  <img src="image1.png" alt="Image 1" />
  <img src="transparent.png" alt="" />
  <img src="image3.png" alt="Image 3" />
</figure>
<div class="scroll-captions">
  <div class="step">Caption 1 scrolls over Image 1</div>
  <div class="step">Caption 2 reveals an transparent image, leaving Image 1 visible</div>
  <div class="step">Caption 3 reveals Image 3</div>
</div>
```

### `no-layering` option

When `.sticky-scroll` has the class `no-layering`, images swap instead of layering. Each image is re-hidden as the associated step scrolls out of the viewport (with the exception of the first image, which is always visible). 

Add the class `visibility-sticky` to an individual image/layer to override and keep that image visible even once the user scrolls past it.

`no-layering` is currently not supported for `wipe` variation.


