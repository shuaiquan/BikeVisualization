var TabPage = function(){
	this.chartOne = 1;
	this.chartTwo = 0;
	this.chartThree = 0;
	this.relateSta = 0;
	
	//切换tab页面
	this.switchTab = function(){
		var obj = this;
		$('#tabOne').click(function(){
			//切换TAB
			$('#tabTwo').removeClass();
			$('#tabThree').removeClass();
			$('#tabOne').removeClass().addClass('using-tab');

			//切换操作区域
			$('#managerOne').removeClass().addClass('using-manager');
			$('#managerTwo').removeClass().addClass('free-manager');
			$('#managerThree').removeClass().addClass('free-manager');
			
			obj.chartThree = 0;		//关闭方式三
			obj.chartTwo = 0;
			obj.chartOne = 1;
			
			obj.relateSta = 0;
		});
		$('#tabTwo').click(function(){
			//切换TAB
			$('#tabOne').removeClass();
			$('#tabThree').removeClass();
			$('#tabTwo').removeClass().addClass('using-tab');

			//切换操作区域
			$('#managerTwo').removeClass().addClass('using-manager');
			$('#managerOne').removeClass().addClass('free-manager');
			$('#managerThree').removeClass().addClass('free-manager');

			obj.chartThree = 0;		//关闭方式三
			obj.chartOne = 0;
			obj.chartTwo = 1;
			
			obj.relateSta = 0;
		});
		$('#tabThree').click(function(){
			//切换TAB
			$('#tabTwo').removeClass();
			$('#tabOne').removeClass();
			$('#tabThree').removeClass().addClass('using-tab');

			//切换操作区域
			$('#managerThree').removeClass().addClass('using-manager');
			$('#managerTwo').removeClass().addClass('free-manager');
			$('#managerOne').removeClass().addClass('free-manager');
		});
		$('#manager-three-add-station').click(function(){
			obj.chartThree = 1;		//启用方式三
			obj.chartOne = 0;
			obj.chartTwo = 0;
			
			obj.relateSta = 0;
		});
		$('#manager-three-related-station').click(function(){
			obj.chartThree = 1;		//启用方式三
			obj.chartOne = 0;
			obj.chartTwo = 0;
			
			obj.relateSta = 1;
		});
	};
};

