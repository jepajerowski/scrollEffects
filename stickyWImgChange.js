var headerHeight = 56;

function stickyScroll(imgWidth, imgHeight, figureId) {

  var wrapper = d3.select('#' + figureId);
  var scrolly = wrapper.select('#scroll-container');
  var scrollParent = scrolly.node().parentNode;
  var figure = scrolly.select('figure');
  var captions = scrolly.select('.scroll-captions');
  var step = captions.selectAll('.step');
  var lastStep = captions.select('.step:last-child');
  var overlayImages = figure.selectAll('.overlayimg');
  var baseImage = figure.select('.baseimg');

  step.each(function(){
    thisStep = d3.select(this);
    var wrapper = thisStep.append("div").attr("class","step-inner");
    thisStep.selectAll(':scope > :not(.step-inner)').each(function(){
      wrapper.node().appendChild(this);
    });
  });

  var scroller = scrollama();

  function handleResize() {
    headerHeight = $(".main-header").outerHeight();

    var aspectRatio = imgHeight / imgWidth;
    var viewportHeight = window.innerHeight - headerHeight;
    var scrollyWidth = scrollParent.offsetWidth;
    var figureWidth = scrollyWidth;
    var figureHeight = figureWidth * aspectRatio;

    if (figureHeight > viewportHeight) {
      scrollyWidth = viewportHeight / aspectRatio;
      figureWidth = scrollyWidth;
      figureHeight = figureWidth * aspectRatio;
    }

    var figureMarginTop = (viewportHeight - figureHeight) / 2 + headerHeight;

    var stepMT = Math.floor(viewportHeight * 0.9);
    step.style('margin-bottom', stepMT + 'px');
    lastStep.style('margin-bottom', '0px');
    scrolly
      .style('width', scrollyWidth + 'px');
    captions
      .style('padding-top', (viewportHeight / 2) + 'px')
      .style('padding-bottom', viewportHeight + 'px ')
    figure
      .style('height', figureHeight + 'px')
      .style('top', figureMarginTop + 'px')
      .style('width', figureWidth + 'px');

    scroller.resize();


  }

  function stepVisibility(response) {
    //console.log(response.index, '---- index at stepvis adj');
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
    //console.log(response.index, '---- enter ' + response.direction);
    stepChange(response);
  }

  function handleStepExit(response) {
    //console.log(response.index, '---- exit ' + response.direction);
    stepChange(response);
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