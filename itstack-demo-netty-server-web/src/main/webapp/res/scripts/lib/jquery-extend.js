/*
 * 继承自JQuery的一些方法和函数
 */
(function($) {
	$.extend({
		get: function(url, data, callback, type) {
	        if ( $.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = null;
			}
			return $.ajax({
				type: "GET",
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
	    },
		post: function(url, data, callback, type) {
	        if ( $.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = null;
			}
			return $.ajax({
				type: "POST",
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
	    },
	    put: function(url, data, callback, type) {
	        if ( $.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = null;
			}
			return $.ajax({
				type: "PUT",
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
	    },
	    //delete是关键字不能直接使用
	    delete_: function(url, data, callback, type) {
	       if ( $.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = null;
			}
			return $.ajax({
				type: "DELETE",
				url: url,
				data: data,
				success: callback,
				dataType: type
			});
	    },
	    getJSON:function(url, data, callback) {
	    	return $.get(url, data, callback, 'json');
	    },
	    postJSON:function(url, data, callback) {
	    	return $.post(url, data, callback, 'json');
	    },
	    putJSON: function (url, data, callback) {
	    	//==虚拟PUT方法
	    	if(data == null) { data = "_method=put" }
	    	else { data = "_method=put&" + data; };

	    	//==执行提交
	    	return $.postJSON(url, data, callback);
	    },
	    deleteJSON: function(url, data, callback) {
	    	return $.delete_(url, data, callback, "json");
	    },
	    ajaxPost:function(url, data, callback) {
	    	return $.ajax({
				type: "POST",
				url: url,
				data: data,
				success: callback,
				contentType:"application/json",
				dataType: "json"
			});
		},    
	    ajaxPut: function (url, data, callback) {
	    	return $.ajax({
				type: "PUT",
				url: url,
				data: data,
				success: callback,
				contentType:"application/json",
				dataType: "json"
			});
	    },
	    ajaxDelete: function (url, data, callback) {
	    	return $.ajax({
				type: "DELETE",
				url: url,
				data: data,
				success: callback,
				contentType:"application/json",
				dataType: "json"
			});
	    },
	    getGuid:function(){
	    	var guid = "";
	    	for (var i = 1; i <= 32; i++){
		    	var n = Math.floor(Math.random()*16.0).toString(16);
		    	guid += n;
		    	if((i==8)||(i==12)||(i==16)||(i==20))
		    		guid += "-";
	    	}
	    	return guid;
	    }
	});
	
	$.fn.extend({
	});	
	
})(jQuery);

//====================================================================
//==时间对象的格式化
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()// millisecond
    }
 
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }
 
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//====================================================================
//==查询条件处理
var CondOperator = {EQUAL:'=', LIKE:'like', NOTEQUAL:"<>"};
var Condition = function(a, b, c, d){
	this.key = a;
	this.operator = b;
	if(this.operator == CondOperator.LIKE){ 
		//==转码处理  在后台URLDecoder.decode("","UTF-8");时会出现%不容在此做处理
		this.value = encodeURIComponent(c)?'%25' + encodeURIComponent(c) + '%25':encodeURIComponent(c);
	}
	else this.value = encodeURIComponent(c);
	if ((d) &&(d=='or')) this.joinType = 'or';
}
//==将条件数组转化为JSON，如果value为空则不处理
var parseCondJSON=function(objs){
	var jsons = [];
	for(var i =0; i < objs.length; i++) {
		var obj = objs[i];
		if(typeof(obj.value) == 'string' && obj.value.length > 0) jsons.push(obj);
	}
	return $.toJSON(jsons);
}
//====================================================================
//==分隔栏点击事件处理
var dividerClick = function(divider,content){
	var obj = $(content);
	var css = obj.css('display');
	if (css!='none') {
		obj.css('display','none');
		$(divider).removeClass('icon-stuck');
		$(divider).addClass('icon-stick');
	} else {
		obj.css('display','');
		$(divider).removeClass('icon-stick');
		$(divider).addClass('icon-stuck');
	}
}
