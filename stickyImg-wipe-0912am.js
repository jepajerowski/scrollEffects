var headerHeight = 56;
var scrollyOffset = 0.5;

const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


if (isReduced) {
  console.log('prefers-reduced-motion');
} else {
  console.log('no motion preference');
}



function stickyScroll(imgWidth, imgHeight, figureId) {

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

  //set boolean values for variations
  var isImageRight = scrolly.classed('image-right');
  var isFullPage = scrolly.classed('full-page');
  var isWipe = (scrolly.classed('wipe') && !isReduced);

  console.log(isWipe);

  // wrap each step contents
  step.each(function() {
    thisStep = d3.select(this);
    var wrapper = thisStep.append("div").attr("class", "step-inner");
    thisStep.selectAll(':scope > :not(.step-inner)').each(function() {
      wrapper.node().appendChild(this);
    });
  });

  //wrap images
  var imageWrapper = figure.append("div").attr("class", "image-wrapper");
  images.each(function() {
    imageWrapper.node().appendChild(this);
  });


  // initial placement of wipe
  if (isWipe) {
    images.style('clip-path', updateClipPath(0));
    baseImage.style('clip-path', updateClipPath(1));
  }


  var scroller = scrollama();


  // only run reszie if width changes (prevent jumpiness on mobile) 
  function checkWidth() {
    var currentWidth = window.innerWidth;
    if (currentWidth !== prevWidth) {
      prevWidth = currentWidth;
      handleResize();
    }
  }

  // prevent jumpiness on resize
  function stopTransitions() {
    const classes = scrolly.node().classList;
    let timer = 0;
    window.addEventListener('resize', function() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      } else
        classes.add('stop-transitions');

      timer = setTimeout(() => {
        classes.remove('stop-transitions');
        timer = null;
      }, 100);
    });
  }


  function updateClipPath(progress) {
    var maskEdge = (1 - (progress * 2 - 1)) * 100;
    var newClipPath = "polygon(0 " + maskEdge + "%, 100% " + maskEdge + "%, 100% 100%, 0% 100%)";
    return newClipPath;
  }

  // reset step visibility in case of resize or reload mid-scroll
  function resetVisibility(response) {
    console.log('reset visibility', response);


    if (isWipe) {
      images.filter((d, i) => i <= response.index).style('clip-path', updateClipPath(1));
      if (response.direction === 'up') {
        images.filter((d, i) => i = response.index + 1).style('clip-path', updateClipPath(1));
        images.filter((d, i) => i > response.index + 1).style('clip-path', updateClipPath(0));
      }
    } else {
      images.filter((d, i) => i < response.index).classed('scrolly-hidden', false);
      images.filter((d, i) => i > response.index).classed('scrolly-hidden', true);

    }
  }

  function handleResize() {
    console.log("RESIZE");
    stopTransitions();


    var aspectRatio = imgHeight / imgWidth;

    headerHeight = $(".main-header").outerHeight();
    var availableHeight = window.innerHeight - headerHeight;

    var scrollyWidth = scrolly.node().offsetWidth;
    var figureWidth = figure.node().offsetWidth;
    var scrollParentWidth = scrollParent.offsetWidth;
    var figureHeight;
    var figureWidthAsPercent = figureWidth / scrollyWidth;





    //set new values
    scrollyWidth = scrollParentWidth;

    if (isFullPage) {
      figureWidth = scrollParentWidth;
      figureHeight = availableHeight;
    } else {
      figureWidth = scrollParentWidth * figureWidthAsPercent;
      figureHeight = figureWidth * aspectRatio;
      if (figureHeight > availableHeight) {
        figureHeight = availableHeight;
        figureWidth = figureHeight / aspectRatio;
        scrollyWidth = figureWidth / figureWidthAsPercent;
      }
    }

    var figureMB = (availableHeight - figureHeight) / 2;
    var figureMarginTop = figureMB + headerHeight;
    var imageWrapperHeight = isFullPage ? availableHeight + "px" : aspectRatio * 100 + "%";
    // var lastStepPB = isImageRight ? (figureHeight - lastStep.select('.step-inner').node().offsetHeight) / 2 : lastStepPadding = availableHeight / 2 + figureHeight / 2;
    var lastStepPB = availableHeight / 2 + figureHeight / 2;
    scrollyOffset = isWipe ? (figureMarginTop - (figureHeight * .2)) + 'px' : Math.floor(availableHeight / 2 + headerHeight) + 'px';
    scrollyOffset = "100px"; //debugging


    if (isWipe) {
      step
        .style('padding-top', Math.floor(figureHeight * 1.3) + 'px')
        .style('padding-bottom', Math.floor(figureHeight * 1.3) + 'px');
      firstStep
        .style('margin-top', Math.floor(figureHeight * 1.3) * -0.5 + 'px');
    } else {
      step
        .style('padding-top', Math.floor(availableHeight * 0.9) * 0.5 + 'px')
        .style('padding-bottom', Math.floor(availableHeight * 0.9) * 0.5 + 'px');
      lastStep
        .style('padding-bottom', lastStepPB + 'px');
    }
    scrolly
      .style('width', scrollyWidth + 'px');
    figure
      .style('top', figureMarginTop + 'px');

    if (isImageRight) {
      figure
        .style('transform', 'translateX(' + (scrollyWidth - figureWidth) / -2 + 'px)');
    }

    imageWrapper
      .style('padding-top', imageWrapperHeight);

    //figure.select('.force-fill-video')
    //  .style('width', Math.max(figureHeight / aspectRatio, figureWidth) + 'px');

    scroller.resize();
    scroller.offset(scrollyOffset);
  }


  function handleStepEnter(response) {
    console.log("ENTER", response);
    resetVisibility(response);


    figure.classed("translate", true);

    if (!isWipe) {
      images.filter((d, i) => i == response.index).classed('scrolly-hidden', false);
    }
  }

  function handleStepExit(response) {
    console.log("EXIT", response);

    if (response.direction === 'up' && response.index == 0) {
      figure.classed('translate', false);
    }

    if (!isWipe) {
      if (response.direction === 'up') {
        images.filter((d, i) => i == response.index).classed('scrolly-hidden', true);
      } else if (response.direction === 'down') {
        images.filter((d, i) => i == response.index).classed('scrolly-hidden', false);
      }
    }
  }

  function handleStepProgress(response) {
    console.log("PROGRESS", response.progress);
    if (isWipe) {
      images.filter((d, i) => i == response.index + 1).style('clip-path', updateClipPath(response.progress));
    }
  }





  handleResize();
  scroller.setup({
      step: '#' + figureId + ' #scroll-container .scroll-captions .step',
      offset: scrollyOffset,
      debug: true,
      progress: true
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress(handleStepProgress);
  window.addEventListener('resize', checkWidth);
  scrolly.classed("scrolly-loaded", true);
}