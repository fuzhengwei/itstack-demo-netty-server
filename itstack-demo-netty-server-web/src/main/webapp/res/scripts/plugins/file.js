/**
 * 文件js
 *
 * @author ibm
 */

//==初始化窗口对象
var fileGrid;
$(document).ready(function(){
	fileGrid = $('#fileList').wingrid({
		url:getCtxPath()+'/rest/file',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'name',title:'文件名',width:100},
			{field:'uploadDate',title:'上传时间',width:100},
			{field:'status',title:'是否演示',width:100},
			{field:'url',title:'首页地址',width:100},
			{field:'remark',title:'文件说明',width:100},
			{field:'fileTypeId',title:'文件分类',width:100}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#fileList').wingrid('new',{title:'添加文件'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#fileList').wingrid('edit',{title:'修改文件'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#fileList').wingrid('delete');}
		}],
		onDblClickRow:function(rowData){
			$('#fileList').wingrid('show',{title:'查看文件',id:rowData.id});
		}
	});
});

//==是否显示
function clickStatus(obj){
	if($(obj).val() == '1'){//叶子节点
		$('input[name="url"]').removeAttr('disabled');
	}else{
		$('input[name="url"]').attr('disabled','true');
		$('input[name="url"]').removeClass('validatebox-invalid');
	}
}