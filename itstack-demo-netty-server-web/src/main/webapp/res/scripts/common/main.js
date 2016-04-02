/**
 * 主界面框架js
 * @author ibm
 */
var menuTop = function(){  
	$("body").eq(0).layout('collapse','north'); 
}

//==菜单调用,增加Tab标签
var menuCall = function(title, href, closable){
	
	var center = $('#main-center');
	if (center.tabs('exists', title)){
		center.tabs('select', title);
		var tab = center.tabs('getTab',title);
		tab.children().attr('src',href);
	} else {
		if (href){
			var content = '<iframe frameborder="0"  src="'+href+'" style="width:100%;height:100%;"></iframe>';
		} else {
			var content = '尚未实现';
		}
		if (closable!=false) closable=true;//默认为true,可以关闭
		center.tabs('add',{
			title:title,
			closable:closable,
			content:content
		});
	}
	tabClose();
}
//==关闭Tab标签
var menuClose = function(title){
	var center = $('#main-center');
	if (center.tabs('exists', title)){
		center.tabs('close', title);
	}
}
//==信息提示
var msgTipSuccess=function(info,time){
	//==dialogTip不存在，则创建一个
	if($("#dialogTip").length<=0){
		$(document.body).prepend('<div id="dialogTip"></div>');
	};
	
	//==提示效果
	$("#dialogTip").attr('class','msgTipSuccess').css({display:"block",top:"100px"});
	$("#dialogTip").html(info).fadeOut(time?time:2000);
}

var msgTipFail=function(info,time){
	//==dialogTip不存在，则创建一个
	if($("#dialogTip").length<=0){
		$(document.body).prepend('<div id="dialogTip"></div>');
	};

	//==提示效果
	$("#dialogTip").attr("class","msgTipFail").css({display:"block",top:"100px"});
	$("#dialogTip").html(info).fadeOut(time?time:4000);
}

var msgTipAlert=function(info,time){
	//==dialogTip不存在，则创建一个
	if($("#dialogTip").length<=0){
		$(document.body).prepend('<div id="dialogTip"></div>');
	};

	//==提示效果
	$("#dialogTip").attr("class","msgTipAlert").css({display:"block",top:"100px"});
	$("#dialogTip").html(info).fadeOut(time?time:4000);
}

function tabClose()
{
    /*双击关闭TAB选项卡*/
	$(".tabs-inner").dblclick(function(){
        var subtitle = $(this).children("span").text();
        $('#tabs').tabs('close',subtitle);
    })

    $(".tabs-inner").bind('contextmenu',function(e){
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY,
        });
        
        var subtitle =$(this).children("span").text();
        $('#mm').data("currtab",subtitle);
        
        return false;
    });
}

//绑定右键菜单事件
function tabCloseEven()
{
    //关闭当前
    $('#mm-tabclose').click(function(){
        var currtab_title = $('#mm').data("currtab");
        if(currtab_title=='首页'){
        	msgTipAlert('首页不能关闭！');
        }else{
        	 menuClose(currtab_title);
        }
    })
    //全部关闭
    $('#mm-tabcloseall').click(function(){
        $('.tabs-inner span').each(function(i,n){
            var t = $(n).text();
            if(t!=''&&t!='首页'){
            	menuClose(t);
            }
        });    
    });
    //关闭除当前之外的TAB
    $('#mm-tabcloseother').click(function(){
        var currtab_title = $('#mm').data("currtab");
        $('.tabs-inner span').each(function(i,n){
            var t = $(n).text();
            if(t!=currtab_title&&t!='首页')
            	menuClose(t);
        });    
    });
    //关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function(){
        var nextall = $('.tabs-selected').nextAll();
        if(nextall.length==0){
        	msgTipAlert('右侧没有可关闭的TAB');
            return false;
        }
        nextall.each(function(i,n){
            var t=$('a:eq(0) span',$(n)).text();
            if(t!='首页'){
            	menuClose(t);
            }
        });
        return false;
    });
    //关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function(){
        var prevall = $('.tabs-selected').prevAll();
        if(prevall.length==0){
            msgTipAlert('左侧没有可关闭的TAB');
            return false;
        }
        prevall.each(function(i,n){
            var t=$('a:eq(0) span',$(n)).text();
            if(t!='首页'){
            	menuClose(t);
            }
        });
        return false;
    });
}

//显示时间
function showtime(){
			
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	
	var h=d.getHours()
	var m=d.getMinutes()
	var s=d.getSeconds()
	
	if(m < 10){
		m ="0"+m;
		
	}else if(s < 10){
		s = "0"+s;
	}

	var nowtime;
	nowtime = year+"/"+month+"/"+day+" "+h+":"+m+":"+s;
	
	$(".north-tool-wrap div font").html(nowtime);
	
	setTimeout('showtime()',500);
}

