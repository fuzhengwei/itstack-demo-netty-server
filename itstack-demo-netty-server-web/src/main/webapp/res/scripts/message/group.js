/**
 * 联系人分组js
 *
 * @author ibm
 */

//==初始化窗口对象
var groupGrid;
$(document).ready(function(){
	groupGrid = $('#groupList').wingrid({
		url:getCtxPath()+'/rest/group',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'name',title:'分组名称',width:100}
		]],
		toolbar:[{
			text:'查询',
			iconCls:'icon-search',
			handler:searchInfo
		},'-',{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#groupList').wingrid('new',{title:'添加联系人分组'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#groupList').wingrid('edit',{title:'修改联系人分组'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#groupList').wingrid('delete');}
		}],
		onLoadSuccess:function(){
		if ($('#group').length==0){
			var queryInput = '<div style="float:left;line-height:30px;"> \
					            <span>名称搜索：</span> \
					            <input type="text" id="group" class="search_input" /> \
							 </div>';
				$('.datagrid-toolbar').prepend(queryInput);
		}
	}
	});
});

//==查询
function searchInfo(){
	var queryCond = parseCondJSON([new Condition('name',CondOperator.LIKE,$('#group').val())])
	groupGrid.datagrid('reload',{queryParams:queryCond});
}