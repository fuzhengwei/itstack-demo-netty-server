/**
 * 通知公告js
 *
 * @author ibm
 */

//==初始化窗口对象
var noticeGrid;
$(document).ready(function(){
	noticeGrid = $('#noticeList').wingrid({
		url:getCtxPath()+'/rest/notice',
		method:'get',
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'title',title:'通知公告标题',width:100},
			{field:'content',title:'内容',width:100},
			{field:'state',title:'发布状态',width:100,
				formatter:function(value){
					return (value=='1')?'已发布':'未发布';
				}
			},
			{field:'publisher',title:'发布人',width:100},
			{field:'publishDate',title:'发布时间',width:100,
				formatter:function(value){
					var date = new Date(value);
					return date.format('yyyy-MM-dd');
				}
			}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#noticeList').wingrid('new',{title:'添加通知公告'});}
		},{
			text:'修改',
			iconCls:'icon-edit',
			handler:editInfo
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#noticeList').wingrid('delete');}
		},'-',{
			text:'发布',
			iconCls:'icon-publish',
			handler:publish
		}],
		onDblClickRow:function(rowData){
			$('#noticeList').wingrid('show',{title:'查看通知公告',id:rowData.id});
		}
	});
});

//==修改
function editInfo(){
	var row = noticeGrid.wingrid('getSelected');
	if ((row) && (row.state=='1')){
		top.msgTipAlert('公告记录已发布，不能修改。');
		return;
	}
	$('#noticeList').wingrid('edit',{title:'修改通知公告'});
}
//==发布
function publish(){
	var row = noticeGrid.wingrid('getSelected');
	if (!row){
		top.msgTipAlert('请先选择要发布的公告记录。');
		return;
	} else {
		if (row.state=='1'){
			top.msgTipAlert('该公告记录已经发布。');
			return;
		}
	}
	var url=getCtxPath()+'/rest/notice/'+row.id+'/publish';
	$.putJSON(url,null,function(resData){
		if(resData.status == "success"){
			noticeGrid.wingrid('reload');
			top.msgTipSuccess(resData.message);
		} else {
			top.msgTipFail(resData.message);
		}
	});
}
