var firsts = d3.select('#firsts')
var scrolly = firsts.select('#scrolly');
var figure = scrolly.select('figure');
var article = scrolly.select('article');
var step = article.selectAll('.step');

var scroller = scrollama();

function handleResize() {
            
  var figureWidth = 1110;

  var figureHeight;

  if (window.innerWidth < figureWidth) {
    figureHeight = window.innerWidth * (1272 / 2000);
  } else {
    figureHeight = figureWidth * (1272 / 2000);
  };



    var figureMarginTop = (window.innerHeight - figureHeight) / 2

    
  var stepMT = Math.floor(figureHeight * 0.9);
  step.style('  margin-bottom', stepMT + 'px');


  figure
    .style('height', figureHeight + 'px')
    .style('top', figureMarginTop + 'px');


    scroller.resize();
}

function handleStepEnter(response) {
  console.log(response.index, '-------- enter');
  
    step.classed('is-active', function(d, i) {
    return i === response.index;
  })

  
      
    
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
    figure.select('.overlayimg0').attr("src", "/do/10.1126/science.z7vfrel/files/" + "step-3" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 1);

    figure.select('.overlayimg1').attr("src", "/do/10.1126/science.z7vfrel/files/" + "step-4" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 0);

  } else if (response.index === 4) {
    figure.select('.overlayimg1').attr("src", "/do/10.1126/science.z7vfrel/files/" + "step-4" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 1);

    figure.select('.overlayimg2').attr("src", "/do/10.1126/science.z7vfrel/files/" + "step-5" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 0);
  } else if (response.index === 5) {
    figure.select('.overlayimg2').attr("src", "/do/10.1126/science.z7vfrel/files/" + "step-5" + ".png").style('opacity', 0).transition().duration(1000).ease(d3.easeLinear).style("opacity", 1);
  };
  
          



  
}


function handleStepExit(response) {
    console.log(response.index, '-------- exit');
    response.element.classList.remove('is-active');
    
            }


function setupStickyfill() {
  d3.selectAll('.sticky').each(function() {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();

    handleResize();

        scroller.setup({
      step: '#scrolly article .step',
      offset: 1.0,

      debug: true,
    })
    .onStepEnter(handleStepEnter)


    window.addEventListener('resize', handleResize);
}



init();





function defer(method) {
  if (window.jQuery) {
    method();
  } else {
    setTimeout(function() { defer(method); }, 50);
  }
}


function loadJQuery() {

  var waitForLoad = function() {
    if (typeof jQuery != "undefined") {
      console.log("jquery loaded..");

      init();


    } else {
      console.log("jquery not loaded..");
      window.setTimeout(waitForLoad, 500);
    }
  };
  window.setTimeout(waitForLoad, 500);
}

window.onload = loadJQuery;