var $ = require('jquery')
12345 5678
var tbody =
	'<table class="table table-striped table-bordered table-hover dataTable" id="alarm-table" >' +
		'<thead>' +
			'<tr>' +
				'<th style="width:3%;">序号</th>' +
				'<th style="width:5%;">省份</th>' +
				'<th style="width:5%;">地市</th>' +
				'<th style="width:7%;">预警类型</th>' +
				'<th style="width:7%;">预警日期</th>' +
				'<th style="width:7%;">指派日期</th>' +
				'<th style="width:5%;">指派人</th>' +
				'<th style="width:7%;">处理状态</th>' +
				'<th style="width:5%;">处理人</th>' +
				'<th style="width:5%;">操作</th>' +
			'</tr>' +
		'</thead>' +
		'<tbody></tbody>' +
	'</table>'
		
var columnDefs = [
	{
		className:'digit-center',
		searchable: false,
		orderable: false,
		targets: 0
	}, {
		// 省份
		data: 'PCOM_NAME',
		targets: 1
	}, {
		// 地市
		data: 'CCOM_NAME',
		targets: 2,
	},{
		// 预警类型
		data: 'ALARM_NAME',
		targets: 3
	},{
		// 预警日期
		className:'digit-center',
		data: 'ALARM_DATE',
		render: function(data, type, full, meta) {
			if( !isNaN( data ) ){
				return data.substr(0, 4) + '年' + data.substr(4, 2) + '月' + data.substr(6, 2) + '日'
			}else{
				return data
			}
		},
		targets: 4
	}, {
		// 指派日期
		className:'digit-center',
		data: 'CRT_DATE',
		render: function(data, type, full, meta) {
			if( !isNaN( data ) ){
				return data.substr(0, 4) + '年' + data.substr(4, 2) + '月' + data.substr(6, 2) + '日'
			}else{
				return data
			}
		},
		targets: 5
	}, {
		// 指派人
		data: 'CRT_NAME',
		targets: 6
	}, {
		// 处理状态
		data: 'STATUS_NAME',
		targets: 7
	}, {
		// 处理人
		data: 'DEAL_NAME',
		targets: 8
	}
]
var columnSalesman = [
	{
		// 反馈
		className:'digit-center',
		render: function(data, type, full, meta) {
			return '<span taskid="' + full.TASK_ID + '" alarmid="' + full.ALARM_ID + '" desc="' + full.TASK_CONTENT + '" feedback="' + full.TASK_FEEDBACK + '" status="' + full.STATUS + '" class="handCursor feedback">反馈</span>'
		},
		targets: 9,
		orderable: false,
	}
]
var columnCenter = [
	{
		// 反馈
		className:'digit-center',
		render: function(data, type, full, meta) {
			return '<span taskid="' + full.TASK_ID + '" alarmid="' + full.ALARM_ID + '" desc="' + full.TASK_CONTENT + '" feedback="' + full.TASK_FEEDBACK + '" status="' + full.STATUS + '" class="handCursor feedback">处理情况</span>'
			},
			targets: 9,
			orderable: false,
		}
]
exports.init = function( param ) {
	if ( param ){//营销中心
		columnDefs.push( columnCenter[0] )
	} else {
		columnDefs.push( columnSalesman[0] )
	}
	$('#table-cont').html( tbody )
	var tableHeigth = Math.max($(document).height() - 560, 371)
	var _table = $('#alarm-table').on( 'processing.dt', function ( e, settings, processing ) { 			
			if( processing ){ 				
				$('#table-cont').scmrLoading() 			
			}else{ 				
				$('#table-cont').unScmrLoading() 			
			}
		}).DataTable({
		ajax:{
			url: 'taskassign.cmd?method=getAssignInfo',
			type: 'POST',
			data: function(d) {
				d.monthId = $('#month-id').val()
			}
		},
		buttons:[
			{
				extend:'excel',
				title:'指派任务查询',
				exportOptions: {
					columns:[0, 1, 2, 3, 4, 5, 6, 7, 8]
				}
			}
		],
		columnDefs: columnDefs,
		paging: false,
		scrollY: tableHeigth + 'px',
		order: [[7, 'desc']]
	})
	//当表格排序或者搜索时，更新“序号”值
	_table.on( 'order.dt search.dt', function () {
		_table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
			cell.innerHTML = i+1;
		} );
	} ).draw();	
		
	$('#search-btn').on('click', function() {
		_table.ajax.reload()
	})

	
	$('#table-cont').on('click', '.feedback', function(e) {
		var taskid = $(this).attr("taskid")
		var alarmid = $(this).attr("alarmid")
		var desc = $(this).attr("desc")
		var feedback = $(this).attr("feedback")
		var status = $(this).attr("status")
		var pcomName = $(this).parents("tr").children().eq(1).html()
		var ccomName = $(this).parents("tr").children().eq(2).html()
		var alarmName = $(this).parents("tr").children().eq(3).html()
		var alarmDate = $(this).parents("tr").children().eq(4).html()
		var crtDate = $(this).parents("tr").children().eq(5).html()
		var crtName = $(this).parents("tr").children().eq(6).html()
		var mainHtml=
			'<form class="form-horizontal">'+
			'	<div class="form-group" style="width:680px;margin-top: 15px;">'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">省份：</label>'+
			'	<div class="col-sm-3">'+
			'		<p class="form-control-static">'+pcomName+'</p>'+
			'	</div>'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">地市：</label>'+
			'	<div class="col-sm-3">'+
			'	  <p class="form-control-static">'+ccomName+'</p>'+
			'	</div>'+
			'	</div>'+
			'	<div class="form-group" style="width:680px">'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">预警日期：</label>'+
			'	<div class="col-sm-3">'+
			'	  <p class="form-control-static">'+alarmDate+'</p>'+
			'	</div>'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">预警类型：</label>'+
			'	<div class="col-sm-3">'+
			'	  <p class="form-control-static">'+alarmName+'</p>'+
			'	</div>'+
			'	</div>'+
			'	<div class="form-group" style="width:680px">'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">指派人：</label>'+
			'	<div class="col-sm-3">'+
			'	  <p class="form-control-static">'+crtName+'</p>'+
			'	</div>'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">指派日期：</label>'+
			'	<div class="col-sm-3">'+
			'	  <p class="form-control-static">'+crtDate+'</p>'+
			'	</div>'+
			'	</div>'+
			'	<div class="form-group" style="width:680px">'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">任务描述：</label>'+
			'	<div class="col-sm-9">'+
			'		<textarea class="form-control" id="task_describe" placeholder="任务描述" style="width:480px;height:100px;" maxlength="300" readonly="readonly">'+desc+'</textarea>'+
			'	</div>'+
			'	</div> '
		var unFinishedHtml =
			'	<div class="form-group" style="width:680px">'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">反馈内容：</label>'+
			'	<div class="col-sm-9">'+
			'		<textarea class="form-control" id="feed_back" placeholder="反馈内容" style="width:480px;height:100px;" maxlength="300"></textarea>'+
			'	</div>'+
			'	</div> '+
			'</form>'	
		var finishedHtml =
			'	<div class="form-group" style="width:680px">'+
			'	<label for="" class="col-sm-3 control-label" style="font-weight: bold;">反馈内容：</label>'+
			'	<div class="col-sm-9">'+
			'		<textarea class="form-control" id="feed_back" placeholder="反馈内容" style="width:480px;height:100px;" maxlength="300" readonly="readonly">'+feedback+'</textarea>'+
			'	</div>'+
			'	</div> '+
			'</form>'
			
		if( param || status == '01' ){//已处理或者是营销中心界面
			mainHtml = mainHtml + finishedHtml
		}else {
			mainHtml = mainHtml + unFinishedHtml
		}
		
		layer.open({
			type : 1,
			area : [ '730px', '500px' ],
			shadeClose: true,
			content: mainHtml,
			title : '预警处理任务',
			btn: ['确定', '关闭'],
			close : function( idx ){
				layer.close( idx )
			},
			yes:function( index, layero ){
				if( param || status == '01' ){//已处理
					layer.closeAll();
				}else {
					var feed_back = layero.find('#feed_back').val()
					if( feed_back == '' || feed_back == null ){
						layer.alert("请输入反馈内容。")
						return
					}
					$.ajax({
						data: { 
							"FEED_BACK": feed_back, 
							"TASK_ID": taskid,
							"ALARM_ID": alarmid,
						},
						type: 'post',
						dataType: 'josn',
						url: 'taskassign.cmd?method=updateAssign',
						complete: function (req) {
							if(JSON.parse(req.responseText).ok){
								layer.msg("反馈成功。", {icon: 1})
								layer.close( index )
							}else{
								layer.msg("反馈失败，请稍后重试。", {icon: 2})
								layer.close( index )
							}
						}
					});
				}
			},
			btn2: function(){
				layer.closeAll();
			}
		})
	 
		
	})
}
