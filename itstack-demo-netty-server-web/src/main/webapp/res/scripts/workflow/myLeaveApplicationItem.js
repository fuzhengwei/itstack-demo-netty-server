/**
 * 请假申请信息js
 *
 * @author ibm
 */

//==初始化窗口对象
var leaveApplicationGrid;
$(document).ready(function(){
	leaveApplicationGrid = $('#leaveApplicationList').wingrid({
		url:getCtxPath()+'/rest/leaveApplication/myLeaveApplicationItem',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'reason',title:'原因',width:100},
			{field:'leaveDays',title:'请假天数',width:100},
			{field:'applicant',title:'申请人',width:100},
			{field:'applicantDate',title:'申请日期',width:100,formatter:function(value){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			}},
			{field:'approvalFlag',title:'审批状态',width:100,formatter:function(value){
				return value=='0'?'<span style="color:red;">待签收</span>':'<span style="color:gray;">待处理</span>';
			}},
			{field:'bizInfo',title:'业务信息',width:100}
		]],
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
			$('#leaveApplicationList').wingrid('show',{title:'查看请假申请信息',id:rowData.id});
		}
	});
});


//==签收待办
function claimWork(){
	var workitemId;
	var row = leaveApplicationGrid.wingrid('getSelected');
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
	var row = leaveApplicationGrid.wingrid('getSelected');
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
	var row = leaveApplicationGrid.wingrid('getSelected');
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
	leaveApplicationGrid.wingrid('reload');
}

