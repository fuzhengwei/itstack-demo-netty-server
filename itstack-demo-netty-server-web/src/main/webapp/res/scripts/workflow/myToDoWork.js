/**
 * 待办业务模块JS
 *
 * @author ibm
 */

//==初始化时列表对象
var workGrid;
var formWork;

//==创建DataGrid对象
$(document).ready(function(){
	workGrid = $('#myToDoWorkList').datagrid({
		url:getCtxPath()+'/rest/work/myToDoWork',
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
			text:'签收',
			iconCls:'icon-ok',
			handler:claimWork
		},{
			text:'审批',
			iconCls:'icon-audit',
			handler:approve
		},'-',{
			text:'刷新',
			iconCls:'icon-reload',
			handler:reloadWork
		}],
		onDblClickRow:function(rowData){
			bizDetail(rowData.sn,rowData.url);
		}
	});
});

//==签收待办
function claimWork(){
	var workitemId;
	var row = workGrid.wingrid('getSelected');
	if (row){
		if (row.workState != '0'){
			top.msgTipAlert('该记录已经签收。');
			return;
		}
		workitemId = row.workitemId;
	} else {
		top.msgTipAlert('请先选择要签收的记录。');
		return;
	}
	//==执行签收
	$.postJSON(getCtxPath()+'/rest/work/myToDoWork/'+workitemId+'/claim', null,function(resData){
		if(resData.status == "success"){
			top.msgTipSuccess(resData.message);
			reloadWork();
		} else {
			top.msgTipFail(resData.message);
		}
	});
}

//==业务明细页面
function bizDetail(){
	var workitemId,sn,url;
	var row = workGrid.wingrid('getSelected');
	if (row){
		sn = row.sn;
		url = row.viewForm;
	} else {
		top.msgTipAlert('请先选择要查看明细的记录。');
		return;
	}
	var url = getCtxPath()+url.replace('{id}',sn);
	openForm(url,'业务明细',url,'get');
}

//==审批页面
function approve(){
	var workitemId,applicationId,url;
	var row = workGrid.wingrid('getSelected');
	if (row){
		if (row.workState == '0'){
			top.msgTipAlert('该记录尚未签收。');
			return;
		}
		workitemId = row.workitemId;
		applicationId = row.applicationId;
		url = row.editForm;
	} else {
		top.msgTipAlert('请先选择要审批的记录。');
		return;
	}
	var url = getCtxPath()+url.replace('{workitemId}',workitemId);
	openForm(url+'/post/pre'+'?applicationId='+applicationId,'事项审批',url,'post');
}

//==保存审批并提交
function saveApproval(){
	formWork.form('submit',{
		onSubmit:function(){
			if (formWork.form('validate')){
				$.postJSON(formWork.url, formWork.serialize(),function(resData){
					if(resData.status == "success"){
						top.msgTipSuccess(resData.message);
						reloadWork();
						$.fn.closeWindow();
					} else {
						top.msgTipFail(resData.message);
					}
				});
			}
			return false;
		}
	});
}

//==窗体创建并打开
function openForm(winURL,title,btnURL,btnMethod){
	$.get(winURL,null,function(resData){
		var winWork = $.fn.createWindowWithPage(title,resData,{"width":"750px"});
		formWork = winWork.find('form');
		formWork.url = btnURL;
		formWork.method = btnMethod;
	});
}

//==刷新表格
function reloadWork(){
	workGrid.wingrid('reload');
}

