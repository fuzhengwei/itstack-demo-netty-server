/**
 * 文件分类js
 *
 * @author ibm
 */

//==初始化窗口对象
var fileTypeGrid;
$(document).ready(function(){
	fileTypeGrid = $('#fileTypeList').wingrid({
		url:getCtxPath()+'/rest/fileType',
		gridType:'treegrid',
		method:'get',
		rownumbers:true,
		striped: true,
		idField:'id',
		treeField:'name',
		nowrap: false,
		frozenColumns:[[
            {title:'分类名称',field:'name',width:180}
		]],
		columns:[[
			{field:'sortNo',title:'排序',width:100},
			{field:'description',title:'说明',width:300}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#fileTypeList').wingrid('new',{title:'添加文件分类'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#fileTypeList').wingrid('edit',{title:'修改文件分类'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#fileTypeList').wingrid('delete');}
		}],
		onDblClickRow:function(rowData){
			$('#fileTypeList').wingrid('show',{title:'查看文件分类',id:rowData.id});
		}
	});
});