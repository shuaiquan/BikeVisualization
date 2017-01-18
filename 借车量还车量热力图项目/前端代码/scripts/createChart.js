var LinesChart = function(){
	this.mychart = echarts.init(document.getElementById('chart-one'));

	this.initChart = function(data){

		var option = {
			title : {
				'text': '公共自行车借还流量图',
				'left': 'center',
				'textStyle': {
					'color': '#000'
				}
			},
			bmap: {
	            'center': [120.13066322374, 30.240018034923],
	            'zoom': 14,
	            'roam': true,
	            'mapStyle': {
	                'styleJson': [{
	                    'featureType': 'water',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#d1d1d1'
	                    }
	                }, {
	                    'featureType': 'land',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#f3f3f3'
	                    }
	                }, {
	                    'featureType': 'railway',
	                    'elementType': 'all',
	                    'stylers': {
	                        'visibility': 'off'
	                    }
	                }, {
	                    'featureType': 'highway',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#fdfdfd'
	                    }
	                }, {
	                    'featureType': 'highway',
	                    'elementType': 'labels',
	                    'stylers': {
	                        'visibility': 'off'
	                    }
	                }, {
	                    'featureType': 'arterial',
	                    'elementType': 'geometry',
	                    'stylers': {
	                        'color': '#fefefe'
	                    }
	                }, {
	                    'featureType': 'arterial',
	                    'elementType': 'geometry.fill',
	                    'stylers': {
	                        'color': '#fefefe'
	                    }
	                }, {
	                    'featureType': 'poi',
	                    'elementType': 'all',
	                    'stylers': {
	                        'visibility': 'off'
	                    }
	                }, {
	                    'featureType': 'green',
	                    'elementType': 'all',
	                    'stylers': {
	                        'visibility': 'off'
	                    }
	                }, {
	                    'featureType': 'subway',
	                    'elementType': 'all',
	                    'stylers': {
	                        'visibility': 'off'
	                    }
	                }, {
	                    'featureType': 'manmade',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#d1d1d1'
	                    }
	                }, {
	                    'featureType': 'local',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#d1d1d1'
	                    }
	                }, {
	                    'featureType': 'arterial',
	                    'elementType': 'labels',
	                    'stylers': {
	                        'visibility': 'off'
	                    }
	                }, {
	                    'featureType': 'boundary',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#fefefe'
	                    }
	                }, {
	                    'featureType': 'building',
	                    'elementType': 'all',
	                    'stylers': {
	                        'color': '#d1d1d1'
	                    }
	                }, {
	                    'featureType': 'label',
	                    'elementType': 'labels.text.fill',
	                    'stylers': {
	                        'color': '#999999'
	                    }
	                }]
	            }
	        },
			series: {
				'type': 'lines',
				'coordinateSystem': 'bmap',
				'effect': {
		            'show': true,
		            'period': 10,
		            // 'constantSpeed': 5,
		            'trailLength': 0.2,
		            'symbol': 'triangle',
		            'symbolSize': 10
		        },
		        'lineStyle': {
		            'normal': {
		                'color': 'purple',
		                'width': 2,
		                'opacity': 0.6,
		                'curveness': 0.2	//边的曲度
		            }
		        },
		        'symbolSize': 10,
				'data': data
			}
				
		}

		this.mychart.setOption(option);
	}

}

$(function(){
	var chart = new LinesChart();
	var data = [
		[
			[120.172329,30.260222],
			[120.175491,30.235513]
		],
		[
			[120.157094,30.23726],
			[120.177216,30.252236]
		],
		[
			[120.165717,30.246495],
			[120.149332,30.231269]
		],
		[
			[120.14617,30.258475],
			[120.137547,30.231519]
		],
		[
			[120.162268,30.216041],
			[120.154507,30.236262]
		]
	];

	chart.initChart(data);
});