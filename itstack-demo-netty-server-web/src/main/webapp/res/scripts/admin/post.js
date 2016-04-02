/**
 * 岗位模块JS
 *
 * @author ibm
 */

//==初始化时创建新增和修改的窗口对象
var postGrid;
$(document).ready(function(){
	//==创建DataGrid对象
	postGrid = $('#postList').wingrid({
		url:getCtxPath()+'/rest/post',
		method:'get',
		striped: true,
		singleSelect:true,
		rownumbers:true,
		pagination:true,
		columns:[[
			{field:"name",title:"岗位名称",width:100},
			{field:"code",title:"岗位编码",width:200},
			{field:"description",title:"岗位描述",width:200}]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#postList').wingrid('new',{title:'添加岗位'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){$('#postList').wingrid('edit',{title:'修改岗位'})}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#postList').wingrid('delete')}
		},'-',{
			text:'分配人员',
			iconCls:'icon-userAssign',
			handler:assignUser
		}],
		onDblClickRow:function(rowData){
			$('#postList').wingrid('show',{title:'查看岗位',id:rowData.id});
		}
	});
});

//==分配人员窗口
function assignUser(){
	var row = postGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要分配人员的岗位记录。');
		return;
	}
	//==创建并打开窗口
	var url = getCtxPath()+"/rest/post/"+row.id+"/user/assign/post/pre";
	$.fn.createWindowWithUrl('分配人员',url);
}

//==分配人员保存
function saveUserAssign(){
	var postId = postGrid.wingrid('getSelected').id;
	//==获取分配的User
	var desUsers=document.getElementById('desUser');
	var userIds="";
	for(var k=0;k<desUsers.length;k++){
		userIds+=desUsers.options[k].value+",";
	}
	//==提交
	$.postJSON(getCtxPath()+"/rest/post/"+postId+"/user/assign",{userIds:userIds},function(resData){
		if(resData.status == "success"){
			top.msgTipSuccess(resData.message);
			$.fn.closeWindow();
		} else {
			top.msgTipFail(resData.message);
		}
	});
}

//==人员列表选择事件处理
function userSelect(src,des,all){
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
