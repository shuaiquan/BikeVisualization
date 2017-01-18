var CreateMap = function(element){
	this.map = new BMap.Map(element);
	this.maxScale = 100;
	this.bikeNumData;
	this.weatherAnimation;
	
	var HeatScaleControl = function(){
		this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
		this.defaultOffset = new BMap.Size(10,10);
	};
	

	this.initMap = function(){
		this.map.centerAndZoom('杭州',14);

		this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));
		this.map.addControl(new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));
		
		var obj = this;
		HeatScaleControl.prototype = new BMap.Control();
		HeatScaleControl.prototype.initialize = function(){
			var canvas = document.createElement('canvas');
			canvas.id = 'heat-scale';
			canvas.width = 100;
			canvas.height = 140;
			canvas.style.boxshadow = "1px 1px 2px 1px #958686";
			obj.map.getContainer().appendChild(canvas);
			initCanvas('heat-scale');

			return canvas;
		};
		
		var heatScaleControl = new HeatScaleControl();
		this.map.addControl(heatScaleControl);
	};
	
	/**
	 * 按小时获取停车数据
	 */
	this.heatMap = function(date,clock){
		var obj = this;
		var dataFrom = $('.show-station').find('form').find('input[type="radio"]:checked').val();
		$.ajax({
			url: '/heat1/servlets/getHeatMapData',			//getHeatMapData
			type: 'POST',
			dataType: 'json',
			data: {
				date: date,
				clock: clock,
				dataFrom: dataFrom
			},
			success:function(data){
				obj.createHeatMap(data);
			},
			error: function(err){
				console.log('获取热力图数据时发生错误：'+err.status);
			}
		});
	};
	
	/**
	 * 获取天气数据
	 * @param  {[type]} date [日期]
	 */
	this.getWeather = function(date){
		var obj = this;
		$.ajax({
			url: '/heat1/servlets/getWeather',
			type: 'POST',
			dataType: 'json',
			data: {
				date: date
			},
			success: function(data){
				console.log(data);
				obj.createWeatherControl(data[0].weather);
			},
			error: function(err){
				console.log('获取天气情况失败'+err.status);
			}
		});
	}
	
	/**
	 * 按天获取停车数据
	 */
	this.heatMapByDay = function(date){
		var obj = this;
		var dataFrom = $('.show-station').find('form').find('input[type="radio"]:checked').val();
		$.ajax({
			url: '/heat1/servlets/getHeatMapByDay',
			type: 'POST',
			dataType: 'json',
			data: {
				date: date,
				dataFrom: dataFrom
			},
			success: function(data){
				console.log(data);
				obj.createHeatMap(data);
			},
			error: function(err){
				console.log('获取热力图数据时发生错误：'+err.status);
			}
		});
	};

	/**
	 * 创建热力图
	 */
	this.createHeatMap = function(data){
		var heatData = [];
		var max = 0;
		var min = 1000;
		for(var i=0;i<data.length;i++){
			heatData.push({
				"lng": parseFloat(data[i].lng),
				"lat": parseFloat(data[i].lat),
				"count": data[i].num
			});
			
			if(data[i].num>max){
				max = data[i].num;
			}
			
			if(data[i].num<min){
				min = data[i].num;
			}
		}
		// console.log(heatData);
		
		this.map.clearOverlays();
		var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20,"visible":true,"gradient":{'0.1': 'purple', '0.25': 'blue', '0.4': 'cyan', '0.55': 'green', '0.7': 'yellow', '0.85': 'orange', '1': 'red'}});
		this.map.addOverlay(heatmapOverlay);
		this.bikeNumData = heatData;
		var obj = this;
		if(window.style == 2){
			if(this.maxScale < 500){
				this.maxScale = 1000;
			}
			heatmapOverlay.setDataSet({data:heatData,max: obj.maxScale});
			this.changeScale(this.maxScale);
		}else{
			if(this.maxScale == 1000){
				this.maxScale = 100;
			}
			heatmapOverlay.setDataSet({data:heatData,max: obj.maxScale})
			this.changeScale(this.maxScale);
		}
		
		console.log(heatData,max);
		
		if(window.style == 2){
			$('#manager-two').find('.max-min').text('最大值：'+max+'；最小值：'+min);
		}else{
			$('#manager-one').find('.max-min').text('最大值：'+max+'；最小值：'+min);
		}

	};
	
	/**
	 * 根据新标尺重新渲染热力图
	 * @param {[type]} max [新标尺的最大值]
	 */
	this.setHeatMapAgain = function(max){
		this.maxScale = max;
		
		this.map.clearOverlays();
		var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20,"visible":true,"gradient":{'0.1': 'purple', '0.25': 'blue', '0.4': 'cyan', '0.55': 'green', '0.7': 'yellow', '0.85': 'orange', '1': 'red'}});
		this.map.addOverlay(heatmapOverlay);
		
		var obj = this;
		heatmapOverlay.setDataSet({data:obj.bikeNumData, max: obj.maxScale})
		this.changeScale(obj.maxScale);
	};

	this.createStationHeat = function(){
		var obj = this;
		var url = './scripts/stations_baidu.json';

		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data){
				obj.map.clearOverlays();
				var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20,"visible":true,"gradient":{'0.1': 'purple', '0.25': 'blue', '0.4': 'cyan', '0.55': 'green', '0.7': 'yellow', '0.85': 'orange', '1': 'red'}});
				obj.map.addOverlay(heatmapOverlay);

				var heatData = [];
				for(var i=0;i<data.length;i++){
					var point = {
						'lng': data[i].x,
						'lat': data[i].y,
						'count': 2
					};
					heatData.push(point);				
				}
				heatmapOverlay.setDataSet({data: heatData, max: 10});
			},
			error: function(err){
				console.log(err.status);
			}
		});
	};

	/**
	 * 创建天气控件
	 * @return {[type]} [description]
	 */
	this.createWeatherControl = function(weather){
		var obj = this;
		function WeatherControl(){
			this.defaultOffset = new BMap.Size(20, 15);
			this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
		}

		WeatherControl.prototype = new BMap.Control();
		WeatherControl.prototype.initialize = function(){
			var canvas = document.createElement('canvas');
			canvas.id = 'map-weather';
			canvas.width = 53;
			canvas.height = 53;
			obj.map.getContainer().appendChild(canvas);
			createWeatherCanvas('map-weather', weather);

			return canvas;
		}

		var weatherControl = new WeatherControl();
		this.map.addControl(weatherControl);
	}

	/**
	 * 创建天气控件的CANVAS图像
	 * @param  {[type]} canvasId [description]
	 * @return {[type]}          [description]
	 */
	var createWeatherCanvas = function(canvasId, weather){
		var canvas = document.getElementById(canvasId);
		if(canvas == null)
			return false;

		var ctx = canvas.getContext('2d');

		ctx.fillStyle = 'rgba(255, 255, 0, 0)';
		ctx.fillRect(0, 0, 53, 53);

		var wArr = weather.split('~');

		var i=0;
		if(this.weatheranimation != undefined){
			clearInterval(this.weatheranimation);
		}
		
		this.weatheranimation = setInterval(function(){
			if(i == wArr.length){
				i=0;
			}

			var img = new Image();
			img.onload = function(){
				ctx.drawImage(img, 0, 0);
			};

			var src = '';
			if(wArr[i] == '多云' || wArr[i] == '阴'){
				src = 'images/多云.png';
			}else{
				src = 'images/'+wArr[i]+'.png';
			}
			img.src = src;

			i++;
		},3000);

		/*var img = new Image();
		img.onload = function(){
			ctx.drawImage(img, 0, 0);
		}
		var src = '';
		if(weather == '多云' || weather == '阴'){
			src = 'images/多云.png';
		}else{
			src = 'images/'+weather+'.png';
		}
		img.src = src;*/
	}
	
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
		color.addColorStop(0.15, 'orange');
		color.addColorStop(0.3, 'yellow');
		color.addColorStop(0.45, 'green');
		color.addColorStop(0.6, 'cyan');
		color.addColorStop(0.75, 'blue');
		color.addColorStop(1, 'purple');
		ctx.fillStyle = color;
		ctx.fillRect(35, 30, 18, 100);
	}

	function createScale(ctx){
		ctx.fillStyle = '#000';
		ctx.font = '12px serif';
		ctx.fillText('0', 65, 130);
		ctx.fillText('100', 65, 38);
	}
	
	this.changeScale = function(max){
		var canvas = document.getElementById('heat-scale');
		if(canvas == null)
			return false;
		var ctx = canvas.getContext('2d');
		ctx.font = '12px serif';

		ctx.fillStyle = '#fff';
		ctx.fillRect(65, 24, 32, 20);
		ctx.fillStyle = '#000';
		ctx.fillText(max, 65, 38);
		
		// if(max == 100){
		// 	ctx.fillStyle = '#fff';
		// 	ctx.fillText('1000', 65, 38);
		// 	ctx.fillStyle = '#000';
		// 	ctx.fillText('100', 65, 38);
		// }else if(max == 1000){
		// 	ctx.fillStyle = '#000';
		// 	ctx.fillText('1000', 65, 38);
		// }
	}
};

$(function(){
	var map = new CreateMap('map');	
	map.initMap();
	
	window.style = 0;
	$('#heat-map').click(function(){
		var date = $('#date1').val();
		var time = $('#time1').val();
		window.style = 1;
		map.heatMap(date,time);
		map.getWeather(date);
	});
	
	$('#heat-map2').click(function(){
		var date = $('#date2').val();
		window.style = 2;
		map.heatMapByDay(date);
		map.getWeather(date);
	});

	$('#_set-max').focusout(function(){
		var max = $('#_set-max').val();
		map.setHeatMapAgain(max);
	});

	$('.show-station').find('button').click(function(){
		map.createStationHeat();
	})
});