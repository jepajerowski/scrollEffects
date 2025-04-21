var imgHeight = 1272;
var imgWidth = 2000; 


var f1 = d3.select('#f1');
var scrolly = f1.select('#scroll-container');
var figure = scrolly.select('figure');
var captions = scrolly.select('.scroll-captions');
var step = captions.selectAll('.step');


/*var scroller = scrollama();*/

function handleResize() {
  var aspectRatio = imgHeight / imgWidth;
  var figureWidth = 1110;
  var figureHeight;
  var viewportHeight = window.innerHeight - 56;

  if (window.innerWidth < figureWidth) {
    figureHeight = window.innerWidth * aspectRatio;
  } else {
    figureHeight = figureWidth * aspectRatio;
  }



  var figureMarginTop = (viewportHeight - figureHeight) / 2 + 56;


  var stepMT = Math.floor(figureHeight * 0.9);
  step.style('margin-bottom', stepMT + 'px');



  figure
    .style('height', figureHeight + 'px')
    .style('top', figureMarginTop + 'px');


  /*scroller.resize();*/
}

/*function handleStepEnter(response) {
  console.log(response.index, '-------- enter');

  step.classed('is-active', function(d, i) {
    return i === response.index;
  });




  if (response.index === 0) {
    figure.select('.overlayimg0').style('opacity', 0);
    figure.select('.overlayimg1').style('opacity', 0);
    figure.select('.overlayimg2').style('opacity', 0);
  } else if (response.index === 1) {
    figure.select('.overlayimg0').style('opacity', 0);
    figure.select('.overlayimg1').style('opacity', 0);
    figure.select('.overlayimg2').style('opacity', 0);
  } else if (response.index === 2) {
    figure.select('.overlayimg0').style('opacity', 0);
    figure.select('.overlayimg1').style('opacity', 0);
    figure.select('.overlayimg2').style('opacity', 0);
  } else if (response.index === 3) {
    figure.select('.overlayimg0').attr("src", "/do/10.5555/article.2439726/files/" + "step-3" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 1);
    figure.select('.overlayimg1').attr("src", "/do/10.5555/article.2439726/files/" + "step-4" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 0);
  } else if (response.index === 4) {
    figure.select('.overlayimg1').attr("src", "/do/10.5555/article.2439726/files/" + "step-4" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 1);
    figure.select('.overlayimg2').attr("src", "/do/10.5555/article.2439726/files/" + "step-5" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 0);
  } else if (response.index === 5) {
    figure.select('.overlayimg2').attr("src", "/do/10.5555/article.2439726/files/" + "step-5" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 1);
  }






}


function handleStepExit(response) {
  console.log(response.index, '-------- exit');
  response.element.classList.remove('is-active');

}*/



function init() {

  handleResize();

  /*scroller.setup({
      step: '#scroll-container .scroll-captions .step',
      offset: 1.0,
    })
    .onStepEnter(handleStepEnter);*/


  window.addEventListener('resize', handleResize);
}

init();