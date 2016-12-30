var $ = require('jquery')
var Table = require('table-alarm')

$( document ).ready( function(){	//初始化时间组件
	$('#month-box').datetimepicker({
		weekStart: 1,
		autoclose: 1,
		pickerPosition: 'bottom-left',
		startView: 3,
		minView: 3,
		forceParse: 0
	})
	var monthId =$('#month-id').val()
	var year = ''
	var month = ''
	if (monthId == ''){
		var myDate = new Date()
		myDate.setMonth(myDate.getMonth() - 1)
		year = myDate.getFullYear()
		month = myDate.getMonth() + 1
	} else {
		year = monthId.substring(0,4)
		month = monthId.substring(4,6)
	}
	$('#month-box').datetimepicker('update', year + '-' + month)
	Table.init()//是否营销中心用户
	}
)

