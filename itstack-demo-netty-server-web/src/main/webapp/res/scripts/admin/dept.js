/**
 * 部门信息js 
 *
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var deptGrid;
$(document).ready(function(){
	//==创建DataGrid对象
	deptGrid = $('#deptList').wingrid({
		url:getCtxPath()+'/rest/dept',
		gridType:'treegrid',
		method:'get',
		rownumbers:true,
		striped: true,
		idField:'id',
		treeField:'name',
		nowrap: false,
		frozenColumns:[[
            {title:'部门名称',field:'name',width:300}
		]],
		columns:[[
			{field:"manager",title:"负责人",width:100},
			{field:"phone",title:"联系电话",width:100}]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#deptList').wingrid('new',{title:'添加部门'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#deptList').wingrid('edit',{title:'修改部门'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#deptList').wingrid('delete');}
		},'-',{
			text:'刷新',
			iconCls:'icon-reload',
			handler:function(){$('#deptList').wingrid('reload');}
		}],
		onDblClickRow:function(rowData){
			$('#deptList').wingrid('show',{title:'查看部门',id:rowData.id});
		}
	});
});

