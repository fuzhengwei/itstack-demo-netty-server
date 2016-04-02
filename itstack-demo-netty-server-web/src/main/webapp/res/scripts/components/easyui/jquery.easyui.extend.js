/**
 * jquery EasyUI的扩展方法
 *
 * @author ibm
 */

(function($) {
	$.fn.extend({
		createWindow:function(title,params){//创建EasyUI的窗口对象
			$this = $(this);
			//==渲染(顺序要处理好)
			$this.find('.easyui-combotree').combotree();
			$this.find('.easyui-linkbutton').linkbutton();
			$this.find('.easyui-validatebox').validatebox();
			$this.find('.easyui-numberbox').numberbox();
			$this.find('.easyui-layout').layout();
			
			//==处理自动高度
			$this.find('.easyui-layout').css('height','100%');
			$this.find('.layout-panel-center').removeClass('layout-panel layout-panel-center');
			$this.find('.layout-panel-south').removeClass('layout-panel');
			//==窗口创建
			if (!params) params={};
			var maximized = params.maximized?params.maximized:false;
			return $this.window({
				iconCls:'icon-window',
				maximized:maximized,
				title:'&nbsp'+title,
				top:'0px',
				modal:true,
				minimizable:false,
				onClose:function(){
					$('.validatebox-tip').remove();//删除掉Unique提示
					$(this).remove();
				}
			});
		},
		createWindowWithPage:function(title,pageData,params){//创建EasyUI的窗口对象
			if (!params) params={};
			//==加载窗口
			var maximized = params.maximized?params.maximized:false;
			var easyWidth = params.width?params.width:"500px";
			var easyHeight = params.height;
			
			var easyWin;
			if (this.length == 0) {//调用的窗体容器对象为空
				$('<div id="easyWindow" style="width:'+easyWidth+';height:'+easyHeight+';"></div>').appendTo('body');
				$('#easyWindow').append(pageData);
				easyWin = $('#easyWindow').createWindow(title,params);
			} else {
				$(this).append(pageData);
				easyWin = $(this).createWindow(title,params);
			}
			return easyWin;
		},
		createWindowWithUrl:function(title,url,params){//创建EasyUI的窗口对象,目前没有办法返回窗口对象
			//==打开窗口
			$this = $(this);
			$.get(url,null,function(resData){
				if (resData.status=='error'){
					top.msgTipFail(resData.message);
					return;
				}
				var win = $this.createWindowWithPage(title,resData,params);
			});
		},
		closeWindow:function(){//关闭EasyUI的窗口对象
			if (this.length == 0)
				$('#easyWindow').window('close');
			else $(this).window('close');
		},
		uniqueChecks:function(callback){//唯一录入判断
			function showTip(target){
				var box = $(target);
				var msg = box.attr('message');
				$.data(target, 'validatebox').message = msg;
				var tip = $.data(target, 'validatebox').tip;
				if (!tip){
					tip = $(
						'<div class="validatebox-tip">' +
							'<span class="validatebox-tip-content">' +
							'</span>' +
							'<span class="validatebox-tip-pointer">' +
							'</span>' +
						'</div>'
					).appendTo('body');
					$.data(target, 'validatebox').tip = tip;
				}
				tip.find('.validatebox-tip-content').html(msg);
				tip.css({
					display:'block',
					left:box.offset().left + box.outerWidth(),
					top:box.offset().top
				})
			}
			//==校验的回调方法
			function subCheck(checkNo,$this){
				//==check属性值提取
				var _this = $($this[checkNo]);
				var _url = _this.attr('uniqueCheckUrl');
				var _oldValue = _this.attr('uniqueCheckOldValue');
				var _newValue = _this.val();
				
				//==开始递归提交
				$.postJSON(_url,{'oldValue':_oldValue,'newValue':_newValue},
					function(resData){
						if ('success' == resData.status){//验证成功
							checkNo = checkNo+1;
							if (checkNo>=$this.length) callback(resData);
							else {
								subCheck(checkNo,$this);
							}
						} else {
							showTip($this[checkNo]);
							_this.addClass('validatebox-invalid');
						}
					});
			}
			//==执行校验，如果没有唯一校验则返回成功
			if ($(this).length == 0) callback({status:'success'});
			else subCheck(0,$(this));
		},
		uniqueCheck:function(url,oldValue,newValue,callback){//唯一录入判断
			function showTip(target){
				var box = $(target);
				var msg = box.attr('message');
				$.data(target, 'validatebox').message = msg;
				var tip = $.data(target, 'validatebox').tip;
				if (!tip){
					tip = $(
						'<div class="validatebox-tip">' +
							'<span class="validatebox-tip-content">' +
							'</span>' +
							'<span class="validatebox-tip-pointer">' +
							'</span>' +
						'</div>'
					).appendTo('body');
					$.data(target, 'validatebox').tip = tip;
				}
				tip.find('.validatebox-tip-content').html(msg);
				tip.css({
					display:'block',
					left:box.offset().left + box.outerWidth(),
					top:box.offset().top
				})
			}
			var data={'oldValue':oldValue,'newValue':newValue};
			var $this = $(this);
			
			$.postJSON(url,data,function(resData){
				if ('error' == resData.status){//验证失败
					showTip($this[0]);
					$this.addClass('validatebox-invalid');
				} else {
					callback(resData);
				}
			});
		}
	});
	
	//==扩展easyui validatebox
	$.extend($.fn.validatebox.defaults.rules, {
	    equalTo: {
	        validator: function(value, param){
				var compareBox = $('#' + param);
	            return value == compareBox.val();
	        },
	        message: '请再次输入相同的值'
	    },
	    cellPhone: {
	        validator: function(value, param){
	            return /^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/.test(value);
	        },
	        message: '请输入正确的手机号码格式'
	    }
	});

})(jQuery);
