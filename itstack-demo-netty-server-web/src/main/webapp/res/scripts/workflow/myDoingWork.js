/**
 * 在途业务模块JS
 *
 * @author ibm
 */

//==初始化时列表对象
var workGrid;
$(document).ready(function(){
	workGrid = $('#myDoingWorkList').datagrid({
		url:getCtxPath()+'/rest/work/myDoingWork',
		method:'get',
		striped: true,
		singleSelect:true,
		pagination:true,
		rownumbers:true,
		columns:[[
			{field:"processName",title:"流程名称",width:160},
			{field:"bizInfo",title:"业务信息",width:360},
			{field:"taskName",title:"工作点名称 ",width:100},
			{field:"workState",title:"当前状态",width:100,
				formatter:function(value,rec){
					return value==0?"待签收":"待审批";
				}
			}]],
		toolbar:[{
			text:'流程跟踪',
			iconCls:'icon-trace',
			handler:traceWork
		},'-',{
			text:'刷新',
			iconCls:'icon-reload',
			handler:function(){$('#myDoingWorkList').wingrid('reload');}
		}]
	});
});

/*==============================================================================
 * 主应用
 ==============================================================================*/

//==流程跟踪
function traceWork(){
	var row = workGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要跟踪的流程记录。');
		return;
	}
	var url = getCtxPath()+'/rest/work/'+row.processId+'/trace/get/pre';
	top.menuCall("跟踪",url);
}
