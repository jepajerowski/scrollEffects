var headerHeight = 56;
var scrollOffset = 0.5;

const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleHide(element, isHidden) {
  element.toggleClass('scrolly-hidden', isHidden);
  //element.attr('aria-hidden', isHidden);
}

var stepFunctions;

/*stepFunctions = {
  //define custom functions, e.g.:

  'customFunction': customFunction
};

//sample custom function
function customFunction(response, layer) {
  console.log("custom function called");
}
*/

function stickyScroll(wrapperId, aspectRatio = null) {

  function executeFn(fnName, ctx) {
    var args = Array.prototype.slice.call(arguments, 2);
    return ctx[fnName].apply(ctx, args);
  }

  //can move stepFunctions here if functions need the stickyScroll context

  var prevWidth = $(window).width();

  var availableHeight = window.innerHeight - headerHeight;

  var wrapper = $('#' + wrapperId);
  var scrolly = wrapper.find('.sticky-scroll').first();
  var figure = scrolly.find('figure');
  var captions = scrolly.find('.scroll-captions');
  var step = captions.find('.step');
  var firstStep = captions.find('.step:first-child');
  var lastStep = captions.find('.step:last-child');
  var longStep = captions.find('.step--long');
  var shortStep = captions.find('.step--short');
  var layers = figure.find('img');
  var baseImage = layers.filter(':first-child');
  var baseImageEl = baseImage.get(0);

  //get image width and height if not provided
  if (!aspectRatio) {
    aspectRatio = baseImageEl.naturalWidth / baseImageEl.naturalHeight;

    if (!aspectRatio) {
      baseImageEl.addEventListener('load', () => {
        aspectRatio = baseImageEl.naturalWidth / baseImageEl.naturalHeight;
        scrolly.toggleClass('stop-transitions', true);
        resizeScrolly();
        setUpScroller();
        scrolly.toggleClass('stop-transitions', false);
      });
    }
  }


  //set boolean values for variations
  var isImageRight = scrolly.hasClass('image-right');
  var isForceFill = scrolly.hasClass('force-fill');
  var isWipe = (scrolly.hasClass('wipe') && !isReduced);
  var isContainerWidth = scrolly.hasClass('container-width');
  var noLayering = scrolly.hasClass('no-layering');



  var stepPrefix = wrapperId + "-step-";
  // wrap each step contents
  step.each(function(i) {
    $(this).attr("id", stepPrefix + i);
    var stepInner = $("<div>").addClass("step-inner").appendTo($(this));
    $(this).children(':not(.step-inner)').appendTo(stepInner);
  });

  //wrap layers (images)
  var imageWrapper = $("<div>").addClass("image-wrapper").appendTo(figure);
  layers.each(function(i) {
    //$(this).attr("aria-describedby", stepPrefix + i);
    $(this).clone().attr("aria-hidden", null).addClass("sr-only").appendTo($("#" + stepPrefix + i));

    $(this).attr("aria-hidden", true).addClass('scrolly-layer').appendTo(imageWrapper);

  });


  // setting initial opacity & wipe placement 
  if (isWipe) {
    layers.css('clip-path', updateClipPath(0));
    baseImage.css('clip-path', updateClipPath(1));
  } else {
    toggleHide(figure.find('img:not(:first-child)'), true);
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
    };
  }


  function debounce(callback, delay) {
    let timer = null;
    return function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        callback.apply(this, arguments);
        timer = null;
      }, delay);
    };
  }


  let debouncedResize = debounce(() => {
    setUpScroller();
    scrolly.toggleClass('stop-transitions', false);
  }, 200);

  let throttledReset = throttle(resetVisibility, 500);




  // only run resize if width changes (prevent jumpiness on mobile) 
  function handleResize() {
    var currentWidth = $(window).width();
    if (currentWidth !== prevWidth) {
      prevWidth = currentWidth;

      scrolly.toggleClass('stop-transitions', true);
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
      //console.log('reset visibility', response);

      if (isWipe) {
        layers.filter(function(i) { return i <= response.index; }).css('clip-path', updateClipPath(1));
        if (response.direction === 'up') {
          layers.eq(response.index + 1).css('clip-path', updateClipPath(1));
          layers.filter(function(i) { return i > response.index + 1; }).css('clip-path', updateClipPath(0));
        }
      } else {
        // hide all after this step
        toggleHide(layers.filter(function(i) { return i > response.index && i > 0; }), true);

        if (noLayering) {
          // hide all layers before this one (except base image) unless they are set to stay visible
          toggleHide(layers.filter(function(i) { return i < response.index && i > 0 && !$(this).hasClass('visibility-sticky'); }), true);
          // show layers before this one if they are set to stay visible
          toggleHide(layers.filter(function(i) { return i < response.index && $(this).hasClass('visibility-sticky'); }), false);

        } else {
          //show all before this step
          toggleHide(layers.filter(function(i) { return i < response.index; }), false);

        }
      }
    }
  }

  function resizeScrolly() {

    headerHeight = $(".main-header").outerHeight();
    var availableHeight = window.innerHeight - headerHeight;

    var scrollyWidth = scrolly.outerWidth(); //359
    var figureWidth = figure.outerWidth(); //359
    var maxWidth = isContainerWidth && !isForceFill ? 1110 : $(window).width(); // forceFill overrides containerWidth //1110
    var figureHeight;
    var figureWidthAsPercent = figureWidth / scrollyWidth; //1

    //set new values
    scrollyWidth = Math.min(maxWidth, $(window).width());
    figureWidth = scrollyWidth * figureWidthAsPercent;

    if (isForceFill) {
      figureHeight = availableHeight;
    } else {
      figureHeight = figureWidth / aspectRatio;
      if (figureHeight > availableHeight) {
        figureHeight = availableHeight;
        figureWidth = figureHeight * aspectRatio;
        scrollyWidth = figureWidth / figureWidthAsPercent;
      }
    }

    var figureMarginTop = isForceFill ? headerHeight : (availableHeight - figureHeight) / 2 + headerHeight;
    var figureMT_css = isForceFill ? headerHeight + "px" : "calc(50lvh - " + figureHeight + "px / 2 + " + headerHeight + "px / 2)";

    var imageWrapperHeight = isForceFill ? "calc(100lvh - " + headerHeight + "px)" : 100 / aspectRatio + "%";
    var lastStepPB = figureMarginTop + figureHeight;
    scrollOffset = isWipe ? (figureMarginTop - (figureHeight * 0.2)) + 'px' : Math.floor(availableHeight / 2 + headerHeight) + 'px';

    var stepPadding = isWipe ? Math.max(Math.floor(figureHeight * 1.3), Math.floor(availableHeight * 0.9) * 0.5) : Math.floor(availableHeight * 0.9) * 0.5;
    var firstStepMT = isWipe && isForceFill ? Math.floor(figureHeight * 1.3) * -0.5 : null;
    var translateX = isImageRight ? (scrollyWidth - figureWidth) / -2 : null;

    step
      .css('padding-top', stepPadding + 'px')
      .css('padding-bottom', stepPadding + 'px');
    firstStep
      .css('margin-top', firstStepMT + 'px');
    longStep
      .css('padding-top', (stepPadding * 1.25) + 'px')
      .css('padding-bottom', (stepPadding * 1.25) + 'px');
    shortStep
      .css('padding-top', (stepPadding * 0.75) + 'px')
      .css('padding-bottom', (stepPadding * 0.75) + 'px');
    lastStep
      .css('padding-bottom', lastStepPB + 'px');
    scrolly
      .css('width', scrollyWidth + 'px');
    figure
      .css('top', figureMT_css)
      .css('transform', 'translateX(' + translateX + 'px)');
    imageWrapper
      .css('padding-top', imageWrapperHeight);

  }

  function handleStepEnter(response) {
    console.log("enter", response);

    throttledReset(response);

    figure.toggleClass("translate", true);

    if (!isWipe) {
      toggleHide(layers.eq(response.index), false); //unhide this
    }

    let stepFnName = response.element.getAttribute("data-enter-function");
    if (stepFnName) {
      executeFn(stepFnName, stepFunctions, response, layers.eq(response.index));
    }
  }

  function handleStepExit(response) {
    console.log("exit", response);

    if (response.direction === 'up' && response.index == 0) {
      figure.toggleClass('translate', false);
    }

    if (!isWipe) {
      if (response.direction === 'up') {
        //scrolling up the page (exits bottom)
        toggleHide(layers.filter(function(i) { return i == response.index && i > 0; }), true); //hide this and any following
      } else if (response.direction === 'down') {
        //scrolling down the page (exits top)
        if (noLayering && !lastStep.is(response.element)) {
          // if no layering (except for last step):
          // hide unless layer is set to stay visible
          toggleHide(layers.filter(function(i) { return i == response.index && !$(this).hasClass('visibility-sticky'); }), true);

        } else {
          // if layering on, or it's the last step:
          // stay visible on exit
          toggleHide(layers.eq(response.index), false);
        }
      }
    }

    let stepFnName = response.element.getAttribute("data-exit-function");
    if (stepFnName) {
      executeFn(stepFnName, stepFunctions, response, layers.eq(response.index));
    }
  }

  function handleStepProgress(response) {
    console.log("progress", response);

    if (isWipe) {
      layers.eq(response.index + 1).css('clip-path', updateClipPath(response.progress));
    }

    let stepFnName = response.element.getAttribute("data-progress-function");
    if (stepFnName) {
      executeFn(stepFnName, stepFunctions, response, layers.eq(response.index));
    }
  }

  function setUpScroller() {
    try { scroller.destroy(); } catch (e) {}

    scroller.setup({
        step: '#' + wrapperId + ' .sticky-scroll .scroll-captions .step',
        offset: scrollOffset,
        debug: true,
        progress: true
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit)
      .onStepProgress(handleStepProgress);
  }



  resizeScrolly();
  setUpScroller();

  window.addEventListener('resize', handleResize);
  scrolly.toggleClass("scrolly-loaded", true);
}



function init() {
  // call stickyScroll for each scrolly, e.g.:
  // stickyScroll("f1", 1600/1065);
}



if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}