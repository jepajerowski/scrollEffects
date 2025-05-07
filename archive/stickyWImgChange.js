var headerHeight = 56;

function stickyScroll(imgWidth, imgHeight, figureId) {

  var wrapper = d3.select('#' + figureId);
  var scrolly = wrapper.select('#scroll-container');
  var figure = scrolly.select('figure');
  var captions = scrolly.select('.scroll-captions');
  var step = captions.selectAll('.step');
  var lastStep = captions.select('.step:last-child');
  var overlayImages = figure.selectAll('.overlayimg');

  var scroller = scrollama();
  var latestResponse;


  function handleResize() {
    headerHeight = $(".main-header").outerHeight();

    var aspectRatio = imgHeight / imgWidth;
    var viewportHeight = window.innerHeight - headerHeight;
    var scrollyWidth = scrolly.node().offsetWidth;
    var figureWidth = scrollyWidth;
    var figureHeight = figureWidth * aspectRatio;


    if (viewportHeight < figureHeight) {
      figureHeight = viewportHeight;
      figureWidth = figureHeight / aspectRatio;
    }

    var figureMarginTop = (viewportHeight - figureHeight) / 2 + headerHeight;

    var stepMT = Math.floor(viewportHeight * 0.9);
    step.style('margin-bottom', stepMT + 'px');
    lastStep.style('margin-bottom', '0px');
    captions
      .style('padding-top', (viewportHeight / 2) + 'px')
      .style('padding-bottom', viewportHeight + 'px ')
      .style('left', (scrollyWidth - figureWidth) / 2 + 'px');
    figure
      .style('height', figureHeight + 'px')
      .style('top', figureMarginTop + 'px')
      .style('width', figureWidth + 'px');

    /*if (latestResponse) {
      console.log(latestResponse.index, '---- index at resize ');
      stepVisibility(latestResponse.index);
    }*/

    scroller.resize();


  }

   function stepVisibility(currentIndex) {
    console.log(currentIndex, '---- index at stepvis adj');
     overlayImages.each(function (){
       var stepIndex = d3.select(this).attr('id').replace('step-', '');
       if (stepIndex < currentIndex) {
         d3.select(this).style('opacity', 1);
       } else if (stepIndex > currentIndex) {
         d3.select(this).style('opacity',0);
       }
     });
   }

  function stepChange(response){
     if (!latestResponse){
      stepVisibility(response.index);
    }
    latestResponse = response;

    for (let i = 0; i < step.nodes().length; i++) {
      if (response.index === i && response.direction === 'down') {
        figure.select('#step-' + response.index).transition().duration(800).ease(d3.easeLinear).style("opacity", 1);
      } else if (response.index === i && response.direction === 'up') {
        figure.select('#step-' + response.index).transition().duration(400).ease(d3.easeLinear).style("opacity", 0);
      }
    }
  }

  function handleStepEnter(response) {
   
    console.log(response.index, '---- enter ' + response.direction);
    stepChange(response);
  }

  function handleStepExit(response) {
    console.log(response.index, '---- exit ' + response.direction);
    stepChange(response);
  }



  handleResize();
  scroller.setup({
      step: '#' + figureId + ' #scroll-container .scroll-captions .step',
      offset: 0.9,
      debug: true
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit);
  window.addEventListener('resize', handleResize);
}



function init() {
  stickyScroll(2000, 1272, "f1");
  stickyScroll(2000, 1272, "f2");
}

init();