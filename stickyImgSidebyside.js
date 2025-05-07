var headerHeight = 56;

function stickyScroll(imgWidth, imgHeight, figureId) {

  var wrapper = d3.select('#' + figureId);
  var scrolly = wrapper.select('#scroll-container');
  var scrollParent = scrolly.node().parentNode;
  var figure = scrolly.select('figure');
  var imageWrapper = figure.select('.image-wrapper');
  var captions = scrolly.select('.scroll-captions');
  var step = captions.selectAll('.step');
  var lastStep = captions.select('.step:last-child');
  var overlayImages = figure.selectAll('.overlayimg');
  var baseImage = figure.select('.baseimg');

  var scroller = scrollama();

  function handleResize() {
    headerHeight = $(".main-header").outerHeight();

    var aspectRatio = imgHeight / imgWidth;
    var viewportHeight = window.innerHeight - headerHeight;
    var scrollyWidth = scrolly.node().offsetWidth;
    var figureWidth = figure.node().offsetWidth;
    var figureHeight = figureWidth * aspectRatio;

    var figureWidthAsPercent = figureWidth / scrollyWidth;

    scrollyWidth = scrollParent.offsetWidth;
    figureWidth = scrollyWidth * figureWidthAsPercent;
    figureHeight = figureWidth * aspectRatio;

    if (figureHeight > viewportHeight) {
      figureHeight = viewportHeight;
      figureWidth = figureHeight / aspectRatio;
      scrollyWidth = figureWidth / figureWidthAsPercent;
    }


    var figureMarginTop = (viewportHeight - figureHeight) / 2 + headerHeight;

    var stepMT = Math.floor(viewportHeight * 0.9);
    step.style('margin-bottom', stepMT + 'px');
    lastStep.style('margin-bottom', '0px');
    scrolly
      .style('width', scrollyWidth + 'px');
    captions
      .style('padding-top', (viewportHeight / 2) + 'px')
      .style('padding-bottom', viewportHeight + 'px ');
    figure
      .style('top', figureMarginTop + 'px');
    imageWrapper
      .style('padding-top', aspectRatio * 100 + '%');

    scroller.resize();


  }

  function stepVisibility(response) {
    overlayImages.each(function() {
      var imgNum = d3.select(this).attr('data-overlay');
      if (imgNum < response.index) {
        d3.select(this).style('opacity', 1);
      } else if (imgNum > response.index) {
        d3.select(this).style('opacity', 0);
      }
    });
  }

  function stepChange(response) {
    stepVisibility(response);
    if (response.direction === 'down') {
      figure.select('[data-overlay=\"' + response.index + '\"]').transition().duration(800).ease(d3.easeLinear).style("opacity", 1);
    } else if (response.direction === 'up') {
      figure.select('[data-overlay=\"' + response.index + '\"]').transition().duration(400).ease(d3.easeLinear).style("opacity", 0);
    }


  }

  function handleStepEnter(response) {
    console.log(response);
    stepChange(response);

      figure.classed("translate", true);
  }

  function handleStepExit(response) {
    stepChange(response);

  if (response.direction === 'up' && response.index == 0) {
      figure.classed('translate', false);
    } else{
      figure.classed('translate',true);
    }
  }



  handleResize();
  scroller.setup({
      step: '#' + figureId + ' #scroll-container .scroll-captions .step',
      offset: 0.9,
      debug: false
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
  window.addEventListener('resize', handleResize);
}
