$(function(){
	$('#kmeans').click(function(){
		var k = $('#k-value').val();

		$.ajax({
			url: './servlet/KmeansServlet',
			type: "POST",
			data: {
				k: k
			},
			success: function(data){
				// console.log(data);
				createChart(data);
			},
			error: function(err){
				console.log(err);
			}
		});

		createEle(k*3);
	});

	function createChart(data){

		var datas = [];
		for(var i=0; i<data.length; i++){
			for(var j=0; j<data[i].length; j++){
				datas.push(data[i][j]);
			}
		}

		for(i=0; i<datas.length; i++){
			var chart = echarts.init(document.getElementById('chart'+i));
			var option = getOptions(datas[i]);
			chart.setOption(option);
		}
	}

	function createEle(count){

		var parent = document.getElementsByClassName('show-charts')[0];

		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		}

		for(var i=0; i<count; i++){
			var chart = document.createElement('div');
			chart.id = 'chart'+i;
			chart.className = 'chart';
			parent.append(chart);
		}
	}

	function getOptions(arr){

		var data = [];
		for(var i=0; i<arr.length; i++){
			data.push(arr[i].toFixed(2));
		}

		return option = {
		    title: {
		        show: false
		    },
		    tooltip : {
		    	show: true,
		        trigger: 'axis'
		    },
		    legend: {
		        data:[{
		        	name: '访问次数',
		        	icon: 'circle'
		        }]
		    },
		    grid: {
		    	show: true,
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis :{
	            type : 'category',
	            name : '时刻',
	            boundaryGap : false,
	            data : [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
	        },
		    yAxis : {
		    	type: 'value',
		    	name: '访问次数'
		    },
		    series : [
		        {
		            name:'访问次数',
		            type:'line',
		            data:data
		        }
		    ]
		};

	}

	function getOption(arr){

		var option = {
			    title: {
			        text: '堆叠区域图'
			    },
			    tooltip : {
			        
			    },
			    legend: {
			        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
			    },
			    toolbox: {
			      
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
			            data : ['周一','周二','周三','周四','周五','周六','周日']
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'邮件营销',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[120, 132, 101, 134, 90, 230, 210]
			        },
			        {
			            name:'联盟广告',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[220, 182, 191, 234, 290, 330, 310]
			        },
			        {
			            name:'视频广告',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[150, 232, 201, 154, 190, 330, 410]
			        },
			        {
			            name:'直接访问',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[320, 332, 301, 334, 390, 330, 320]
			        },
			        {
			            name:'搜索引擎',
			            type:'line',
			            stack: '总量',

			            areaStyle: {normal: {}},
			            data:[820, 932, 901, 934, 1290, 1330, 1320]
			        }
			    ]
			};
		
		return option;
	}
});