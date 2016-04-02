

//JavaScript Document
/*******************************************************************************
 * 
 * 加载上传的flash读取文件按钮
 */
$(document).ready( function() {
	$("#browse").uploadify( {
		'uploader' : getCtxPath()+'/res/scripts/components/jquery.uploadify/uploadify.swf?'+ new Date().getTime() + 'a' + Math.random(), // flash路径 进行文件过滤
		'script' : getCtxPath()+'/rest/mobile/flash/read', // 后台处理程序的相对路径 。默认值：uploadify.php
		'cancelImg' : getCtxPath()+'/res/scripts/components/jquery.uploadify/cancel.png', // 取消上传的背景图片
		'fileDataName' : 'filedata', // 上传的文件名
		'queueID' : 'progressbar', // 显示进度条的DIV层的ID
		'auto' : true, // 是否自动上传
		'multi' : true, // 设置为true时可以上传多个文件
		'simUploadLimit' : 1,//同时允许上传的数量
		'sizeLimit' : 9000000000, // 上传文件的大小限制 。 按字节计算的
		'queueSizeLimit' : 1, // 当允许多文件生成时，设置选择文件的个数，默认值：999 。
		'fileDesc' : '支持格式：txt;xls;', // 这个属性值必须设置fileExt属性后才有效，用来设置选择文件对话框中的提示文本
		'fileExt' : '*.txt;*.xls', // 可以上传的文件名的后缀
		'onSelect' : function(e, queueId, fileObj) {
			$("#select").hide();
			$("#read").show();
		 },
		'onComplete' : function(event, queueID, fileObj, response, data) {
		 	var obj =  JSON.parse(response);// 获取到后台的数据 并转换成JSON格式
		 	// 判断是否读取成功 如果成功则提示成功 并将读取的数据返回给文本编辑框
		 	if (obj.status="success") {
		 		// 获得文本编辑框的值
				var phone = $("#phone").val();
				// 获得读取的文件数据
				var message = obj.message;
				// 看看读取的文件是否已经添加
				var len = phone.indexOf(message);
				if(message==null||message==""){
					alert("没有在该文件找到匹配的号码！");
				}else if (len == -1) {
					$("#phone").val(phone + message);
				}else{
					alert("该文件内容与您已输入的号码重复或者您已经导入！请选择其他的文件！");
				}
			}else{
				alert("读取失败！请您正规操作！");
			}
		 	$("#read").hide();
			$("#select").show();
		}
	});

});

//==改变下拉框的值
function selChange(){
	var val = $("#group").val();
	//==判断不为空
	if(val!=""){
		$.ajax({    
			  url: getCtxPath()+'/rest/wap/public',
		      type: "POST",       
		      dataType: "json", 
		      data: { groupId:val },
		      success: function(data){
		    	  $("#wap").empty();
		    	  $.each(data, function(i, item) {    
		    		  $('#wap').append('<option value="'+ item.phone +'">'+ item.name +'</option>');
		    	  }); 
		      }  
		 }); 		
	}
}

/*******************************************************************************
 * 控制select的值移动
 * 
 * @param obj
 * @return
 */
function moveOption(obj) {
	try {
		for ( var i = 0; i < obj.options.length; i++) {
			if (obj.options[i].selected) {
				var text = obj.options[i].text;
				var val = obj.options[i].value;
				var phones = $("#phone").val();
				var len = val.indexOf(phones);
				if (phones=="" && len == 0) {
					$("#phone").val(phones + val + ",");
				}
				if (phones!="" && len == -1) {
					$("#phone").val(phones + val + ",");
				}
			}
		}
	} catch (e) {
	}
}