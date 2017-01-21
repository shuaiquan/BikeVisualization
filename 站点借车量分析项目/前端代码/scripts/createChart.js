var ChartFunc = function(element){
	this.mychart = echarts.init(document.getElementById(element));
	
	this.chartData = [];	//保存图表的数据
	this.chartX = [];		//保存x轴的数据
	this.chartY = [];		//保存Y轴的数据
	this.maxNum = 0;
	this.minNum = 0;
	
	this.initMyChart = function(){
		this.mychart.setOption({
			title: {
				text: '杭州自行车站点租借情况'
			},
			legend: {
				data: ['借车量']
			},
			xAxis: {
				data: [0]
			},
			yAxis: {},
			toolbox: {
				feature: {
					saveAsImage: {
						show: true
					}
				}
			}
		});
	};
	
	this.chartSetOption = function(width,height){
		var obj = this;
		this.mychart.hideLoading();
		this.mychart.setOption({
			grid:{
				left: 'center',
				height: height,
				width: width
			},
			tooltip:{
				position:'top',
				formatter: function(params){
					return 'num:'+params.value[2];
//					return chartOne_Y[params.value[1]].value+'日，共有'+params.value[2]+'量自行车在'+chartOne_X[params.value[0]]+'点后的一小时内借出';
				}
			},
			xAxis: {
				type: 'category',
				data: obj.chartX,
				boundaryGap: false,
				splitLine: {
					show: true,
					lineStyle: {
						color: ['#ddb','#dcc'],
						type: 'dashed'
					}
				},
				silent:false
			},
			yAxis: {
				type: 'category',
				data: obj.chartY,
				axisLine: {
					show: true
				}
			},
			series: [{
		        name: '借车量',
		        type: 'scatter',
		        symbol: 'circle',		//'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
		        symbolSize: function (val) {
		        	//return val[2];
		        	if(obj.maxNum == 0){
		        		return 0;
		        	}else{
		        		if(val[2] == 0){
		        			return 0;
		        		}else{
		        			return (val[2]/obj.maxNum)*32;
		        		}
		        	}
		        },
		        data: obj.chartData
		    }]
		});
	};
	
	//每次重新生成图表时，初始化数据
	this.initData = function(){
		this.chartData = [];	//保存图表的数据
		this.chartX = [];		//保存x轴的数据
		this.chartY = [];		//保存Y轴的数据
		this.maxNum = 0;
		this.minNum = 0;
	};
	
	//判断是不是周末
	this.isWeekend = function(dateString){
		var date = new Date(dateString);
		if(date.getDay() == 0 || date.getDay() == 6){
			return true;
		}else{
			return false;
		}
	};
	
	//判断是否是节假日
	this.isHoliday = function(dateString){
		var holiday = ['2014-04-04','2014-04-05','2014-04-06','2014-05-01','2014-05-02','2014-05-03','2014-05-31','2014-06-01','2014-06-02'];
		if($.inArray(dateString,holiday) != -1){
			return true;
		}else{
			return false;
		}
	};
	
	//将DATE型转化为字符串如2014-05-05的形式
	this.dateToString = function(date){
		var dateString = date.toISOString().substr(0,10);	//将date对象转化为字符串
		return dateString;
	};
	
	//执行函数的入口
	this.executeFunc = function(){
		this.initMyChart();
		var obj = this;
		$('#createChart').click(function(){
			obj.initData();
			obj.mychart.showLoading();
			if(tabPage.chartOne == 1){
				obj.createChartOne();
			}else if(tabPage.chartTwo == 1){
				obj.createChartTwo();
			}else if(tabPage.chartThree == 1){
				obj.createChartThree();
			}
		});
		return this;
	};
	
	this.createChartOne = function(){
		this.initChartOneX();
		if(tabManager.chartOne_days == 1){
			var firstDate = new Date($('#date1').val());
			var date = new Date();
			var days = [];
			for(var i=0;i<7;i++){
				date.setTime(firstDate.getTime()+1000*60*60*24*i);
				var dateString = this.dateToString(date);
				this.initChartOneY(dateString);
				days.push(dateString);
			}
			this.getDataOne(days);
			
		}else if(tabManager.chartOne_days > 1){
			var days = [];
			for(var i=1;i<=tabManager.chartOne_days;i++){
				var date = new Date($('#date'+i).val());
				var dateString = this.dateToString(date);
				this.initChartOneY(dateString);
				days.push(dateString);
			}
			this.getDataOne(days);
		}
	};
	
	//获取方式一的图表数据
	this.getDataOne = function(days){
		var obj = this;
		$.ajax({
			url: '/traffic5/servlets/getChartOneData',
			type:'POST',
			dataType: 'json',
			data: {
				days: days,
				id: tabManager.staID
			},
			success: function(data){
				console.log(data);
				obj.addDataChartOne(data);
			},
			error: function(err){
				console.log('获取图表一数据时发生错误：'+err.status,err);
			}
		});
	};
	
	//初始化图表一的X轴数据
	this.initChartOneX = function(){
		this.chartX = ['','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'];
	};
	
	//初始化图表一的Y轴数据
	this.initChartOneY = function(dateString){
		var color = '#000000';
		if(this.isHoliday(dateString)){
			color = '#DB0808';
		}else if(this.isWeekend(dateString)){
			color = '#06038E';
		}
		
		var dateObj = {
				value: dateString,
				textStyle: {
					color: color
				}
		};
		
		this.chartY.push(dateObj);
	};
	
	this.addDataChartOne = function(data){
		this.formatDataOne(data);
		console.log(this.chartData);
		
		var chart_height;
		var chart_width = 700;

		if(tabManager.chartOne_days == 2){
			chart_height = 60*2;
		}else if(tabManager.chartOne_days == 3){
			chart_height = 55*3;
		}else if(tabManager.chartOne_days == 1){
			chart_height = 50*7;
		}else{
			chart_height = 50*tabManager.chartOne_days;
		}
		this.chartSetOption(chart_width, chart_height);
	};
	
	this.formatDataOne = function(data){
		for(var i=0;i<data.length;i++){
			for(var j=0;j<17;j++){
				var dataSingle = [];
				dataSingle.push(j);
				dataSingle.push(i);
				dataSingle.push(data[i][j].num);
				this.chartData.push(dataSingle);
				
				if(data[i][j].num > this.maxNum){
					this.maxNum = data[i][j].num;
				}
			}
		}
	};
	
	this.createChartTwo = function(){
		this.initChartTwoX();
		var days = [];
		for(var i=0;i<tabManager.chartTwo_weeks;i++){
			var weekString = $('#week'+(i+1)).val();
			var date = new Date(weekString);
			switch(date.getDay()){
				case 0:this.weekDataFromSun(date,days);break;
				case 1:this.weekDataFromMon(date,days);break;
				case 2:this.weekDataFromTue(date,days);break;
				case 3:this.weekDataFromWed(date,days);break;
				case 4:this.weekDataFromThu(date,days);break;
				case 5:this.weekDataFromFri(date,days);break;
				case 6:this.weekDataFromSat(date,days);break;
			}
		}
		this.getDataTwo(days);
	};
	
	this.getDataTwo = function(days){console.log(days);
		var obj = this;
		$.ajax({
			url: '/traffic5/servlets/getChartTwoData',
			type: 'POST',
			dataType: 'json',
			data: {
				days: days,
				id: tabManager.staID
			},
			success: function(data){
				console.log(data);
				obj.addDataChartTwo(data);
			},
			error: function(err){
				console.log('获取图表二的数据时发生错误：'+err,status);
			}
		});
	};
	
	this.formatChartTwoData = function(data){
		for(var i=0,j=0;i<data.length;i++,j++){
			var week = [];
			week.push(i%8);
			week.push(parseInt(j/8));
			week.push(data[i].num);
			this.chartData.push(week);
			
			if(data[i].num>this.maxNum){
				this.maxNum = data[i].num;
			}
		}
	};
	
	this.addDataChartTwo = function(data){
		this.formatChartTwoData(data);
		
		var chart_height;
		var chart_width = 400;
		if(tabManager.chartTwo_weeks == 1){
			chart_height = 70;
		}else if(tabManager.chartTwo_weeks == 2){
			chart_height = 60*2;
		}else if(tabManager.chartTwo_weeks == 3){
			chart_height = 50*3;
		}else{
			chart_height = 50*tabManager.chartTwo_weeks;
		}
		
		this.chartSetOption(chart_width, chart_height);
	};
	
	this.weekDataFromSun = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime());
		beginDate.setTime(firstday.getTime()-1000*60*60*24*6);
		this.initChartTwoY(beginDate, endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.weekDataFromMon = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime()+1000*60*60*24*6);
		beginDate.setTime(firstday.getTime());
		this.initChartTwoY(beginDate,endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.weekDataFromTue = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime()+1000*60*60*24*5);
		beginDate.setTime(firstday.getTime()-1000*60*60*24*1);
		this.initChartTwoY(beginDate,endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.weekDataFromWed = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime()+1000*60*60*24*4);
		beginDate.setTime(firstday.getTime()-1000*60*60*24*2);
		this.initChartTwoY(beginDate,endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.weekDataFromThu = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime()+1000*60*60*24*3);
		beginDate.setTime(firstday.getTime()-1000*60*60*24*3);
		this.initChartTwoY(beginDate,endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.weekDataFromFri = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime()+1000*60*60*24*2);
		beginDate.setTime(firstday.getTime()-1000*60*60*24*4);
		this.initChartTwoY(beginDate,endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.weekDataFromSat = function(firstday,days){
		var beginDate = new Date();
		var endDate = new Date();
		var date = new Date();
		var dateString = '';
		
		endDate.setTime(firstday.getTime()+1000*60*60*24*1);
		beginDate.setTime(firstday.getTime()-1000*60*60*24*5);
		this.initChartTwoY(beginDate,endDate);
		
		for(var i=0;i<7;i++){
			date.setTime(beginDate.getTime()+1000*60*60*24*i);
			dateString = this.dateToString(date);
			days.push(dateString);
		}
	};
	
	this.initChartTwoX = function(){
		this.chartX = ['','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.'];
	};
	
	this.initChartTwoY = function(beginDate,endDate){
		var bString = this.dateToString(beginDate);
		var eString = this.dateToString(endDate);
		var rowStr = bString + '~' + eString;
		this.chartY.push(rowStr);
	};
	
	this.createChartThree = function(){
		if(tabManager.chartThree_days == 1){
			this.initChartThreeX();
			var stations = [];
			var days = [];
			var dateString = $('#T-date1').val();
			days.push(dateString);
			for(var i=0;i<tabManager.chartThree_stations;i++){
				stations.push(tabManager.sta_info[i].id);
				this.initChartThreeY(tabManager.sta_info[i].name);
			}
			this.getDataThree(stations,days);
		}else if(tabManager.chartThree_days > 1){
			var i=0;
			var days = [];
			for(i=0;i<tabManager.chartThree_days;i++){
				var dateString = $('#T-date'+(i+1)).val();
				days.push(dateString);
			}
			this.initChartThreeX(days);
			var stations = [];
			for(i=0;i<tabManager.chartThree_stations;i++){
				stations.push(tabManager.sta_info[i].id);
				this.initChartThreeY(tabManager.sta_info[i].name);
			}
			this.getDataThree(stations,days);
		}
	};
	
	this.getDataThree = function(stations,days){
		var obj = this;
		$.ajax({
			url: '/traffic5/servlets/getChartThreeData',
			type: 'POST',
			datatype: 'json',
			data: {
				days: days,
				stations: stations
			},
			success: function(data){
				console.log(data);
				obj.addDataChartThree(data);
			},
			error: function(err){
				console.log('获取图标三的数据时发生错误：'+err.status);
			}
		});
	};
	
	this.formatChartThreeData = function(data){
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[0].length;j++){
				var dataSingle = [];
				dataSingle.push(j);
				dataSingle.push(i);
				dataSingle.push(data[i][j].num);
				this.chartData.push(dataSingle);
				
				if(data[i][j].num > this.maxNum){
					this.maxNum = data[i][j].num;
				} 
			}
		}
	};
	
	this.addDataChartThree = function(data){
		this.formatChartThreeData(data);
		
		var chart_height;
		var chart_width = 800;
		
		if(tabManager.chartThree_days == 1){
			chart_width = 800;
		}else if(tabManager.chartThree_days == 2){
			chart_width = 310;
		}else if(tabManager.chartThree_days == 3){
			chart_width = 420;
		}else if(tabManager.chartThree_days == 4){
			chart_width = 520;
		}else if(tabManager.chartThree_days == 5){
			chart_width = 620;
		}else if(tabManager.chartThree_days == 6){
			chart_width = 720;
		}else if(tabManager.chartThree_days == 7){
			chart_width = 820;
		}else if(tabManager.chartThree_days == 8){
			chart_width = 920;
		}else{
			chart_width = 1000;
		}

		if(tabManager.chartThree_stations == 1){
			chart_height = 80;
		}else if(tabManager.chartThree_stations == 2){
			chart_height = 60*2;
		}else if(tabManager.chartThree_stations == 3){
			chart_height = 55*3;
		}else{
			chart_height = 45*tabManager.chartThree_stations;
		}

		this.chartSetOption(chart_width, chart_height);
		this.createNewWindowMap();
	};
	
	this.initChartThreeX = function(days){
		if(days == undefined){
			this.chartX = ['','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21'];
		}else{
			for(var i=0;i<days.length;i++){
				var color = '#000000';
				if(this.isHoliday(days[i])){
					color = '#DB0808';
				}else if(this.isWeekend(days[i])){
					color = '#06038E';
				}
				
				var dateObj = {
						value: days[i],
						textStyle: {
							color: color
						}
				};
				if(i==0){
					var obj0 = {
						value: '',
						textStyle: {
							color: '#000000'
						}
					}
					this.chartX.push(obj0);
				}
				
				this.chartX.push(dateObj);
			} 
		}
	};
	
	this.initChartThreeY = function(staName){
		this.chartY.push(staName);
	};
	
	this.sortAllFunc = function(){
		var obj = this;
		$('#sortAll').click(function(){
			obj.mychart.showLoading();
			var length = 0;
			if(tabPage.chartOne == 1){
				length = 17;
			}else if(tabPage.chartTwo == 1){
				length = 8;
			}else if(tabPage.chartThree == 1){
				if(tabManager.chartThree_days == 1){
					length = 17;
				}else if(tabManager.chartThree_days > 1){
					length = tabManager.chartThree_days+1;
				}
			}
			obj.sortAllData(length);
			obj.chartWidthHeight();
		});
		
		return this;
	};
	
	this.sortAllData = function(length){
		var num = [];	//保存每一行的总数
		var i=0,j=0,k=0,t=0;
		for(i=0;i<this.chartData.length;i++){
			if(i%length == 0){
				if(i!=0){
					num.push(rowNum);
				}
				var rowNum = 0;
			}
			rowNum+=this.chartData[i][2];
		}
		num.push(rowNum);
		//console.log(num);
		for(i=0;i<(num.length-1);i++){
			for(j=0;j<(num.length-1-i);j++){
				if(num[j]>num[j+1]){
					//交换Y坐标
					t = this.chartY[j];
					this.chartY[j] = this.chartY[j+1];
					this.chartY[j+1] = t;
					
					//交换总数
					t = num[j];
					num[j] = num[j+1];
					num[j+1] = t;
					
					//交换行中的每一项
					for(k=0;k<length;k++){
						t = this.chartData[j*length+k][2];
						this.chartData[j*length+k][2] = this.chartData[(j+1)*length+k][2];
						this.chartData[(j+1)*length+k][2] = t;
					}
				}
			}
		}
	};
	
	this.chartWidthHeight = function(){
		var chart_width = 0;
		var chart_height = 0;
		if(tabPage.chartOne == 1){
			
			if(tabManager.chartOne_days == 2){
				chart_height = 60*2;
			}else if(tabManager.chartOne_days == 3){
				chart_height = 55*3;
			}else if(tabManager.chartOne_days == 1){
				chart_height = 50*7;
			}else{
				chart_height = 50*tabManager.chartOne_days;
			}
			
			chart_width = 700;
		}else if(tabPage.chartTwo == 1){
			
			if(tabManager.chartTwo_weeks == 1){
				chart_height = 70;
			}else if(tabManager.chartTwo_weeks == 2){
				chart_height = 60*2;
			}else if(tabManager.chartTwo_weeks == 3){
				chart_height = 50*3;
			}else{
				chart_height = 50*tabManager.chartTwo_weeks;
			}
			
			chart_width = 400;
			
		}else if(tabPage.chartThree ==1){
			
			if(tabManager.chartThree_days == 1){
				chart_width = 800;
			}else if(tabManager.chartThree_days == 2){
				chart_width = 310;
			}else if(tabManager.chartThree_days == 3){
				chart_width = 420;
			}else if(tabManager.chartThree_days == 4){
				chart_width = 520;
			}else if(tabManager.chartThree_days == 5){
				chart_width = 620;
			}else if(tabManager.chartThree_days == 6){
				chart_width = 720;
			}else if(tabManager.chartThree_days == 7){
				chart_width = 820;
			}else if(tabManager.chartThree_days == 8){
				chart_width = 920;
			}else{
				chart_width = 1000;
			}

			if(tabManager.chartThree_stations == 1){
				chart_height = 80;
			}else if(tabManager.chartThree_stations == 2){
				chart_height = 60*2;
			}else if(tabManager.chartThree_stations == 3){
				chart_height = 55*3;
			}else{
				chart_height = 45*tabManager.chartThree_stations;
			}
			
		}
		this.chartSetOption(chart_width, chart_height);
	};
	
	this.sortColFunc = function(){
		var obj = this;
		
		this.mychart.on('click',function(params){
			var length = 0;
			if(tabPage.chartOne == 1){
				length = 17;
			}else if(tabPage.chartTwo == 1){
				length = 8;
			}else if(tabPage.chartThree == 1){
				if(tabManager.chartThree_days == 1){
					length = 17;
				}else if(tabManager.chartThree_days > 1){
					length = tabManager.chartThree_days+1;
				}
			}
			
			if(params.componentType == 'xAxis'){
				obj.sortColData(length, params.value);
				obj.chartWidthHeight();
			}
		});
	};
	
	this.sortColData = function(length,value){
		if(tabPage.chartThree == 1 && tabManager.chartThree_days > 1){
			for(var s=0;s<this.chartX.length;s++){
				if(value == this.chartX[s].value){
					var index = s;
				}
			}
		}else{
			var index = this.chartX.indexOf(value);
		}
		
		console.log(index);
		var colNum = [];
		var i=0,j=0,k=0,t=0;
		for(i=0;i<this.chartY.length;i++){
			console.log(this.chartData,i*length+index);
			colNum.push(this.chartData[i*length+index][2]);
		}
//		console.log(colNum);
		for(i=0;i<(this.chartY.length-1);i++){
			for(j=0;j<(this.chartY.length-1-i);j++){
				if(colNum[j]>colNum[j+1]){
					//交换Y坐标
					t = this.chartY[j];
					this.chartY[j] = this.chartY[j+1];
					this.chartY[j+1] = t;
					
					//交换列的值
					t = colNum[j];
					colNum[j] = colNum[j+1];
					colNum[j+1] = t;
					
					//交换行中的每一项
					for(k=0;k<length;k++){
						t = this.chartData[j*length+k][2];
						this.chartData[j*length+k][2] = this.chartData[(j+1)*length+k][2];
						this.chartData[(j+1)*length+k][2] = t;
					}
				}
			}
		}
	};
	
	this.createNewWindowMap = function(){		
		var length = 0;
		if(tabPage.chartOne == 1){
			length = 17;
		}else if(tabPage.chartTwo == 1){
			length = 8;
		}else if(tabPage.chartThree == 1){
			if(tabManager.chartThree_days == 1){
				length = 17;
			}else if(tabManager.chartThree_days > 1){
				length = tabManager.chartThree_days+1;
			}
		}
		
		var num = [];	//保存每一行的总数
		var i=0,j=0,k=0,t=0;
		for(i=0;i<this.chartData.length;i++){
			if(i%length == 0){
				if(i!=0){
					num.push(rowNum);
				}
				var rowNum = 0;
			}
			rowNum+=this.chartData[i][2];
		}
		num.push(rowNum);
		
		var staStr = JSON.stringify(tabManager.sta_info);
		var numStr = JSON.stringify(num);
		localStorage.stations = staStr;
		localStorage.num = numStr;
		
		window.open('newMap.html','多站点的空间比较'/*,'height=200,width=500px,top=0,fight=0,resizable=yes'*/);
	};
};

$(function(){
	var myChart = new ChartFunc('mychart');
	myChart.executeFunc().sortAllFunc().sortColFunc();
});