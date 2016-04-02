/**
 * 请假信息js
 *
 * @author ibm
 */

//==初始化窗口对象
var leaveGrid;
$(document).ready(function(){
	leaveGrid = $('#leaveList').wingrid({
		url:getCtxPath()+'/rest/leave',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'name',title:'申请人',width:100},
			{field:'startDate',title:'开始日期',width:100,formatter:function(value){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			}},
			{field:'endDate',title:'结束日期',width:100,formatter:function(value,rec){
				var date = new Date(value);
				return date.format('yyyy-MM-dd');
			}},
			{field:'leaveDays',title:'请假天数',width:100},
			{field:'reason',title:'原因',width:100},
			{field:'applyDate',title:'申请日期',width:100},
			{field:'flowStatus',title:'流程状态',width:100,
				formatter:function(value,rec){
				if (rec.flowStatus=='0'){
					return '<span style="color:red;">流程未启动</span>';
				}else if(rec.flowStatus=='1'){
					return '<span style="color:gray;">已完成</span>';
				}else{
					return value;
				}
			}},
			{field:'flag',title:'审核标识',width:100},
			{field:"opt",title:"操作",align:'center',width:100,formatter:function(value,rowDate){
				if (rowDate.flowStatus=='0'){
					return '<a href="javascript:void(0)" onclick="accept(\''+rowDate.id+'\')">【申请受理】</a>';
				}else{
					return '<span style="color:gray;">【已受理】</span>';
				}
			}}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#leaveList').wingrid('new',{title:'添加请假信息'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#leaveList').wingrid('edit',{title:'修改请假信息'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#leaveList').wingrid('delete');}
		}],
		onDblClickRow:function(rowData){
			$('#leaveList').wingrid('show',{title:'查看请假信息',id:rowData.id});
		}
	});
});

function accept(id){
	$.messager.confirm('提示', '确定要申请受理吗？', function(r){
		if (r){
			$.postJSON(getCtxPath()+'/rest/leave/'+id+'/acceptApply',function(resData){
				if(resData.status == "success"){
					top.msgTipSuccess(resData.message);
					$('#leaveList').wingrid('reload');
				} else {
					top.msgTipFail(resData.message);
				}
			});
		}
	});
}