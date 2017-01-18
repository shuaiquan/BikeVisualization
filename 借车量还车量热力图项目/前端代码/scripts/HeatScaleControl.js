var HeatScaleControl = function(){
	this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
	this.defaultOffset = new BMap.Size(10,10);
};

HeatScaleControl.prototype = new BMap.Control();
HeatScaleControl.prototype.initialize = function(){
	var canvas = new document.createElement('canvas');
	canvas.id = 'heat-scale';
	canvas.width = 100;
	canvas.height = 140;
	canvas.style.boxshadow = "1px 1px 2px 1px #958686";
	map.getContainer().appendChild(canvas);
	initCanvas('heat-scale');

	return canvas;
};

function initCanvas(id){
	var canvas = document.getElementById(id);
	if(canvas == null)
		return false;
	
	var ctx = canvas.getContext('2d');
	
	ctx.strokeStyle = '#4C4848';
	ctx.fillStyle = "#fff";
    ctx.fillRect (0, 0, 100, 140);
    ctx.strokeRect(0, 0, 100, 140);
    ctx.beginPath();
    createTitle(ctx);
    createHeatImg(ctx);
    createScale(ctx);
}

function createTitle(ctx){
	ctx.font = '14px 华文隶书';
    ctx.fillStyle = '#000';
	ctx.fillText('热力图标尺', 15, 20);
}

function createHeatImg(ctx){
	var color = ctx.createLinearGradient(35, 30, 28, 130);
	color.addColorStop(0,'red');
	color.addColorStop(1,'yellow');
	ctx.fillStyle = color;
	ctx.fillRect(35, 30, 18, 100);
}

function createScale(ctx){
	ctx.fillStyle = '#000';
	ctx.font = '12px serif';
	ctx.fillText('0', 65, 130);
	ctx.fillText('100', 65, 38);
}