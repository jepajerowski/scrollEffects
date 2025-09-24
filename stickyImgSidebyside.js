var headerHeight = 56;
var scrollyOffset = 0.5;

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

  var isImageRight = scrolly.attr('class') == 'image-right';

  // wrap step contents
  step.each(function() {
    thisStep = d3.select(this);
    var wrapper = thisStep.append("div").attr("class", "step-inner");
    thisStep.selectAll(':scope > :not(.step-inner)').each(function() {
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
    console.log('viewportHeight: ' + viewportHeight + "    figureHeight: " + figureHeight);
    var lastStepPadding = isImageRight ? (figureHeight - lastStep.select('.step-inner').node().offsetHeight) / 2 :  viewportHeight / 2 + figureHeight / 2;

    var stepMT = Math.floor(viewportHeight * 0.9);
    step
      .style('padding-top', stepMT / 2 + 'px')
      .style('padding-bottom', stepMT / 2 + 'px');
    lastStep.style('padding-bottom', lastStepPadding + 'px');
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
    console.log("--ENTER--", response);
    resetVisibility(response);
    figure.select('[data-overlay=\"' + response.index + '\"]').classed('visible', true);
    figure.classed("translate", true);
  }

  function handleStepExit(response) {
    console.log("--EXIT--", response);
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