var headerHeight = 56;
var scrollyOffset = 0.5;

function stickyScroll(imgWidth, imgHeight, figureId) {

  var viewportHeight = window.innerHeight - headerHeight;
  scrollyOffset = Math.floor(viewportHeight / 2 + headerHeight) + 'px';

  //set up selections
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

  // check for image right variation
  var isImageRight = scrolly.attr('class') == 'image-right';


  // give step contents a wrapper
  step.each(function(){
    thisStep = d3.select(this);
    var wrapper = thisStep.append("div").attr("class","step-inner");
    thisStep.selectAll(':scope > :not(.step-inner)').each(function(){
      wrapper.node().appendChild(this);
    });
  });


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

    scrollyWidth = scrollParent.offsetWidth;
    figureWidth = scrollyWidth * figureWidthAsPercent;
    figureHeight = figureWidth * aspectRatio;

    if (figureHeight > viewportHeight) {
      figureHeight = viewportHeight;
      figureWidth = figureHeight / aspectRatio;
      scrollyWidth = figureWidth / figureWidthAsPercent;
    }


    var figureMarginTop = (viewportHeight - figureHeight) / 2 + headerHeight;
    var lastStepPadding = isImageRight ? (figureHeight - lastStep.select('.step-inner').node().offsetHeight) / 2 : lastStepPadding = viewportHeight / 2 + figureHeight / 2;

    var stepMT = Math.floor(viewportHeight * 0.9);
    step
      .style('padding-top', stepMT / 2 + 'px')
      .style('padding-bottom', stepMT / 2 +'px');
    lastStep.style('padding-bottom', lastStepPadding + '0px');
    scrolly
      .style('width', scrollyWidth + 'px');
    //captions
    //.style('padding-top', (viewportHeight / 2) + 'px')
    //.style('padding-bottom', viewportHeight + 'px ');
    figure
      .style('top', figureMarginTop + 'px');
    imageWrapper
      .style('padding-top', aspectRatio * 100 + '%');

    scroller.resize();
    scroller.offset(scrollyOffset);
  }



  //pause transitions temporarily to prevent jumpiness on resize
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


  // resets visibility of previous and future steps, in case of resize or reload mid-scroll
  function stepVisibility(response) {
    overlayImages.each(function() {
      var imgNum = d3.select(this).attr('data-overlay');
      if (imgNum < response.index) {
        d3.select(this).classed('visible', true);
      } else if (imgNum > response.index) {
        d3.select(this).classed('visible', false);
      }
    });

  }

  function handleStepEnter(response) {
    stepVisibility(response);
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
      debug: false
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
  window.addEventListener('resize', handleResize);
}