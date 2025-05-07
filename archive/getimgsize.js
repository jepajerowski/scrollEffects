
function getImgSize(imgSrc) {
  const img = new Image();
  img.onload = function() {
    console.log(this.naturalWidth + 'x' + this.naturalHeight);
  }
  img.src = imgSrc;
};

  var baseImage = figure.select('.baseimg');
