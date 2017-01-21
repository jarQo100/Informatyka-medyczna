function edgeDetector(){

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

    var width = $(this.imgElement).width();
    var height = $(this.imgElement).height();
    $("<canvas id=\"rawData\" width=\""+width+"\" height=\""+height+"\"></canvas>").insertAfter(this.imgElement);
    $("<canvas id=\"layer\" width=\""+width+"\" height=\""+height+"\"></canvas>").insertAfter(this.imgElement);

    this.canvasElement = $("#layer")[0];
    this.rawCanvas = $("#rawData")[0];
    this.ctx = this.canvasElement.getContext('2d');
    this.rawctx = this.rawCanvas.getContext('2d');

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
            
            index = (x + y * this.ctxDimensions.width) * 4;
            pixel = this.pixelData.data[index+2];

           
            left = this.pixelData.data[index-4];
            right = this.pixelData.data[index+2];
            top = this.pixelData.data[index-(this.ctxDimensions.width*4)];
            bottom = this.pixelData.data[index+(this.ctxDimensions.width*4)];

            
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

      this.rawctx.beginPath();
      this.rawctx.arc(x, y, 0.5, 0, 2 * Math.PI, false);
      this.rawctx.fillStyle = 'green';
      this.rawctx.fill();
      this.rawctx.beginPath();
  };
}

var edgeDetector = new edgeDetector();


$(document).ready(function(){

  edgeDetector.imgElement = $('#image')[0];
  edgeDetector.init();
  edgeDetector.findEdges();

});
