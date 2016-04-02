/**
 * 通知公告Widgetjs
 *
 * @author ibm
 */

//==初始化窗口对象
var initNoticeGrid = function(){
	$('#noticeList').wingrid({
		url:getCtxPath()+'/rest/notice?isWidget=true',
		easyUrl:getCtxPath()+'/rest/notice',
		method:'get',
		striped: true,
		singleSelect:true,
		columns:[[
			{field:'title',title:'通知公告标题',width:100},
			{field:'content',title:'内容',width:100},
			{field:'publisher',title:'发布人',width:100},
			{field:'publishDate',title:'发布时间',width:100,
				formatter:function(value){
					var date = new Date(value);
					return date.format('yyyy-MM-dd');
				}
			}
		]],
		toolbar:[{
			text:'刷新',
			iconCls:'icon-reload',
			handler:function(){$('#noticeList').wingrid('reload');}
		}],
		onDblClickRow:function(rowData){
			$('#noticeList').wingrid('show',{title:'查看通知公告',id:rowData.id});
		}
	});
};
