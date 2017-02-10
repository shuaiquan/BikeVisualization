$(function(){

	var data;

	$.ajax({
		url: './js/test.json',
		type: 'GET',
		success: function(d){
			console.log(d);
			data = d;
			createChart();
		},
		error: function(err){
			console.log(err);
		}
	});

	function createChart(){

		var datas = [];
		for(var i=0; i<data.length; i++){
			for(var j=0; j<data[i].length; j++){
				datas.push(data[i][j]);
			}
		}

		for(i=0; i<datas.length; i++){
			var chart = echarts.init(document.getElementById('chart'+(i+1)));
			var option = getOptions(datas[i]);
			chart.setOption(option);
		}
	}

	function getOptions(arr){
		return option = {
		    title: {
		        text: '堆叠区域图'
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['访问次数']
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'访问次数',
		            type:'line',
		            stack: '总量',
		            areaStyle: {normal: {}},
		            data:arr
		        }
		    ]
		};

	}
});