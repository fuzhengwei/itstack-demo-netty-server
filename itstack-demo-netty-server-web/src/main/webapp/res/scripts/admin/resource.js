/**
 * 资源信息js
 * 
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var resourceGrid;
$(document).ready(function(){
	var moduleId = $('#moduleId').val();
	//==创建DataGrid对象
	resourceGrid = $('#resourceList').wingrid({
		url:getCtxPath()+'/rest/module/'+moduleId+'/resource',
		easyUrl:getCtxPath()+'/rest/resource',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,		
		columns:[[
			{field:"name",title:"资源名称",width:100},
			{field:"url",title:"资源路径",width:200},
			{field:"method",title:"资源方法",width:100},
			{field:"sortNo",title:"排序号",width:100}]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#resourceList').wingrid('new',{title:'添加资源',openCallback:function(){$('input:hidden[name="modId"]').val(moduleId);}});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#resourceList').wingrid('edit',{title:'修改资源',openCallback:function(){$('input:hidden[name="modId"]').val(moduleId);}});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#resourceList').wingrid('delete');}
		},'-',{
			text:'刷新',
			iconCls:'icon-reload',
			handler:function(){$('#resourceList').wingrid('reload');}
		}],
		onDblClickRow:function(rowData){
			$('#resourceList').wingrid('show',{title:'查看资源',id:rowData.id});
		}
	});
});
