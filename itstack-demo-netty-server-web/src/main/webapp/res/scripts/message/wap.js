/**
 * 个人通讯录js
 *
 * @author ibm
 */

//==初始化窗口对象
var wapGrid;
$(document).ready(function(){
	wapGrid = $('#wapList').wingrid({
		url:getCtxPath()+'/rest/wap',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'name',title:'姓名',width:100},
			{field:'sex',title:'性别',width:100,sortable:true,formatter:function(value){
				if (!value) return '';
				else return value=='1'?'男':'女';
			}},
			{field:'birthday',title:'生日',width:100,
				formatter:function(value){
					var date = new Date(value);
					return date.format('yyyy-MM-dd');
				}
			},
			{field:'phone',title:'手机',width:100},
			{field:'company',title:'公司',width:100},
			{field:'duty',title:'职务',width:100},
			{field:'email',title:'邮箱',width:100},
			{field:'groupName',title:'所属分组',width:100}
		]],
		toolbar:[{
			text:'查询',
			iconCls:'icon-search',
			handler:searchInfo
		},'-',{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#wapList').wingrid('new',{title:'添加个人通讯录'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#wapList').wingrid('edit',{title:'修改个人通讯录'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#wapList').wingrid('delete');}
		}],
		onDblClickRow:function(rowData){
			$('#wapList').wingrid('show',{title:'查看个人通讯录',id:rowData.id});
		},
		onLoadSuccess:function(){
			if ($('#wap').length==0){
				var queryInput = '<div style="float:left;line-height:30px;"> \
						            <span>名称搜索：</span> \
						            <input type="text" id="wap" class="search_input" /> \
								 </div>';
					$('.datagrid-toolbar').prepend(queryInput);
			}
		}
	});
});

//==查询
function searchInfo(){
	var queryCond = parseCondJSON([new Condition('name',CondOperator.LIKE,$('#wap').val())])
	wapGrid.datagrid('reload',{queryParams:queryCond});
}