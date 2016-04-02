/**
 * jquery EasyUI的扩展datagrid或者treegrid，集成了窗口的增删改查等基础应用
 *
 * @author ibm
 */

(function($){
	
	//==show
	function easyShow(target,param){
		//==获取URL
		var url;
		if (!param.id){
			var row;
			//==treegrid or datagrid
			if ("treegrid" == $.fn.wingrid.config.gridType)
				row = $(target).treegrid('getSelected');
			else row = $(target).datagrid('getSelected');
			if (row){
				url = getEasyUrl()+'/'+row.id;
			} else {
				top.msgTipAlert('请先选择要查看的记录。');
				return;
			}
		} else {
			url = getEasyUrl()+'/'+param.id;
		}
		openForm(url,param,'show');
	}
	
	//==new
	function easyNew(target,param){
		var url = getEasyUrl(param);
		$.fn.wingrid.config.saveUrl=url;
		$.fn.wingrid.config.saveMethod='post';
		url = getUrlWithParam(url+'/post/pre',param);	
		openForm(url,param,'new');
	}
	
	//==edit
	function easyEdit(target,param){
		//==获取URL
		var url;
		if (!param.id){
			var row;
			//==treegrid or datagrid
			if ("treegrid" == $.fn.wingrid.config.gridType)
				row = $(target).treegrid('getSelected');
			else row = $(target).datagrid('getSelected');
			if (row){
				url = getEasyUrl()+'/'+row.id;
			} else {
				top.msgTipAlert('请先选择要修改的记录。');
				return;
			}
		} else {
			url = getEasyUrl()+'/'+param.id;
		}
		
		//==执行修改
		$.fn.wingrid.config.saveUrl=url;
		$.fn.wingrid.config.saveMethod='put';
		url = getUrlWithParam(url+'/put/pre',param);
		openForm(url,param,'edit');
	}
	
	//==保存
	function easySave(target,param){
		var easyForm = getForm();
		var saveUrl = $.fn.wingrid.config.saveUrl;
		var saveMethod = $.fn.wingrid.config.saveMethod;
		easyForm.form('submit',{
			onSubmit:function(){
				if (easyForm.form('validate')){
					$('input[uniqueCheckUrl]').uniqueChecks(function(resData){
						if ('success' == resData.status){
							if(saveMethod == 'put'){
								$.putJSON(saveUrl, easyForm.serialize(),easyCallbackClose);
							} else {
								$.postJSON(saveUrl, easyForm.serialize(),easyCallbackClose);
							}
						}
					});
				}
				return false;
			}
		});
	}
	
	//==delete
	function easyDelete(target,param){
		//==获取URL
		var url;
		if (!param){
			var row;
			//==treegrid or datagrid
			if ("treegrid" == $.fn.wingrid.config.gridType)
				row = $(target).treegrid('getSelected');
			else row = $(target).datagrid('getSelected');
			if (row){
				url = getEasyUrl()+'/'+row.id;
			} else {
				top.msgTipAlert('请先选择要删除的记录。');
				return;
			}
		} else {
			url = getEasyUrl()+'/'+param.id;
			
		}
		//==执行删除
		$.messager.confirm('提示', '确定要删除该条记录吗？', function(r){
			if (r){
				$.deleteJSON(url,easyCallback);
			}
		});
	}
	
	//==刷新表格
	function easyReload(target,param){
		//==treegrid or datagrid
		if ("treegrid" == $.fn.wingrid.config.gridType)
			$(target?target:$.fn.wingrid.config.self).treegrid('reload');
		else $(target?target:$.fn.wingrid.config.self).datagrid('reload');
	}
	
	$.fn.wingrid = function(options, param){
		if (typeof options == 'string'){
			switch(options){
				case 'show':
					return easyShow(this,param);
				case 'new':
					return easyNew(this,param);
				case 'edit':
					return easyEdit(this,param);
				case 'save':
					return easySave(this,param);
				case 'delete':
					return easyDelete(this,param);
				case 'close':
					return easyClose();
				case 'reload':
					return easyReload(this,param);
				case 'getSelected':
					if ("treegrid" == $.fn.wingrid.config.gridType) return $(this).treegrid('getSelected');
					else return $(this).datagrid('getSelected');
			}
		}
		
		$.fn.wingrid.config.easyWindow=options.easyWindow?options.easyWindow:'easyWindow';
		$.fn.wingrid.config.easyUrl=options.easyUrl?options.easyUrl:options.url;
		$.fn.wingrid.config.easyWidth=options.easyWidth;
		$.fn.wingrid.config.easyHeight=options.easyHeight;
		$.fn.wingrid.config.gridType=options.gridType;
		$.fn.wingrid.config.maximized=options.easyWindowMaximized?options.easyWindowMaximized:false;
		$.fn.wingrid.config.self=this;
		$.fn.wingrid.onSaveSuccess=options.onSaveSuccess;

		//==treegrid or datagrid
		if ("treegrid" == $.fn.wingrid.config.gridType)
			return this.treegrid(options,param);
		else return this.datagrid(options,param);
	}
	
	//==创建并打开窗体
	function openForm(winURL,param,operType){
		$.get(winURL,null,function(resData){
			if (resData.status=='error'){
				top.msgTipFail(resData.message);
				return;
			}
			//==窗口宽高
			var easyWidth = $.fn.wingrid.config.easyWidth;
			var easyHeight = $.fn.wingrid.config.easyHeight;
			//==创建窗体并打开
			var winEasy = $('#easyWindow').createWindowWithPage(param.title,resData,{width:easyWidth,height:easyHeight,maximized:$.fn.wingrid.config.maximized});
			//==回调方法
			if (param.openCallback) param.openCallback(operType);
			//==查看窗体Disable
			if (operType=="show") {
				winEasy.find('input').attr('disabled',true);
				winEasy.find('select').attr('disabled',true);
				winEasy.find('textarea').attr('disabled',true);
				winEasy.find('.easyui-combotree').combotree('disable');
			}
		});
	}

	//==返回窗体的URL
	function getEasyUrl(param){
		return $.fn.wingrid.config.easyUrl;
	}
	//==返回带参数的URL
	function getUrlWithParam(url,param){
		if (param && param.para){
			if (url.indexOf('?')==-1) url = url+'?easyParam='+param.para;
			else url=url+'&easyParam='+param.para;
		}
		return url;
	}
	//==返回表单对象
	function getForm(){
		return $('#'+$.fn.wingrid.config.easyWindow).find('form');
	}
	//==关闭窗口
	function easyClose(){
		$('#'+$.fn.wingrid.config.easyWindow).window('close');
	}
	//==关闭窗口的回调函数
	function easyCallbackClose(resData){
		if(resData.status == "success"){
			if (resData.message) top.msgTipSuccess(resData.message);
			easyReload();
			easyClose();
			if ($.fn.wingrid.onSaveSuccess){
				$.fn.wingrid.onSaveSuccess.call($.fn.wingrid.config.self,resData);
			}
		} else if(resData.status == "warning") 
			top.msgTipAlert(resData.message);
		else top.msgTipFail(resData.message);
	}
	
	//==不关闭窗口的回调函数
	function easyCallback(resData){
		if(resData.status == "success"){
			top.msgTipSuccess(resData.message);
			easyReload();
			if ($.fn.wingrid.onSaveSuccess){
				$.fn.wingrid.onSaveSuccess.call(resData);
			}
		} else if(resData.status == "warning") 
			top.msgTipAlert(resData.message);
		else top.msgTipFail(resData.message);
	}
	$.fn.wingrid.config = {}
})(jQuery);

