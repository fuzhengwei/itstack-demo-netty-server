/**
 * 短信群发信息js
 *
 * @author ibm
 */

//==初始化窗口对象
var mobileGrid;
$(document).ready(function(){
	mobileGrid = $('#mobileList').wingrid({
		url:getCtxPath()+'/rest/mobile',
		method:'get',
		easyWidth:'650px',
		easyHeight:'200px;',
		easyWindowMaximized:true,
		rownumbers:true,
		striped: true,
		singleSelect:true,
		pagination:true,
		columns:[[
			{field:'phone',title:'发送号码',width:100},
			{field:'count',title:'成功号码数目',width:100},
			{field:'errorPhone',title:'失败号码',width:100,formatter:function(value){
				if (!value) return '无';
				else return value;
			}},
			{field:'sendTime',title:'发送时间',width:100,formatter:function(value){
					var date = new Date(value);
					return date.format('yyyy-MM-dd');
			}},
			{field:'content',title:'发送内容',width:100},
			{field:'status',title:'发送状态',width:100,formatter:function(value){
				if (!value) return '';
				else return value=='1'?'成功':'失败';
			}}
		]],
		toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){$('#mobileList').wingrid('new',{title:'添加短信群发信息'});}
		},{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){$('#mobileList').wingrid('delete');}
		},{
			text:'统计',
			iconCls:'icon-edit',
			handler:function(){
				var url = getCtxPath()+"/rest/mobile/getStockDetails/public";
				$.fn.createWindowWithUrl('短信数据统计',url,{windowId:'getStockDetailsWindow'});
			}
		}],
		onDblClickRow:function(rowData){
			//==获取URL
			var url = getCtxPath()+"/rest/mobile";
			var row;
			row = $('#mobileList').datagrid('getSelected');
			if (row){
				url = url + '/' +row.id;
			} else {
				top.msgTipAlert('请先选择要查看的记录。');
				return;
			}
			$.fn.createWindowWithUrl('查看短信群发信息',url,{windowId:'getStockDetailsWindow',width:'600px',height:'400px'});
		}
	});
});