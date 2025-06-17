var headerHeight = 56;
var scrollyOffset = 0.5;

//const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;




function stickyScroll(imgWidth, imgHeight, figureId) {

  var viewportHeight = window.innerHeight - headerHeight;
  scrollyOffset = Math.floor(viewportHeight / 2 + headerHeight) + 'px';

  var wrapper = d3.select('#' + figureId);
  var scrolly = wrapper.select('#scroll-container');
  var scrollParent = scrolly.node().parentNode;
  var figure = scrolly.select('figure');
  var imageWrapper = figure.select('.image-wrapper');
  var captions = scrolly.select('.scroll-captions');
  var step = captions.selectAll('.step');
  var firstStep = captions.select('.step:first-child');
  var lastStep = captions.select('.step:last-child');
  var overlayImages = figure.selectAll('.overlayimg');
  var baseImage = figure.select('.baseimg');

  var isImageRight = scrolly.classed('image-right');
  var isFullPage = scrolly.classed('full-page');
  var isWipe = scrolly.classed('wipe');

  // wrap step contents
  step.each(function() {
    thisStep = d3.select(this);
    var wrapper = thisStep.append("div").attr("class", "step-inner");
    thisStep.selectAll(':scope > :not(.step-inner)').each(function() {
      wrapper.node().appendChild(this);
    });
  });

  if (isWipe) {
    var maskProgress = 100;
    overlayImages.each(function() {
      var dataOverlay = d3.select(this).attr('data-overlay');
      var wrapper = d3.select(this.parentNode).append("div")
        .attr('class', 'image-mask overlayimg')
        .attr('data-overlay', dataOverlay)
        .attr('style', "-webkit-mask-image: linear-gradient(transparent " + maskProgress + "%, black " + maskProgress + "%); mask-image: linear-gradient(transparent " + maskProgress + "%, black " + maskProgress + "%)");
      wrapper.node().appendChild(this);
    });
  }


  var scroller = scrollama();


  function handleResize() {
    stopTransitions();

    headerHeight = $(".main-header").outerHeight();

    var aspectRatio = imgHeight / imgWidth;
    var viewportHeight = window.innerHeight - headerHeight;
    var scrollyWidth = scrolly.node().offsetWidth;
    var figureWidth = figure.node().offsetWidth;
    var figureHeight = figureWidth * aspectRatio;

    var figureWidthAsPercent = figureWidth / scrollyWidth;
    scrollyOffset = Math.floor(viewportHeight / 2 + headerHeight) + 'px';


    //set values
    scrollyWidth = scrollParent.offsetWidth;


    if (isFullPage) {
      figureWidth = scrollyWidth;
      figureHeight = viewportHeight;
    } else {
      figureWidth = scrollyWidth * figureWidthAsPercent;
      figureHeight = figureWidth * aspectRatio;
      if (figureHeight > viewportHeight) {
        figureHeight = viewportHeight;
        figureWidth = figureHeight / aspectRatio;
        scrollyWidth = figureWidth / figureWidthAsPercent;
      }
    }


    var figureMarginTop = (viewportHeight - figureHeight) / 2 + headerHeight;
    var imageWrapperHeight = isFullPage ? viewportHeight + "px" : aspectRatio * 100 + "%";
    // var lastStepPB = isImageRight ? (figureHeight - lastStep.select('.step-inner').node().offsetHeight) / 2 : lastStepPadding = viewportHeight / 2 + figureHeight / 2;
    var lastStepPB = lastStepPadding = viewportHeight / 2 + figureHeight / 2;

    if (isWipe) {
      step
        .style('height', Math.floor(viewportHeight) * 2.5 + 'px')
        .style('padding-top', Math.floor(viewportHeight) * 1.5 + 'px')
        .style('padding-bottom', Math.floor(viewportHeight) * 0.5 + 'px');
      firstStep
        .style('height', Math.floor(viewportHeight) + 'px')
        .style('padding-top', Math.floor(viewportHeight) * 0.5 + 'px')
        .style('padding-bottom', Math.floor(viewportHeight) * 0.5 + 'px');
      lastStep
        .style('height', Math.floor(viewportHeight) * 3.5 + 'px')
        .style('padding-bottom', Math.floor(viewportHeight) + 'px');
    } else {
      step
        .style('padding-top', Math.floor(viewportHeight * 0.9) * 0.5 + 'px')
        .style('padding-bottom', Math.floor(viewportHeight * 0.9) * 0.5 + 'px');
      lastStep
        .style('padding-bottom', lastStepPB + 'px');
    }

    scrolly
      .style('width', scrollyWidth + 'px');
    figure
      .style('top', figureMarginTop + 'px');

    
    imageWrapper
      .style('padding-top', imageWrapperHeight);

    figure.select('.force-fill-video')
      .style('width', Math.max(figureHeight / aspectRatio, figureWidth) + 'px');

    scroller.resize();
    scroller.offset(scrollyOffset);
  }






  function handleStepProgress(response) {
    if (isWipe) {

      var dataStep = d3.select(response.element).attr('data-step');
      maskProgress = 100 - (response.progress * 100 * 2.5);
      console.log(response.progress);
      figure.select('[data-overlay=\"' + dataStep + '\"]')
        .attr('style', "-webkit-mask-image: linear-gradient(transparent " + maskProgress + "%, black " + maskProgress + "%); mask-image: linear-gradient(transparent " + maskProgress + "%, black " + maskProgress + "%)");
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


  // reset step visibility in case of resize or reload mid-scroll
  function resetVisibility(response) {
    if (!isWipe) {
      overlayImages.each(function() {
        var imgNum = d3.select(this).attr('data-overlay');
        if (imgNum < response.index) {
          d3.select(this).classed('visible', true);
        } else if (imgNum > response.index) {
          d3.select(this).classed('visible', false);
        }
      });
    }
  }

  function handleStepEnter(response) {
    resetVisibility(response);
    figure.select('[data-overlay=\"' + response.index + '\"]').classed('visible', true);
    figure.classed("translate", true);
  }

  function handleStepExit(response) {
    if (response.direction === 'up') {
      figure.select('[data-overlay=\"' + response.index + '\"]').classed('visible', false);
      if (response.index == 0) {
        figure.classed('translate', false);
      }
    } else if (response.direction === 'down') {
      figure.select('[data-overlay=\"' + response.index + '\"]').classed('visible', true);
    }
  }





  handleResize();
  scroller.setup({
      step: '#' + figureId + ' #scroll-container .scroll-captions .step',
      offset: scrollyOffset,
      debug: false,
      progress: true
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress(handleStepProgress);
  window.addEventListener('resize', handleResize);
}