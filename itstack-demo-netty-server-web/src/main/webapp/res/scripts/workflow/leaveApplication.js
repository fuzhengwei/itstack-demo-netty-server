/**
 * 请假申请信息js
 *
 * @author ibm
 */

//==初始化窗口对象
var leaveApplicationGrid;
$(document).ready(function(){
	leaveApplicationGrid = $('#leaveApplicationList').wingrid({
		url:getCtxPath()+'/rest/leaveApplication',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'reason',title:'原因',width:100},
			{field:'beginDate',title:'开始日期',width:100,formatter:function(value){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			}},
			{field:'endDate',title:'结束日期',width:100,formatter:function(value){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			}},
			{field:'leaveDays',title:'请假天数',width:100},
			{field:'applicantName',title:'申请人',width:100},
			{field:'applicantDate',title:'申请日期',width:100,formatter:function(value){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			}},
			{field:'approvalFlag',title:'审批状态',width:100,formatter:function(value){
				return value=='0'?'<span style="color:red;">待签收</span>':'<span style="color:gray;">待处理</span>';
			}},
			{field:'approver',title:'审批人',width:100},
			{field:'approvalDetail',title:'详细意见',width:100},
			{field:'approvalTime',title:'审核时间',width:100,formatter:function(value){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			},
			},
			{field:"opt",title:"操作",align:'center',width:100,
				formatter:function(value,rec){
				if (rec.approvalFlag=='0'){
					return '<a href="javascript:void(0)" onclick="accept(\''+rec.id+'\')">【受理】</a>';
				}else{
					return '<span style="color:gray;">【已受理】</span>';
				}
			}}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#leaveApplicationList').wingrid('new',{title:'添加请假申请信息'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#leaveApplicationList').wingrid('edit',{title:'修改请假申请信息'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#leaveApplicationList').wingrid('delete');}
		}],
		onDblClickRow:function(rowData){
			$('#leaveApplicationList').wingrid('show',{title:'查看请假申请信息',id:rowData.id});
		}
	});
});

function accept(id){
	$.messager.confirm('提示', '确定要受理该请假单吗？', function(r){
		if (r){
			$.postJSON(getCtxPath()+'/rest/leaveApplication/'+id+'/acceptApply',function(resData){
				if(resData.status == "success"){
					top.msgTipSuccess(resData.message);
					$('#leaveApplicationList').wingrid('refresh');
				} else {
					top.msgTipFail(resData.message);
				}
			});
		}
	});
}