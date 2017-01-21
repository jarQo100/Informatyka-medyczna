(function(){

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("images");
	ctx.drawImage(img,0,0);

	var imgd = ctx.getImageData(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
	var pixels = imgd.data;

	  for(var i = 0; i < pixels.length; i += 4){
	  	if(imgd.data[i] >= 100 && imgd.data[i] <= 200){
	  		imgd.data[i] = imgd.data[i] + 140;
	  	}
	  }

	var c2 = document.getElementById("myCanvas2");
	var ctx2 = c2.getContext("2d");
	ctx2.putImageData(imgd, 0, 0);

})();