# Sticky scroll templates

These templates are intended for use in News feature articles on science.org. They are built on [scrollama](https://github.com/russellsamora/scrollama).

## Setup

### Basic template

The `scroll-container` div should be nested inside the **wider than column** image template, with an `id` on the wrapper:

```html
<div id="f1" class="news-article__figure--page-width">
  <figure class="news-article__figure border-light-gray plain border-bottom pb-3">
    <div class="news-article__figure__image__wrapper">
      <div class="news-article__figure__image mb-2">
        <section id="scroll-container">
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
        </section>
      </div>
    </div>
    <figcaption class="news-article__figure__caption"><span class="text-sm text-gray letter-spacing-default"><span class="text-xxs text-uppercase">...</span></figcaption>
  </figure>
</div>
```

### Calling stickyScroll()

```
stickyScroll(figureId, [aspectRatio]);
```
**figureId**
The `id` of the figure wrapper. Must be unique for each sticky scroll on the page.

**aspectRatio**
Optional. Width / height. If not specified, it will be calculated from the width and height of the first image.

## Options

**Width**
Can be used with either of the wider than column templates:
- `news-article__figure--page-width`
- `news-article__figure--container-width`

**Caption color**
Can be changed by adding a class to `.scroll-captions`:
- Default: dark text on white background
- `scroll-captions--on-dark`: white text on dark background

**Caption position**
By default, captions are positioned to the left. 

The following classes can be added to `.scroll-captions` to change the caption position: 
- `scroll-captions--right` 
- `scroll-captions--center`

The following classes can be added to an individual `.step` to change the position for that step. This will override the position set at the `.scroll-captions` level.
- `step--left`
- `step--right`
- `step--center`

**Variations**
Classes can be added to `#scroll-container` for variations.
- Default: Image is sized to fit within the viewport. Captions appear on top of image. Images transition via fade.
- `image-right`: Image shifts right on desktop, with captions displaying to the left.
- `no-animation`: Used with `image-right`. Removes the shift-right animation; image is positioned to the right from the start. 
- `force-fill`: Image fills full height of viewport. Will result in part of the image being hidden depending on viewport dimensions. Should only be used with `news-article__figure--page-width`, not `container-width`.
- `wipe`: Adds a wipe transition between images which progresses as user scrolls.

**Focus point**
The `object-position` CSS property can be used on the `img` as an approximate "focus point", helpful when using the `force-fill` option.
```html
<img style="object-position: 45% 40%" src="..." />
```

## Image progression
Images are layered, so transparent PNGs can be used to gradually add annotations/layers.

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

To have multiple captions scroll over the same image within a scrolly, include an empty `img` for each corresponding step:

```html
<figure>
  <img src="..." />
  <img />
  <img src="..." />
</figure>
<div class="scroll-captions">
  <div class="step">Caption 1 scrolls over Image 1</div>
  <div class="step">Caption 2 reveals an empty image, leaving Image 1 visible</div>
  <div class="step">Caption 3 reveals Image 3</div>
</div>

```

