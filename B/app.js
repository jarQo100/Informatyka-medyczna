// (function(){
// 	var min = 255;
// 	var max = 0;
// 	var c = document.getElementById("myCanvas");
// 	var ctx = c.getContext("2d");
// 	var img = document.getElementById("images");
// 	ctx.drawImage(img,0,0);

// 	var imgd = ctx.getImageData(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);

// 	var pixels = imgd.data;

// 	var imgd = histogramEqualization(imgd.data);

// 	var c2 = document.getElementById("myCanvas2");
// 	var ctx2 = c2.getContext("2d");
// 	ctx2.putImageData(imgd, 0, 0);

// })();


// function histogram(img, x1, y1, x2, y2, num_bins) {
//     if( num_bins == undefined )
//         num_bins = 256;
//     var h = img.h, w = img.w;
//     var hist = [];
//     var i, x, y, idx, val;
//     // initialize the histogram
//     for(i=0;i<num_bins;++i)
//         hist[i] = 0;
//     // loop over every single pixel
//     for(y=y1,idx=0;y<y2;++y) {
//         for(x=x1;x<x2;++x,idx+=4) {
//             // figure out which bin it is in
//             val = Math.floor((img.data[idx] / 255.0) * (num_bins-1));
//             ++hist[val];
//         }
//     }
//     return hist;
// }


// function histogramEqualization (pixels) {

//     var scream = document.getElementById("myCanvas");

//     myCanvas.width = scream.width;
//     myCanvas.height = scream.height;

//     var newImageData = myCanvas.getContext('2d')
//                                .createImageData(
//                                    myCanvas.width,
//                                    myCanvas.height
//                                );

//     var countR = new Array(),
//         countG = new Array(),
//         countB = new Array();
//     for (var i = 0; i < 256; i++) {
//         countR[i] = 0;
//         countG[i] = 0;
//         countB[i] = 0;
//     }
//     for (var y = 0; y < myCanvas.height; y++) {
//         for (var x = 0; x < myCanvas.width; x++) {
//             var a = ((y*myCanvas.width)+x)*4;
//             countR[pixels[a]]++;
//             countG[pixels[a+1]]++;
//             countB[pixels[a+2]]++;
//         }
//     }
//     var minR = 256,
//         minG = 256,
//         minB = 256;
//     for (var i = 1; i < 256; i++) {
//         countR[i] += countR[i-1];
//         countG[i] += countG[i-1];
//         countB[i] += countB[i-1];

//         minR = ((countR[i] != 0) && (countR[i] < minR)) ? countR[i] : minR;
//         minG = ((countG[i] != 0) && (countG[i] < minG)) ? countG[i] : minG;
//         minB = ((countB[i] != 0) && (countB[i] < minB)) ? countB[i] : minB;
//     }
//     for (var i = 0; i < 256; i++) {
//         countR[i] = ((countR[i]-minR)/((myCanvas.width*myCanvas.height)-minR))*255;
//         countG[i] = ((countG[i]-minG)/((myCanvas.width*myCanvas.height)-minG))*255;
//         countB[i] = ((countB[i]-minB)/((myCanvas.width*myCanvas.height)-minB))*255;
//     }


//     var d1 = [],
//         d1pron = [],
//         d2 = [],
//         d2pron = [],
//         d3 = [],
//         d3pron = [];
//         var options = {
//         series: {stack: 0,
//                  lines: {show: false, steps: false },
//                  bars: {show: true, barWidth: 0.9, align: 'center',},}
//     };
//     for (var y = 0; y < myCanvas.height; y++) {
//         for (var x = 0; x < myCanvas.width; x++) {
//             var a = ((y*myCanvas.width)+x)*4;
//             newImageData.data[a] = countR[pixels[a]];
//             newImageData.data[a+1] = countG[pixels[a+1]];
//             newImageData.data[a+2] = countB[pixels[a+2]];
//             newImageData.data[a+3] = pixels[a+3];
//         }
//     }

//     return newImageData;
// }

function edgeDetector(){

  // Variables
  this.img = undefined;
  this.imgElement = undefined;
  this.ctx = undefined;
  this.canvasElement = undefined;
  this.rawCanvas = undefined;
  this.rawctx = undefined;
  this.ctxDimensions = {
    width: undefined,
    height:undefined
  };
  this.pixelData = undefined;
  this.threshold = 30;
  this.pointerColor = 'rgba(255,0,0,1)';


  this.init = function(){
    // Build the canvas
    var width = $(this.imgElement).width();
    var height = $(this.imgElement).height();
    $("<canvas id=\"rawData\" width=\""+width+"\" height=\""+height+"\"></canvas>").insertAfter(this.imgElement);
    $("<canvas id=\"layer\" width=\""+width+"\" height=\""+height+"\"></canvas>").insertAfter(this.imgElement);

    this.canvasElement = $("#layer")[0];
    this.rawCanvas = $("#rawData")[0];
    this.ctx = this.canvasElement.getContext('2d');
    this.rawctx = this.rawCanvas.getContext('2d');

    // Store the Canvas Size
    this.ctxDimensions.width = width;
    this.ctxDimensions.height = height;
  };

  this.findEdges = function(){
    this.copyImage();
    this.coreLoop();
  };

  this.copyImage = function(){
    this.rawctx.clearRect(0,0,this.ctxDimensions.width,this.ctxDimensions.height);
    this.ctx.drawImage(this.imgElement,0,0);

    //Grab the Pixel Data, and prepare it for use
    this.pixelData = this.ctx.getImageData(0,0,this.ctxDimensions.width, this.ctxDimensions.height);
  };

  this.coreLoop = function(){
    var x = 0;
    var y = 0;

    var left = undefined;
    var top = undefined;
    var right = undefined;
    var bottom = undefined;

    for(y=0;y<this.pixelData.height;y++){
        for(x=0;x<this.pixelData.width;x++){
            // get this pixel's data
            // currently, we're looking at the blue channel only.
            // Since this is a B/W photo, all color channels are the same.
            // ideally, we would make this work for all channels for color photos.
            index = (x + y * this.ctxDimensions.width) * 4;
            pixel = this.pixelData.data[index+2];

            // Get the values of the surrounding pixels
            // Color data is stored [r,g,b,a][r,g,b,a]
            // in sequence.
            left = this.pixelData.data[index-4];
            right = this.pixelData.data[index+2];
            top = this.pixelData.data[index-(this.ctxDimensions.width*4)];
            bottom = this.pixelData.data[index+(this.ctxDimensions.width*4)];

            //Compare it all.
            // (Currently, just the left pixel)
            if(pixel>left+this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel<left-this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel>right+this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel<right-this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel>top+this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel<top-this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel>bottom+this.threshold){
                this.plotPoint(x,y);
            }
            else if(pixel<bottom-this.threshold){
                this.plotPoint(x,y);
            }
        }
    }
  };

  this.plotPoint = function(x,y){
      this.ctx.beginPath();
      this.ctx.arc(x, y, 0.5, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.beginPath();

      // Copy onto the raw canvas
      // this is probably the most useful application of this,
      // as you would then have raw data of the edges that can be used.

      this.rawctx.beginPath();
      this.rawctx.arc(x, y, 0.5, 0, 2 * Math.PI, false);
      this.rawctx.fillStyle = 'green';
      this.rawctx.fill();
      this.rawctx.beginPath();
  };
}

var edgeDetector = new edgeDetector();


$(document).ready(function(){
  // Run at start
  edgeDetector.imgElement = $('#image')[0];
  edgeDetector.init();
  edgeDetector.findEdges();

});
