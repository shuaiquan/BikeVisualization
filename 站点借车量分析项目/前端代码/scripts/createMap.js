var MapFunc = function(element){
	this.map = new BMap.Map(element);
	this.curves = [];

	this.initMap = function(lng,lat,zoom){
		var point = new BMap.Point(lng,lat);
		this.map.centerAndZoom(point,zoom);
		this.initControl();
		return this;
	};

	this.initControl = function(){
		this.map.addControl(new BMap.NavigationControl());		//地图平移缩放控件
		this.map.addControl(new BMap.OverviewMapControl());		//可折叠缩略图控件
	};

	this.getStaMarker = function(){
		var url = './scripts/stations_baidu.json';
		this.httpFunc(url,this);
	};

	this.httpFunc = function(url,obj){
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			success: function(data){
				obj.createMarkers(data);
				obj.drawManager(data);
			},
			error: function(err){
				console.log('获取站点数据出错:'+err.status);
			}
		});
	};
	
	this.createMarkers = function(stations){
		var marker;
		var markers = [];
		var markerClusterer = new BMapLib.MarkerClusterer(this.map);
		markerClusterer.setMaxZoom(14);
		markerClusterer.isAverageCenter(true);

		var styleOpt = [
			{'url':'images/m0-new.png','size': new BMap.Size(53,53)},
			{'url':'images/m1-new.png','size': new BMap.Size(56,56)},
			{'url':'images/m2-new.png','size': new BMap.Size(66,66)},
			{'url':'images/m3-new.png','size': new BMap.Size(78,78)},
			{'url':'images/m4-new.png','size': new BMap.Size(90,90)}
		];
		markerClusterer.setStyles(styleOpt);
		
		var newIcon = new BMap.Icon('images/11.png',new BMap.Size(20,20));

		for(var i=0;i<stations.length;i++){
			marker = new BMap.Marker(new BMap.Point(stations[i].x,stations[i].y));
			markers.push(marker);
			this.addMarkerEvent(marker, stations[i].id, stations[i].name,stations[i].x,stations[i].y);
		}

		markerClusterer.addMarkers(markers);
	};
	
	this.addMarkerEvent = function(marker,id,name,lng,lat){
		var obj = this;
		marker.addEventListener('click',function(e){
			if(tabPage.chartOne == 1 || tabPage.chartTwo == 1){
				$('#managerOne').find('.manager-one-station-name').find('strong').text(name);
				$('#managerTwo').find('.manager-two-station-name').find('strong').text(name);
				tabManager.staID = id;
			}else if(tabPage.chartThree == 1){
				if(tabPage.relateSta == 1){
					obj.addRelatedStaiont(id, name, lng, lat);
				}else{
					obj.addChartThreeStations(id, name,lng,lat);
				}				
			}
			obj.markerInfoWindow(e, id, name);
		});
	};
	
	this.markerInfoWindow = function(e,id,name){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng,p.getPosition().lat);
		var content = "站点ID："+id+"<br>站点名称："+name;
		var infoWindow = new BMap.InfoWindow(content,{width:160,title:'站点信息'});
		this.map.openInfoWindow(infoWindow,point);
	};
	
	this.addChartThreeStations = function(id,name,lng,lat){
		var div = '<div class="station-name" id="'+id+'"><p>'+name+'</p><ul><li class="delete-station">x</li></ul></div>';
		$(div).appendTo($('#managerThree .manager-three-top .manager-three-operate-middle'));
		tabManager.sta_info.push({'id':id,'name':name,'lng':lng,'lat':lat});
		tabManager.chartThree_stations++;
	};
	
	this.drawManager = function(data){
		var obj = this;
		var styleOptions = {
		        strokeColor:"blue",    //边线颜色。
		        fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
		        strokeWeight: 2,       //边线的宽度，以像素为单位。
		        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
//		        fillOpacity: 0.4,
		        strokeStyle: 'solid' //边线的样式，solid或dashed。
		};
		
		var drawingManager = new BMapLib.DrawingManager(this.map,{
			isOpen: false,
			enableDrawingTool: true,
			drawingToolOptions: {
	            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
	            offset: new BMap.Size(5, 5), //偏离值
	            drawingModes : [BMAP_DRAWING_CIRCLE]
	        },
	        circleOptions: styleOptions
		});
		
		drawingManager.addEventListener('circlecomplete',function(e,circle){
			this.close();
			$('#managerThree').find('.manager-three-top').find('.manager-three-operate-middle').empty();
			tabManager.chartThree_stations = 0;
			tabManager.sta_info = [];
			
			if(tabPage.chartThree == 0){
				alert("请在多站点比较下点击选择站点后使用！");
				obj.map.removeOverlay(circle);
			}else if(tabPage.chartThree == 1){
				var point = null;
				for(var i=0;i<data.length;i++){
					point = new BMap.Point(data[i].x,data[i].y);
					if(	BMapLib.GeoUtils.isPointInCircle(point, circle)){
						obj.addChartThreeStations(data[i].id, data[i].name,data[i].x,data[i].y);
					}
				}
			}
		});
		
	};
	
	this.addRelatedStaiont = function(id,name,lng,lat){
		var obj = this;
		//首先清空站点
		$('#managerThree').find('.manager-three-top').find('.manager-three-operate-middle').empty();
		tabManager.chartThree_stations = 0;
		tabManager.sta_info = [];
		
		var point = new BMap.Point(lng,lat);
		//请求查找相关联的站点
		$.ajax({
			url: '/traffic5/servlets/getRelatedSta',
			type: 'POST',
			dataType: 'json',
			data: {
				id: id
			},
			success: function(data){
//				console.log(data,point);
				obj.createRelatedLine(data, point);
			},
			error: function(err){
				console.log('获取关联站点时发生错误：'+err.status,err);
			}
		});
		
		//添加选择的当前站点
		var div = '<div class="station-name" id="'+id+'"><p>'+name+'</p><ul><li class="delete-station">x</li></ul></div>';
		$(div).appendTo($('#managerThree .manager-three-top .manager-three-operate-middle'));
		tabManager.sta_info.push({'id':id,'name':name,'lng':lng,'lat':lat});
		tabManager.chartThree_stations++;
	};
	
	this.createRelatedLine = function(data,centerPoint){
		var max=0;console.log(data);
		for(var i=0;i<data.length;i++){
			if(data[i].num > max){
				max = data[i].num;
			}
		}
		
		var point;
		if(this.curves.length > 0){
			for(var j=0;j<this.curves.length;j++){
				this.map.removeOverlay(this.curves[j]);
			}
		}
		for(var i=0;i<data.length;i++){
			this.addChartThreeStations(data[i].id, data[i].name, data[i].x, data[i].y);
			point = new BMap.Point(data[i].x,data[i].y);
			var weight = parseInt(max == 0?0:(data[i].num/max)*8);
			console.log(weight);
			var curve = new BMapLib.CurveLine([centerPoint,point],{strokeColor:"red", strokeWeight:weight,strokeOpacity:0.9});
			this.map.addOverlay(curve);
			this.curves.push(curve);
		}
	};
};

$(function(){
	var map = new MapFunc('myMap');
	map.initMap(120.164785,30.2803185,14).getStaMarker();
//	map.drawManager();
});