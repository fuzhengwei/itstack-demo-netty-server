/**
 * 已办业务模块JS
 *
 * @author ibm
 */

//==初始化时列表对象
var workGrid;
$(document).ready(function(){
	//==创建DataGrid对象
	workGrid = $('#myHaveDoneWorkList').datagrid({
		url:getCtxPath()+'/rest/work/myHaveDoneWork',
		method:'get',
		striped: true,
		singleSelect:true,
		pagination:true,
		rownumbers:true,
		columns:[[
			{field:"processName",title:"流程名称",width:160},
			{field:"bizInfo",title:"业务信息",width:360},
			{field:"approverName",title:"审批人",width:100},
			{field:"approveTime",title:"审批时间",width:120,
				formatter:function(value){
					var date = new Date(value);
					return date.format('yyyy-MM-dd hh:mm');
				}
			}
		]],
		toolbar:[/*{
			text:'流程跟踪',
			iconCls:'icon-trace',
			handler:traceWork
		},'-',*/{
			text:'刷新',
			iconCls:'icon-reload',
			handler:function(){$('#myHaveDoneWorkList').wingrid('reload');}
		}]
	});
});
//==流程跟踪
function traceWork(){
	var row = workGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要跟踪的流程记录。');
		return;
	}
	var url = getCtxPath()+'/rest/work/'+row.processId+'/trace';
	top.menuCall("跟踪",url);
}
