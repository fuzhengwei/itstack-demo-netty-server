/**
 * 系统参数js
 *
 * @author ibm
 */

//==初始化窗口对象
var paraGrid;
$(document).ready(function(){
	paraGrid = $('#paraList').wingrid({
		url:getCtxPath()+'/rest/para',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'paraCode',title:'参数编码',width:150,sortable:true},
			{field:'paraName',title:'参数名称',width:200,sortable:true},
			{field:'paraValue',title:'参数值',width:200,sortable:true}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#paraList').wingrid('new',{title:'添加系统参数'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#paraList').wingrid('edit',{title:'修改系统参数'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#paraList').wingrid('delete');}
		}],
		onDblClickRow:function(rowData){
			$('#paraList').wingrid('show',{title:'查看系统参数',id:rowData.id});
		}
	});
});