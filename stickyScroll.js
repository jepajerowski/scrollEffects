var headerHeight = 56;
var scrollyOffset = 0.5;

const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleHide(element, isHidden) {
  element.classed('scrolly-hidden', isHidden);
  //element.attr('aria-hidden', isHidden);
}

function stickyScroll(figureId, aspectRatio = null) {

  var prevWidth = window.innerWidth;

  var availableHeight = window.innerHeight - headerHeight;

  var wrapper = d3.select('#' + figureId);
  var scrolly = wrapper.select('#scroll-container');
  var scrollParent = scrolly.node().parentNode;
  var figure = scrolly.select('figure');
  var captions = scrolly.select('.scroll-captions');
  var step = captions.selectAll('.step');
  var firstStep = captions.select('.step:first-child');
  var lastStep = captions.select('.step:last-child');
  var images = figure.selectAll('img');
  var baseImage = figure.select('img:first-child');

  //get image width and height if not provided
  if (!aspectRatio) {
    aspectRatio = baseImage.node().naturalWidth / baseImage.node().naturalHeight;

    if (!aspectRatio) {
      baseImage.node().addEventListener('load', () => {
        aspectRatio = baseImage.node().naturalWidth / baseImage.node().naturalHeight;
        scrolly.classed('stop-transitions', true);
        resizeScrolly();
        setUpScroller();
        scrolly.classed('stop-transitions', false);
      });
    }
  }


  //set boolean values for variations
  var isImageRight = scrolly.classed('image-right');
  var isForceFill = scrolly.classed('force-fill');
  var isWipe = (scrolly.classed('wipe') && !isReduced);

  // wrap each step contents
  step.each(function(d, i) {
    thisStep = d3.select(this);
    thisStep.attr("id", "step-" + i);
    var stepInner = thisStep.append("div").attr("class", "step-inner");
    thisStep.selectAll(':scope > :not(.step-inner)').each(function() {
      stepInner.node().appendChild(this);
    });
  });

  //wrap images
  var imageWrapper = figure.append("div").attr("class", "image-wrapper").attr("aria-live", "polite");
  images.each(function(d, i) {
    d3.select(this).attr("aria-describedby", "step-" + i);
    imageWrapper.node().appendChild(this);
  });


  // setting initial opacity & wipe placement 
  if (isWipe) {
    images.style('clip-path', updateClipPath(0));
    baseImage.style('clip-path', updateClipPath(1));
  } else {
    toggleHide(figure.selectAll('img:not(:first-child)'), true);
  }


  var scroller = scrollama();


  //throttle with additional call at end using arguments from last call
  function throttle(callback, delay) {
    let waiting = false;
    return function() {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(function() {
          waiting = false;
          callback.apply(this, arguments);
        }, delay);
      }
    }
  }


  function debounce(callback, delay) {
    let timer = null;
    return function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        callback.apply(this, arguments);
        timer = null;
      }, delay);
    }
  }


  let debouncedResize = debounce(() => {
    setUpScroller();
    scrolly.classed('stop-transitions', false);
  }, 200);

  let throttledReset = throttle(resetVisibility, 500);




  // only run resize if width changes (prevent jumpiness on mobile) 
  function handleResize() {
    var currentWidth = window.innerWidth;
    if (currentWidth !== prevWidth) {
      prevWidth = currentWidth;

      scrolly.classed('stop-transitions', true);
      resizeScrolly();
      debouncedResize();
      // remove stop-transitions class in debouncedResize
    }
  }


  //updateClipPath(1) = fully visible, updateClipPath(0) = fully hidden
  function updateClipPath(progress) {
    var maskEdge = (1 - (progress * 2 - 1)) * 100;
    var newClipPath = "polygon(0 " + maskEdge + "%, 100% " + maskEdge + "%, 100% 100%, 0% 100%)";
    return newClipPath;
  }

  // reset step visibility in case of resize or reload mid-scroll
  function resetVisibility(response) {
    if (response) {
      console.log('reset visibility', response);

      if (isWipe) {
        images.filter((d, i) => i <= response.index).style('clip-path', updateClipPath(1));
        if (response.direction === 'up') {
          images.filter((d, i) => i = response.index + 1).style('clip-path', updateClipPath(1));
          images.filter((d, i) => i > response.index + 1).style('clip-path', updateClipPath(0));
        }
      } else {
        toggleHide(images.filter((d, i) => i < response.index), false);
        toggleHide(images.filter((d, i) => i > response.index && i > 0), true);
      }
    }
  }

  function resizeScrolly() {

    headerHeight = $(".main-header").outerHeight();
    var availableHeight = window.innerHeight - headerHeight;

    var scrollyWidth = scrolly.node().offsetWidth;
    var figureWidth = figure.node().offsetWidth;
    var scrollParentWidth = scrollParent.offsetWidth;
    var figureHeight;
    var figureWidthAsPercent = figureWidth / scrollyWidth;


    //set new values
    scrollyWidth = scrollParentWidth;

    if (isForceFill) {
      figureWidth = scrollParentWidth;
      figureHeight = availableHeight;
    } else {
      figureWidth = scrollParentWidth * figureWidthAsPercent;
      figureHeight = figureWidth / aspectRatio;
      if (figureHeight > availableHeight) {
        figureHeight = availableHeight;
        figureWidth = figureHeight * aspectRatio;
        scrollyWidth = figureWidth / figureWidthAsPercent;
      }
    }

    var figureMarginTop = isForceFill ? headerHeight : (availableHeight - figureHeight) / 2 + headerHeight;
    var figureMT_css = isForceFill ? headerHeight + "px" : "calc(50lvh - " + figureHeight + "px / 2 + " + headerHeight + "px / 2)";

    var imageWrapperHeight = isForceFill ? "calc(100vh - " + headerHeight + "px)" : 100 / aspectRatio + "%";
    var lastStepPB = figureMarginTop + figureHeight;
    scrollyOffset = isWipe ? (figureMarginTop - (figureHeight * 0.2)) + 'px' : Math.floor(availableHeight / 2 + headerHeight) + 'px';

    var stepPadding = isWipe ? Math.max(Math.floor(figureHeight * 1.3), Math.floor(availableHeight * 0.9) * 0.5) : Math.floor(availableHeight * 0.9) * 0.5;
    var firstStepMT = isWipe && isForceFill ? Math.floor(figureHeight * 1.3) * -0.5 : null;
    var translateX = isImageRight ? (scrollyWidth - figureWidth) / -2 : null;

    step
      .style('padding-top', stepPadding + 'px')
      .style('padding-bottom', stepPadding + 'px');
    firstStep
      .style('margin-top', firstStepMT + 'px');
    lastStep
      .style('padding-bottom', lastStepPB + 'px');
    scrolly
      .style('width', scrollyWidth + 'px');
    figure
     // .style('top', figureMarginTop + 'px')
      .style('top', figureMT_css)
      .style('transform', 'translateX(' + translateX + 'px)');
    imageWrapper
      .style('padding-top', imageWrapperHeight);

    //figure.select('.force-fill-video')
    //  .style('width', Math.max(figureHeight * aspectRatio, figureWidth) + 'px');

  }


  function handleStepEnter(response) {
    //console.log("ENTER", response);
    throttledReset(response);

    figure.classed("translate", true);

    if (!isWipe) {
      toggleHide(images.filter((d, i) => i == response.index), false);
    }
  }

  function handleStepExit(response) {
    //console.log("EXIT", response);

    if (response.direction === 'up' && response.index == 0) {
      figure.classed('translate', false);
    }

    if (!isWipe) {
      if (response.direction === 'up') {
        toggleHide(images.filter((d, i) => i == response.index && i > 0), true);
      } else if (response.direction === 'down') {
        toggleHide(images.filter((d, i) => i == response.index), false);
      }
    }
  }

  function handleStepProgress(response) {
    //console.log("PROGRESS", response);
    if (isWipe) {
      images.filter((d, i) => i == response.index + 1).style('clip-path', updateClipPath(response.progress));
    }
  }

  function setUpScroller() {
    try { scroller.destroy(); } catch (e) {}

    scroller.setup({
        step: '#' + figureId + ' #scroll-container .scroll-captions .step',
        offset: scrollyOffset,
        debug: false,
        progress: true
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit)
      .onStepProgress(handleStepProgress);
  }



  resizeScrolly();
  setUpScroller();

  window.addEventListener('resize', handleResize);
  scrolly.classed("scrolly-loaded", true);
}



function init() {
  // call stickyScroll for each scrolly, e.g.:
  // stickyScroll("f1", 1600, 1065);
}



if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}