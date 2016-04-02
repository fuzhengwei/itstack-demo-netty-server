/**
 * 角色模块JS
 *
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var roleGrid;
$(document).ready(function(){
	//==创建DataGrid对象
	roleGrid = $('#roleList').wingrid({
		url:getCtxPath()+'/rest/role',
		method:'get',
		striped: true,
		singleSelect:true,
		rownumbers:true,
		pagination:true,
		columns:[[
			{field:"name",title:"角色名称",width:100},
			{field:"description",title:"角色描述",width:200}]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#roleList').wingrid('new',{title:'添加角色'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#roleList').wingrid('edit',{title:'修改角色'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#roleList').wingrid('delete');}
		},'-',{
			text:'分配资源',
			iconCls:'icon-resourceAssign',
			handler:assignResource
		}],
		onDblClickRow:function(rowData){
			$('#roleList').wingrid('show',{title:'查看角色',id:rowData.id});
		}
	});
});

//==分配资源
function assignResource(){
	var row = roleGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要分配资源的角色。');
		return;
	}
	
	//==获取资源树
	$.get(getCtxPath()+"/rest/role/"+row.id+"/resource/assign/post/pre",null,function(resData){
		//==创建并打开窗口
		$.fn.createWindowWithPage('分配资源',resData,{width:'600px',height:'400px'});

		//==加载树
		$('#resTree').tree({
			checkbox: true,
			data:eval($('#resTreeData').val()),
			onLoadSuccess:function(){
				$('#resTree span.tree-icon').remove();//去掉图标
				var nodes = $('#resTree').find("div.tree-node");//排列方式
				nodes.each(function(){
					node = $(this);
					if (node.children("span.tree-hit").length==0){
						node.parent().css('float','left').css('margin-top','5px');
						node.parent().parent().parent().css('margin-top','5px');
					} else {
						node.parent().append('<div class="clear" />');
					}
				});
			}
		});	
	});
}

//=保存分配结果
function saveResAssign(){
	//==生成选择的资源ID列表字符串
	var resourceIds="";
	var nodes = $('#resTree').tree('getChecked');
	for(var i=0; i<nodes.length; i++){
		node = nodes[i];
		if ($('#resTree').tree('isLeaf', node.target)) {
			if (resourceIds != '') resourceIds += ',';
			resourceIds += node.id;
		}
	}

	//==提交请求
	var roleId = roleGrid.wingrid('getSelected').id;
	var url = getCtxPath()+'/rest/role/'+roleId+'/resource/assign';	
	$.postJSON(url,{roleId:roleId,resourceIds:resourceIds},function(resData){
		if(resData.status == "success"){
			top.msgTipSuccess(resData.message);
			$.fn.closeWindow();
		} else {
			top.msgTipFail(resData.message);
		}
	});
}
