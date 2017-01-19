var Map = function(){
	this.map = null;
	this.stationPoints = [];
	this.chosenStation = [];
	this.kdata;
	this.kcenter = [];
	this.kr = [];
	this.k = [];
	this.circle = null;
	this.circleStyle = 1;
	var self = this;
	
	this.initMap = function(){
		this.map = new BMap.Map("station-map");
		
		if(this.map == null)
			return false;
		
		this.map.centerAndZoom("杭州", 13);
		this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
		
		drawManager();
		self.getStations();
		
		return this.map;
	};
	
	this.getStations = function(){
		
		$.ajax({
			type: "GET",
			url: './js/stations_baidu.json',
			dataType: 'json',
			success: function(data){
				createMarker(data);
			}
		});
	};
	
	var createMarker = function(stations){
		var markers = [];
		self.stationPoints = [];
		
		var points = [];
		for(var i=0;i<stations.length;i++){
			var point = new BMap.Point(stations[i].x, stations[i].y);
			self.stationPoints.push({
				id: stations[i].id,
				name: stations[i].name,
				point: point
			});
			points.push(point);
		}
		
		var option = {
			shape: BMAP_POINT_SHAPE_CIRCLE,
			color: '#39A2D7',
			size: BMAP_POINT_SIZE_SMALL
		};
		
		var pointCollection = new BMap.PointCollection(points, option);
		self.map.addOverlay(pointCollection);
		
	};
	
	var drawManager = function(){
		
		var styleOptions = {
		        strokeColor:"red",    //边线颜色。
		        fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
		        strokeWeight: 2,       //边线的宽度，以像素为单位。
		        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
		        strokeStyle: 'solid' //边线的样式，solid或dashed。
		};
		
		var polygon = {
			strokeColor: 'red',
			fillColor: 'red',
			strokeWeight: 1,
			fillOpacity: 0.4,
			strokeStyle: 'solid'
		};
		
		var drawingManager = new BMapLib.DrawingManager(self.map, {
			isOpen: false,
			enableDrawingTool: true,
			drawingToolOptions: {
	            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
	            offset: new BMap.Size(5, 5), //偏离值
	            drawingModes : [BMAP_DRAWING_CIRCLE,BMAP_DRAWING_POLYGON]
	        },
	        circleOptions: styleOptions,
	        polygonOptions: polygon
		});
		 
		 drawingManager.addEventListener('circlecomplete', function(e, circle){
			 this.close();
			 if(self.circle != null){
				 self.map.removeOverlay(self.circle);
			 }
			 self.circle = circle;
			 if (self.circleStyle == 1){
				  isInOverlay(circle);
			 }else if( self.circleStyle == 2){
				 isInOverlay2(circle);
			 }		
		 });
		
		 drawingManager.addEventListener('polygoncomplete', function(e, polygon){
			this.close();
			if(self.circle != null){
				 self.map.removeOverlay(self.circle);
			 }
			 self.circle = polygon;
			 if (self.circleStyle == 1){
				  isInOverlay(polygon);
			 }else if( self.circleStyle == 2){
				 isInOverlay2(polygon);
			 }
		 });
	};
	
	var isInOverlay = function(overlay){
		
		self.chosenStation = [];
		for(var i=0;i<self.stationPoints.length;i++){
			if(BMapLib.GeoUtils.isPointInCircle(self.stationPoints[i].point, overlay)){
				self.chosenStation.push(self.stationPoints[i].id);
			}
		}
	};
	
	var isInOverlay2 = function(overlay){
		self.kr = [];
		self.k = [];
		for(var i=0; i<self.kcenter.length; i++){
			if(BMapLib.GeoUtils.isPointInCircle(self.kcenter[i].point, overlay)){
				for(var j=0; j<self.kdata[i].length; j++){
					self.kr.push(self.kdata[i][j].id);
				}
				self.kr.push('0000');
				self.k.push(i);
			}
		}
		self.k.push(self.kdata.length);
	};
	
	this.createFileByDay = function(date){
		$.ajax({
			type: 'POST',
			url: './servlets/createFileByDay',
			data: {
				stations: self.chosenStation,
				date: date
				
			},
			success: function(data){
				console.log(data);
				self.kdata = data;
				alert('操作成功');
			}
		});
	}

	this.createFile = function(date, time) {
		$.ajax({
			type: 'POST',
			url: './servlets/createFile',
			data: {
				stations: self.chosenStation,
				date: date,
				time: time
			},
			success: function(data){
				console.log(data);
				self.kdata = data;
				alert('操作成功');
			}
		});
	}

	this.getClassify = function(){
		$.ajax({
			type: 'POST',
			url: './servlets/readClassify',
			success: function(data){
				console.log(data);
				self.showChosenStations(data);
			}
		})
	};

	this.showChosenStations = function(cla){
		var points = [[],[],[]];
		var cp = [];
		
		self.map.clearOverlays();
		for(var i=0;i<self.chosenStation.length;i++){
			for(var j=0;j<self.stationPoints.length;j++){
				if(self.chosenStation[i] == self.stationPoints[j].id){console.log();
					points[parseInt(cla[i].classify)].push(self.stationPoints[j].point);
					cp.push(self.stationPoints[j].point);
					break;
				}
			}
		}
		
		this.map.setViewport(cp);
		
		var options = {
	            size: BMAP_POINT_SIZE_BIG,
	            shape: BMAP_POINT_SHAPE_CIRCLE,
	            color: '#d340c3'
	    };
		var colors = getColorArr(3);
		
		for(i=0;i<points.length;i++){
			options.color = colors[i];
			
			var pointCollection = new BMap.PointCollection(points[i], options);
			this.map.addOverlay(pointCollection);
		}
		
		showChosenLine(colors);
	};
	
	var showChosenLine = function(colors){
		var lp,rp;
		var k=0,i,j;
		var max=0,min=100;
		
		for(i=0;i<self.kdata.length;i++){
			if(self.kdata[i].num>max){
				max = self.kdata[i].num;
			}
			if(self.kdata[i].num<min){
				min = self.kdata[i].num;
			}
		}
		
		for(i=0;i<self.kdata.length;i++){
			for(j=0;j<self.stationPoints.length;j++){
				if(self.kdata[i].le == self.stationPoints[j].id){
					lp = self.stationPoints[j].point;
					k++;
				}
				if(self.kdata[i].re == self.stationPoints[j].id){
					rp = self.stationPoints[j].point;
					k++;
				}
				if(k==2){
					k=0;
					break;
				}
			}
			var points = [lp,rp];
			if(max == min){
				max = min+1;
			}
			var weight = Math.ceil((self.kdata[i].num-min)/(max-min))*2;
			var color = colors[Math.round(Math.random()*2)];
//			var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:weight, strokeOpacity:0.5});
			var line = new BMap.Polyline(points, {strokeColor: color, strokeWeight:weight, strokeOpacity:0.3});
			self.map.addOverlay(line);
		}
		
	}

	var addEvent = function(marker, id, name){
		marker.addEventListener("click", function(e){

		});
	};

	this.showAllClassify = function(k){
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: './servlets/KMeans',
			data: {
				k: k
			},
			success: function(data){
				console.log(data);
				self.kdata = data;
				self.createClassifyMap(data);
				calculateKcenter(data);
			}
		});
	};
	
	this.createClassifyMap = function(data){
		this.map.clearOverlays();
		this.map.reset();
		var colors = getColorArr(data.length);
		var points = [];
		var options = {
            size: BMAP_POINT_SIZE_SMALL,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: '#d340c3'
        };
		
		this.map.clearOverlays();
		for(var i=0; i<data.length; i++){
			for(var j=0; j<data[i].length; j++){
				points.push(new BMap.Point(data[i][j].x, data[i][j].y));
			}
			options.color = colors[i];
			
			var pointCollection = new BMap.PointCollection(points, options);
			this.map.addOverlay(pointCollection);
			points = [];
		}
	};

	function getColorArr(length){
		var colors = [];

		while(length--){
			colors.push(getRandowColor());
		}

		return colors;
	}

	function getRandowColor(){
		return '#' + 
			(function(color){
				return (color += '0123456789abcdef'[Math.floor(Math.random()*16)]) && (color.length == 6) ? color : arguments.callee(color);
			})('');
	}
	
	function calculateKcenter(data){
		var lng=0, lat=0;
		
		for(var i=0; i<data.length; i++){
			lng = data[i][0].x;
			lat = data[i][0].y;
			for(var j=1; j<data[i].length; j++){
				lng += data[i][j].x;
				lat += data[i][j].y;
				lng /= 2;
				lat /= 2; 
			}
			var point = new BMap.Point(lng, lat);
			self.kcenter.push({point: point});
		}
	};
	
	this.showKcenter = function(){console.log(this.kcenter);
		this.map.clearOverlays();
		this.map.reset();
		var colors = getColorArr(this.kcenter.length);
		var points = [];
		var options = {
            size: BMAP_POINT_SIZE_NORMAL,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: '#d340c3'
        };
		
		for(var i=0; i<this.kcenter.length; i++){
			points.push(this.kcenter[i].point);
			
			options.color = colors[i];
			
			var pointCollection = new BMap.PointCollection(points, options);
			this.map.addOverlay(pointCollection);
			points = [];
		}
		
		this.circleStyle = 2;
	};
	
	this.findKrelationship = function(date, time){
		console.log(date,time,self.kr, self.k);
		$.ajax({
			type: 'POST',
			url: './servlets/createKfile',
			data: {
				date: date,
				time: time,
				stations: self.kr,
				k: self.k
			},
			success: function(data){
				alert('操作成功');
			}
		});
	};

};