var TabManager = function(){
	this.staID = 0;
	this.chartOne_days = 0;
	this.chartTwo_weeks = 0;
	this.chartThree_days = 0;
	this.chartThree_stations = 0;
	this.sta_info = [];
	
	this.addTimeOneAndTwo = function(){
		var obj = this;
		$('#manager-one-add-date').click(function(){
			obj.chartOne_days++;
			var div = '<div class="select-time"><input type="text" readonly value="2014-04-01" id="date'+obj.chartOne_days+'" title="点我可以添加或者删除时间"><div class="add-delete"><ul><li class="add-date" title="点我可以添加时间">+</li><li class="delete-date" title="点我可以删除时间">x</li></ul></div></div>';
			$(div).appendTo('#managerOne .manager-one-operate-middle');
			$('#date'+obj.chartOne_days).datepicker({dateFormat: 'yy-mm-dd'});
		});
		$('#manager-two-add-week').click(function(){
			obj.chartTwo_weeks++;
			var div = '<div class="select-time"><input type="text" readonly value="2014-04-01" id="week'+obj.chartTwo_weeks+'" title="点我可以添加或者删除时间"><div class="add-delete"><ul><li class="add-week" title="点我可以添加时间">+</li><li class="delete-week" title="点我可以删除时间">x</li></ul></div></div>';
			$(div).appendTo('#managerTwo .manager-two-operate-middle');
			$('#week'+obj.chartTwo_weeks).datepicker({dateFormat:'yy-mm-dd'});
		});
		$('#managerOne').find('.manager-one-operate-middle').on('click','.add-date',function(){
			obj.chartOne_days++;
			var div = '<div class="select-time"><input type="text" readonly value="2014-04-01" id="date'+obj.chartOne_days+'" title="点我可以添加或者删除时间"><div class="add-delete"><ul><li class="add-date" title="点我可以添加时间">+</li><li class="delete-date" title="点我可以删除时间">x</li></ul></div></div>';
			$(div).appendTo('#managerOne .manager-one-operate-middle');
			$('#date'+obj.chartOne_days).datepicker({dateFormat: 'yy-mm-dd'});
		});
		$('#managerTwo').find('.manager-two-operate-middle').on('click','.add-week',function(){
			obj.chartTwo_weeks++;
			var div = '<div class="select-time"><input type="text" readonly value="2014-04-01" id="week'+obj.chartTwo_weeks+'" title="点我可以添加或者删除时间"><div class="add-delete"><ul><li class="add-week" title="点我可以添加时间">+</li><li class="delete-week" title="点我可以删除时间">x</li></ul></div></div>';
			$(div).appendTo('#managerTwo .manager-two-operate-middle');
			$('#week'+obj.chartTwo_weeks).datepicker({dateFormat:'yy-mm-dd'});
		});
		
		return this;
	};
	
	this.deleteTimeOneAndTwo = function(){
		var obj = this;
		$('#managerOne').find('.manager-one-operate-middle').on('click','.delete-date',function(){
			if(obj.chartOne_days>0){
				$(this).parent().parent().parent().remove();
				obj.chartOne_days--;
				for(var i=0;i<obj.chartOne_days;i++){
					$('#managerOne .manager-one-operate-middle').find("input:eq("+i+")").attr('id','date'+(i+1));
				}
			}else{
				alert('时间已清空');
			}
		});
		$('#managerTwo').find('.manager-two-operate-middle').on('click','.delete-week',function(){
			if(obj.chartTwo_weeks>0){
				$(this).parent().parent().parent().remove();
				obj.chartTwo_weeks--;
				for(var i=0;i<obj.chartTwo_weeks;i++){
					$('#managerTwo .manager-two-operate-middle').find("input:eq("+i+")").attr('id','week'+(i+1));
				}
			}else{
				alert('时间已清空');
			}
		});
		
		return this;
	};
	
	this.addTimeThree = function(){
		var obj = this;
		$('#manager-three-add-date').click(function(){
			obj.chartThree_days++;
			var div = '<div class="select-time"><input type="text" readonly value="2014-04-01" id="T-date'+obj.chartThree_days+'" title="点我可以添加或者删除时间"><div class="add-delete"><ul><li class="add-date" title="点我可以添加时间">+</li><li class="delete-date" title="点我可以删除时间">x</li></ul></div></div>';
			$(div).appendTo('#managerThree .manager-three-bottom .manager-three-operate-middle');
			$('#T-date'+obj.chartThree_days).datepicker({dateFormat:'yy-mm-dd'});
		});
		$('#managerThree').find('.manager-three-bottom').find('.manager-three-operate-middle').on('click','.add-date',function(){
			obj.chartThree_days++;
			var div = '<div class="select-time"><input type="text" readonly value="2014-04-01" id="T-date'+obj.chartThree_days+'" title="点我可以添加或者删除时间"><div class="add-delete"><ul><li class="add-date" title="点我可以添加时间">+</li><li class="delete-date" title="点我可以删除时间">x</li></ul></div></div>';
			$(div).appendTo('#managerThree .manager-three-bottom .manager-three-operate-middle');
			$('#T-date'+obj.chartThree_days).datepicker({dateFormat:'yy-mm-dd'});
		});
		
		return this;
	};
	
	this.deleteTimeThree = function(){
		var obj = this;
		$('#managerThree').find('.manager-three-bottom').find('.manager-three-operate-middle').on('click','.delete-date',function(){
			if(obj.chartThree_days>0){
				$(this).parent().parent().parent().remove();
				obj.chartThree_days--;
				for(var i=0;i<obj.chartThree_days;i++){
					$('#managerThree .manager-three-bottom .manager-three-operate-middle').find("input:eq("+i+")").attr('id','T-date'+(i+1));
				}
			}else{
				alert('时间已清空');
			}
		});
		
		return this;
	};
	
	this.deleteStationThree = function(){
		var obj = this;
		$('#managerThree .manager-three-top .manager-three-operate-middle').on('click','.delete-station',function(){
			var del_id = $(this).parent().parent().attr('id');		//站点的id 
			var del = 0;
			for(var i=0;i<obj.sta_info.length;i++){
				if(obj.sta_info[i].id == parseInt(del_id)){
					obj.sta_info[i] = obj.sta_info[i+1];
					del = 1;
				}
				if(del == 1){
					obj.sta_info[i] = obj.sta_info[i+1];
				}
			}
			obj.sta_info.pop();
			$(this).parent().parent().remove();
			obj.chartThree_stations--;
		});
		
		return this;
	};
	
	this.clearFunc = function(){
		var obj = this;
		$('#cleanOne').click(function(){
			$('#managerOne').find('.manager-one-operate-middle').empty();
			obj.chartOne_days = 0;
		});
		$('#cleanTwo').click(function(){
			$('#managerTwo').find('.manager-two-operate-middle').empty();
			obj.chartTwo_weeks = 0;
		});
		$('#cleanThreeStations').click(function(){
			$('#managerThree').find('.manager-three-top').find('.manager-three-operate-middle').empty();
			obj.chartThree_stations = 0;
			obj.sta_info = [];
		});
		$('#cleanThreeDate').click(function(){
			$('#managerThree').find('.manager-three-bottom').find('.manager-three-operate-middle').empty();
			obj.chartThree_days = 0;
		});
		
		return this;
	};
	
	this.executeFunc = function(){
		this.addTimeOneAndTwo().deleteTimeOneAndTwo().addTimeThree().deleteTimeThree().deleteStationThree().clearFunc();
	};
};

$(function(){
	var tabPage = new TabPage();
	tabPage.switchTab();
	var tabManager = new TabManager();
	tabManager.executeFunc();
	window.tabPage = tabPage;
	window.tabManager = tabManager;
});