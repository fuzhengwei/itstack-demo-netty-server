/**
 * 模块信息JS
 *
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var moduleGrid;
$(document).ready(function(){
	//==创建TreeGrid对象
	moduleGrid = $('#moduleList').wingrid({
		url:getCtxPath()+'/rest/module',
		gridType:'treegrid',
		method:'get',
		rownumbers:true,
		striped: true,
		idField:'id',
		treeField:'name',
		nowrap: false,
		frozenColumns:[[
            {title:'模块名称',field:'name',width:200}
		]],	
		columns:[[
			{field:"sortNo",title:"排序号",width:100},
			{field:"defaultURL",title:"模块路径",width:200},
			{field:"widgetId",title:"widgetId",width:100},
			{field:"isValid",title:"是否可用",width:100,align:'center',formatter:function(value,rec){
				return value='1'?'是':'否';}
			}]],
		toolbar:[{
				text:'添加',
				iconCls:'icon-add',
				handler:function(){$('#moduleList').wingrid('new',{title:'添加模块'});}
			},{
				text:'修改',
				iconCls:'icon-edit',
				handler:function(){$('#moduleList').wingrid('edit',{title:'修改模块'});}
			},{
				text:'删除',
				iconCls:'icon-remove',
				handler:function(){$('#moduleList').wingrid('delete');}
			},'-',{
				text:'资源列表管理',
				iconCls:'icon-resource',
				handler:resourceAdmin
			},'-',{
				text:'刷新',
				iconCls:'icon-reload',
				handler:function(){$('#moduleList').wingrid('reload');}
		}],
		onDblClickRow:function(rowData){
			$('#moduleList').wingrid('show',{title:'查看模块',id:rowData.id});
		}
	});	
});

//==资源列表管理
function resourceAdmin(){
	var row = moduleGrid.wingrid('getSelected');
	if (row){
		if ('1' == row.isLeaf) 
			top.menuCall("资源列表管理["+row.name+"模块]",getCtxPath()+"/rest/module/"+row.id+"/resource/get/pre");
		else top.msgTipAlert('非叶子节点，没有对应的资源列表。');
	} else {
		top.msgTipAlert('请先选择要管理资源列表的记录。');
	}
}

//==叶子节点点击
function clickLeaf(el){
	if($(el).val() == '1'){//叶子节点
		$('input[name="defaultURL"]').removeAttr('disabled');
	}else{
		$('input[name="defaultURL"]').attr('disabled','true');
		$('input[name="defaultURL"]').removeClass('validatebox-invalid');
	}
}

//==Widget点击
function clickWidget(el){
	if($(el).val() == '1'){//Widget
		$('input[name="widgetId"]').removeAttr('disabled');
	}else{
		$('input[name="widgetId"]').attr('disabled','true');
		$('input[name="widgetId"]').removeClass('validatebox-invalid');
	}
}
