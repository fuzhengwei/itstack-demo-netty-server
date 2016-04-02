/**
 * widget容器实现 v1.0
 * @author gege
 **/
(function($) {

	var widgetPlaces = [];
	var widgets = [];
	var columnTemplate = '<div class="widget-place widget-column{i}" id="widgetPlace{i}"></div>';
	var proxy = $('<div style="height:40px;border:1px dashed;margin-bottom:5px;"/>');
	var widgetTemplate = '<div class="widget {movable}" title="{title}" collapsible="{collapsible}" closable="{closable}" widgetId="{widgetId}"></div>';
	/**
   * 全局调用入口

   * @access public
   * settings 配置项
   * @return 
   *
   */
	$.fn.EasyWidgets = function(settings){
    InitializeWidgets(settings, false);
    BindEvents();
    return true;
  };
  
  $.fn.EasyWidgets.AddWidget = function() {
  }
 
 	function BindEvents() {
 		$(document).bind("addingstart.easywidget", onAddingWidgetStart);
 		$(document).bind("adding.easywidget", onAddingWidget);
 		$(document).bind("addingend.easywidget", onAddingWidgetEnd);
 	}
  /**
   * 改变widget的布局 为了不做重新初始化动作，将各个widget逐个迁移到新的column中再将旧的column删除
   *
   * @access public
   * @param columnNum 要改变的column数目
   * @return 
   *
   */
  $.fn.EasyWidgets.ChangeLayout = function (columnNum) {
  	columnNum = parseInt(columnNum, 10);
  	//if(columnNum == widgetPlaces.length) return;

  	//ol means the original place number
  	var ol = widgetPlaces.length;
  	
  	var ww = getWidgetWidth(columnNum);
  	for(var i=1; i <= columnNum; i++) {
  		var p = $(columnTemplate.replace(/{i}/g, i));
  		widgetPlaces[widgetPlaces.length] = p;
  		p.width(ww);
  		p.insertAfter(widgetPlaces[widgetPlaces.length - 2]);
  		
  	}
  	
  	for(var j=0; j < widgets.length; j++) {
  		widgets[j].find('.panel-body').panel('resize',{width:ww - 4});
  		
  		widgetPlaces[j%columnNum + ol].append(widgets[j]);
  	}
  	
  	for(var m=0; m < ol; m++) {
  		widgetPlaces[m].remove();
  		
  	}
  	widgetPlaces.splice(0,ol);
  }
  
  /**
   * 获取当前widget的宽度
   *
   * @access public
   * @param columnNum 当前column的数目
   * @return widget的宽度
   *
   */
  function getWidgetWidth(columnNum) {
  	var s = $.fn.EasyWidgets.defaults;
  	var c = $(s.selectors.container);
 		var w = c.width();
 		
  	return (w - (columnNum + 1) * 5)/columnNum;
  }
  
	/**
   *
   **/
	$.fn.EasyWidgets.defaults = {
    selectors : {
      container : '.widget-container',
      widget : '.widget',
      places : '.widget-place'
    }
  };
  
  /**
   * 判断鼠标是否移到了该widget的上半部分上
   *
   * @access private
   * @param e 鼠标在drag移动过程中的事件
   * @param widget 需要判断是否有over事件的widget
   * @return Boolean True if mouse on the top half area of the widget
   *
   */
  function isOverTopHalf(e, widget) {
  	var x = e.pageX, y = e.pageY;
  	var offset = widget.offset();
  	
  	return x -offset.left > 0 && x - offset.left < widget.width() && y - offset.top > 0 && y - offset.top <= widget.height()/2;
  }
  
  /**
   * 判断鼠标是否移到了该widget的下半部分上
   *
   * @access private
   * @param e 鼠标在drag移动过程中的事件
   * @param widget 需要判断是否有over事件的widget
   * @return Boolean True if mouse on the top half area of the widget
   *
   */
  function isOverBottomHalf(e, widget) {
  	var x = e.pageX, y = e.pageY;
  	var offset = widget.offset();

  	return x -offset.left > 0 && x - offset.left < widget.width() && y - offset.top > widget.height()/2 && y - offset.top <= widget.height();
  }
  /**
   * 判断鼠标是否移到了widgetPlace上，如果该place没有包含widget
   * 或者当前鼠标位置在其最后一个widget的下面，那么将widget添加到该place中
   * @access private
   * @param e 鼠标在drag移动过程中的事件
   * @param widget 需要判断是否有over事件的widget
   * @return
   *
   */
  function isOverWidgetPlace(widget, e) {
  	for(var i=0; i < widgetPlaces.length; i++) {
  		var widgetPlace = widgetPlaces[i];
  		var offset = widgetPlace.offset();
  		var x = e.pageX, y = e.pageY;
  		if(x - offset.left > 0 && x - offset.left < widgetPlace.width() && y - offset.top > 0 && y - offset.top < widgetPlace.height()) {
  			//如果widgetPlace中没有widget或者当前鼠标在widgetPlace最后一个child的下面 那么添加到该widgetPlace
  			var children = widgetPlace.children('.widget');
  			if(children.length == 0 || children.last().offset().top < y) {
  				widget.appendTo(widgetPlace);
  			}
  			
  			break;
  		}
  	}
  }
  
  /**
   * 当在拖动一个widget时触发的事件，主要判断鼠标所处的位置，来将移动的widget放到合适的地方
   * 
   * @access private
   * @param widget 需要移动的widget
   * @param e 鼠标在drag移动过程中的事件
   * @return 
   *
   */
	function onWidgetDrag(widget, e) {
		for(var i=0; i < widgets.length; i++ ) {
			if(widget[0] != widgets[i][0]) {
				if(isOverTopHalf(e, widgets[i])) {widget.insertBefore(widgets[i]);break;}
				else if(isOverBottomHalf(e, widgets[i])) {widget.insertAfter(widgets[i]);break;}
				else isOverWidgetPlace(widget, e);
			} else if(isOverTopHalf(e, widgets[i]) || isOverBottomHalf(e, widgets[i])) {
					break;
			}
		}
		
	}
	
	function onAddingWidgetStart(e) {
		var widgetPlace = widgetPlaces[0];
		var ww = getWidgetWidth(widgetPlaces.length) - 5;
		proxy.width(ww);
		proxy.insertBefore(widgetPlace.children()[0]);
	}
	
	function onAddingWidget(e) {
		for(var i=0; i < widgets.length; i++ ) {
			if(isOverTopHalf(e, widgets[i])) {proxy.insertBefore(widgets[i]);break;}
			else if(isOverBottomHalf(e, widgets[i])) {proxy.insertAfter(widgets[i]);break;}
			else isOverWidgetPlace(proxy, e);
		}
	}
	
	function onAddingWidgetEnd(e) {
		var container = $($.fn.EasyWidgets.defaults.selectors.container);

		var offset = container.offset();
		var x = e.pageX, y = e.pageY;
		if(!(x - offset.left > 0 && x - offset.left < container.width() && y - offset.top > 0 && y - offset.top < container.height())) {
			proxy.remove();
			return;
		}
		var widgetHtml = widgetTemplate.replace(/{title}/, 'panel' + widgets.length).replace(/{movable}/, 'widget-move').replace(/{collapsible}/, 'true').replace(/{closable}/, 'true').replace(/{widgetId}/, 'widget'+widgets.length);
		var widget = $(widgetHtml).insertAfter(proxy);

		prepareWidgetBehaviour(widget);
		proxy.remove();
	}
	 /**
   * 从widget列表中删除
   * 
   * @access private
   * @param elemWidget 需要删除的widget对应的html节点元素
   * @return Boolean True if mouse on the top half area of the widget
   *
   **/
  function removeWidgetFromArray(elemWidget) {
  	for(var i=0; i < widgets.length; i++) {
  		if(elemWidget == widgets[i][0]) {
  			widgets.splice(i, 1);
  			break;
  		}
  	}
  }
  
  /**
   * 组装widget
   * 
   * @access private
   * @param widgetBase 需要组装成widget的jquery对象
   * @param widgetOnDemand 是否根据需要来创建 暂时无用
   * @param settings 配置项
   * @return 组装好的widget对象
   *
   **/
  function prepareWidgetBehaviour(widgetBase, widgetOnDemand, settings) {
	var url = widgetBase.attr('url');
  	widgetBase.panel({iconCls:'icon-widget',href:url,loadingMessage:"正在加载,请稍候...",onClose:function(){removeWidgetFromArray(widgetBase.panel('panel')[0]);widgetBase.panel('destroy');}});
  	widgetBase.removeClass('widget');
  	var widget = widgetBase.panel('panel');
  	widget.addClass('widget');
  	widget.attr('id', widgetBase.attr('widgetId'));  	
  	if(widgetBase.hasClass('widget-move')) {
  		widget.draggable({handle:'.panel-title', revert:true, proxy:'clone', onStartDrag:function(){$(this).addClass('widget-moving').find('.panel-header').addClass('widget-moving');$(this).draggable('proxy').addClass('widget-move-proxy')}, onDrag:function(e){onWidgetDrag($(this), e);},onProxyRevertEnd:function(){$(this).removeClass('widget-moving').find('.panel-header').removeClass('widget-moving');}});
  	}
  	widgets[widgets.length] = widget;
  	return widget;
  }
  
   /**
   * 组装widgetPlace
   * 
   * @access private
   * @param widgetBase 需要组装成widgetPlace的jquery对象
   * @param widgetOnDemand 是否根据需要来创建 暂时无用
   * @param settings 配置项
   * @return 组装好的widget对象
   *
   **/
  function prepareWidgetPlace(widgetPlace, i, widgetOnDemand, settings) {
  	var pid = i + 1;
  	if(widgetPlace.attr('id') == '') widgetPlace.attr('id', 'widgetPlace' + pid);
  	
		widgetPlaces[i] = widgetPlace;
		widgetPlace.find(settings.selectors.widget).each(function(i) {
  		prepareWidgetBehaviour($(this), widgetOnDemand, settings);
  	});
  }
  

  /**
   * 初始化widgets
   * 
   * @access private
   * @param widgetOnDemand 是否根据需要来创建 暂时无用
   * @param settings 配置项
   * @return 组装好的widget对象
   *
   **/
	function InitializeWidgets(settings, widgetOnDemand){
     var b = widgetOnDemand;
     var d = $.fn.EasyWidgets.defaults;
     var s = $.extend(true, d, settings);
     
     $(s.selectors.container).droppable({accept:'.actions_menu_item'});
     $(s.selectors.places).each(function(i){
       prepareWidgetPlace($(this),i,b,s);
     });
    
     var widgetColumnNum = $(s.selectors.container).attr('widgetColumnNum');
     if (widgetColumnNum) $.fn.EasyWidgets.ChangeLayout(widgetColumnNum);
	 return true;
  }
})(jQuery);