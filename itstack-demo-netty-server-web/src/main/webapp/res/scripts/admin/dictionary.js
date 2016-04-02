/**
 * 字典模块JS
 *
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var dictionaryGrid;
$(document).ready(function(){
	//==创建DataGrid对象
	dictionaryGrid = $('#dictionaryList').wingrid({
		url:getCtxPath()+'/rest/dictionary',
		method:'get',
		striped: true,
		singleSelect:true,
		rownumbers:true,
		pagination:true,
		queryParams:{queryParams:parseCondJSON([new Condition('type',CondOperator.EQUAL,'1')])},
		columns:[[
			{field:"name",title:"代码名称",width:100},
			{field:"value",title:"代码值",width:200},
			{field:"sortNo",title:"排序",width:100}]],
		toolbar:[{
			text:'查询',
			iconCls:'icon-search',
			handler:searchInfo
		},'-',{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#dictionaryList').wingrid('new',{title:'添加代码',para:$('#dictionaryType').val()});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#dictionaryList').wingrid('edit',{title:'修改代码'})}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#dictionaryList').wingrid('delete')}
		}],
		onLoadSuccess:function(){
			if ($('#dictionaryType').length==0){
				var queryInput = '<div style="float:left;line-height:30px;"> \
				                    <span>代码类别</span> \
								 	<select id="dictionaryType" class="inputSelect"> \
								 		<option value="1">工程分类</option> \
										<option value="2">工程正常用途</option> \
								 		<option value="3">工程战时用途</option> \
								 		<option value="4">工程建筑形式</option> \
								 		<option value="5">工程使用方式</option> \
								 		<option value="6">工程建筑方式</option> \
								 		<option value="7">工程使用形式</option> \
								 		<option value="8">文档分类</option> \
									</select> \
								 </div>';
				$('.datagrid-toolbar').prepend(queryInput);
			}
		}
	});
});

//==查询
function searchInfo(){
	var queryCond = parseCondJSON([new Condition('type',CondOperator.EQUAL,$('#dictionaryType').val())])
	dictionaryGrid.wingrid('reload',{queryParams:queryCond});
}

