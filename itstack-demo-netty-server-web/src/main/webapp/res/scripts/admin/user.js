/**
 * 用户信息JS
 *
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var userGrid;
$(document).ready(function(){
	//==创建DataGrid对象
	userGrid = $('#userList').wingrid({
		url:getCtxPath()+'/rest/user',
		method:'get',
		easyWidth:'600px',
		striped: true,
		rownumbers:true,
		pagination:true,
		singleSelect:true,
		columns:[[
			{field:"userName",title:"账号",width:100,sortable:true},
			{field:"realName",title:"姓名",width:100,sortable:true},
			{field:"sex",title:"性别",width:50,sortable:true,formatter:function(value){
				if (!value) return '';
				else return value=='1'?'男':'女';
			}},
			{field:"depName",title:"所属部门",width:200},
			{field:"post",title:"职务",width:100,sortable:true},
			{field:"mobile",title:"手机号码",width:100,sortable:true},
			{field:"phone",title:"联系电话",width:100,sortable:true},
			{field:"email",title:"电子邮箱",width:150,sortable:true}]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#userList').wingrid('new',{title:'添加用户'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#userList').wingrid('edit',{title:'修改用户'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#userList').wingrid('delete');}
		},'-',{
			text:'分配角色',
			iconCls:'icon-roleAssign',
			handler:assignRole
		},{
			text:'分配资源',
			iconCls:'icon-resourceAssign',
			handler:assignResource
		}],
		onDblClickRow:function(rowData){
			$('#userList').wingrid('show',{title:'查看用户',id:rowData.id});
		}
	});
});
/*==============================================================================
 * 分配角色应用
 ==============================================================================*/

//==分配角色窗口
function assignRole(){
	var row = userGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要分配角色的用户记录。');
		return;
	}
	
	//==创建并打开窗口
	var url = getCtxPath()+"/rest/user/"+row.id+"/role/assign/post/pre"
	$.fn.createWindowWithUrl('分配角色',url);
}

//==分配角色保存
function saveRoleAssign(){
	var userId = userGrid.wingrid('getSelected').id;
	//==获取分配的role
	var desRoles=document.getElementById('desRole');
	var roleIds="";
	for(var k=0;k<desRoles.length;k++){
		roleIds+=desRoles.options[k].value+",";
	}
	//==提交
	$.postJSON(getCtxPath()+"/rest/user/"+userId+"/role/assign",{roleIds:roleIds},function(resData){
		if(resData.status == "success"){
			top.msgTipSuccess(resData.message);
			$.fn.closeWindow();
		} else {
			top.msgTipFail(resData.message);
		}
	});
}

//==角色列表选择事件处理
function roleSelect(src,des,all){
	 var src=document.getElementById(src);
	 var des=document.getElementById(des);

	 //==单项或多项选择处理
	 if (!all){
		while (src.selectedIndex>-1){
			var text=src.options[src.selectedIndex].text;
			var value=src.options[src.selectedIndex].value;
			src.remove(src.selectedIndex);
			var newOption=document.createElement("OPTION");
			newOption.text=text;
			newOption.value=value;
			des.options.add(newOption);
		}
	 }
	 //==全部选择处理
	 else{
		for (var i=0;i<src.length;i++){
			var text=src.options[i].text;
			var value=src.options[i].value;
			var newOption=document.createElement("OPTION");
			newOption.text=text;
			newOption.value=value;
			des.options.add(newOption);
		 }
		src.options.length=0;
	 }
}

/*==============================================================================
 * 分配资源应用
 ==============================================================================*/

//==分配资源
function assignResource(){
	var row = userGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要分配资源的用户记录。');
		return;
	}
	
	//==获取资源树
	$.get(getCtxPath()+"/rest/user/"+row.id+"/resource/assign/post/pre",null,function(resData){
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
	var userId = userGrid.wingrid('getSelected').id;
	var url = getCtxPath()+'/rest/user/'+userId+'/resource/assign';	
	$.postJSON(url,{userId:userId,resourceIds:resourceIds},function(resData){
		if(resData.status == "success"){
			top.msgTipSuccess(resData.message);
			$.fn.closeWindow();
		} else {
			top.msgTipFail(resData.message);
		}
	});
}
