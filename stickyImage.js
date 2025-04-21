var headerHeight = 56;


function stickyScroll(imgWidth, imgHeight, figureId){

  var wrapper = d3.select('#' + figureId);
  var scrolly = wrapper.select('#scroll-container');
  var figure = scrolly.select('figure');
  var captions = scrolly.select('.scroll-captions');
  var step = captions.selectAll('.step');
  var lastStep = captions.select('.step:last-child');


  function handleResize() {
  headerHeight = $(".main-header").outerHeight();

  var aspectRatio = imgHeight / imgWidth;
  var viewportHeight = window.innerHeight - headerHeight;
  var scrollyWidth = scrolly.node().offsetWidth;
  var figureWidth = scrollyWidth;
  var figureHeight = figureWidth * aspectRatio;


  if (viewportHeight < figureHeight){
    figureHeight = viewportHeight;
    figureWidth = figureHeight / aspectRatio;
  }

  var figureMarginTop = (viewportHeight - figureHeight) / 2 + headerHeight;

  var stepMT = Math.floor(viewportHeight * 0.9);
  step.style('margin-bottom', stepMT + 'px');
  lastStep.style('margin-bottom', '0px');
  captions
    .style('padding', (viewportHeight / 2) + 'px 0 ' + viewportHeight + 'px ')
    .style('left', (scrollyWidth - figureWidth) / 2 +'px');
  figure
    .style('height', figureHeight + 'px')
    .style('top', figureMarginTop + 'px')
    .style('width', figureWidth + 'px');

  }

  handleResize();
  window.addEventListener('resize', handleResize);
}



function init() {
  stickyScroll(2000, 1272, "f1");
  stickyScroll(2000, 1272, "f2");
}

init();