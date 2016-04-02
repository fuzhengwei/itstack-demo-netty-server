var fileUploader;
var queuedImages = [];
var totalBytes = 0;
var totalUploadBytes = 0;
function setImageFiles(files) {
	var divTemplate = '<div id="info{fileindex}"><div class="upload_file">{filename}</div> \
        <div class="upload_size">{filesize}</div> \
        <div class="upload_del action_del"><a href="javascript:void 0" onclick="$.fileUpload.removeFileFromQueue({fileindex}, this);"></a></div></div>';
	for(var i=0; i < files.length;i++) {
		var fileSize = parseInt(files[i].size/1024, 10);
		if(fileSize > 1024)
			fileSize = parseInt(fileSize/1024, 10) + 'M';
		else
			fileSize = fileSize + "K";
		$('.upload').append(divTemplate.replace(/{filename}/, files[i].name).replace(/{filesize}/, fileSize).replace(/{fileindex}/g,files[i].index));
	}
}
function setUploaderBottom() {
	var bTemplate = '{filecount}个文件 | 共{filesize}';
	var countAndSize = getFileCountAndSize();

	countAndSize[1] = parseInt(countAndSize[1]/1024, 10);
	if(countAndSize[1] > 1024)
		countAndSize[1] = parseInt(countAndSize[1]/1024, 10) + "MB";
	else	
		countAndSize[1] = countAndSize[1] + "KB";
	$('.upload_total').html(bTemplate.replace(/{filecount}/, countAndSize[0]).replace(/{filesize}/, countAndSize[1]));
}
function getFileCountAndSize() {
	var count = queuedImages.length;
	var size = 0;
	for(var i =0; i < count; i++) {
		size += queuedImages[i].size;
	}
	totalBytes = size;
	return [count, size];
}
function initUploaderFrame(){
	//==初始化文件队列
	queuedImages=[];
	//==生成上传页面
	var uploadDiv = '<div id="uploadWindow" class="upload_bg" > \
			<span id="uploaderContainer"></span> \
			<div id="uploadInfoDiv"> \
				<div class="upload_title"> \
					<div class="upload_file">文件</div> \
					<div class="upload_size">大小</div> \
					<div class="upload_del">删除/状态</div> \
				</div> \
				<div class="clear"></div> \
				<div class="upload"></div> \
				<div class="upload_total"></div> \
				<div class="upload_btn"> \
				  <input type="button" class="input_login" value="上传" onclick="$.fileUpload.startUpload();"/> \
				</div> \
			</div> \
		</div>';
     $(uploadDiv).appendTo('body')
}
function setImageUploadFrame() {
	var uploadDiv = '<div class="upload_title"> \
    	<div class="upload_file">文件</div> \
        <div class="upload_size">大小</div> \
        <div class="upload_del">删除/状态</div> \
    	</div> \
    	<div class="clear"></div> \
	    <div class="upload"> \
	    </div> \
    <div class="upload_total"></div> \
    <div class="upload_btn"> \
      <input type="button" class="input_login" value="上传" onclick="$.fileUpload.startUpload();"/> \
    </div>';
     $('#uploadInfoDiv').html(uploadDiv);
}

(function($){
	
	$.fileUpload=function(){}
	$.fileUpload.uploadComplelteCallback = null;
	$.fileUpload.easyWindow = function(title,uploadUrl, callback, fileTypes){
		var flashUrl = getCtxPath()+"/res/scripts/components/upload/UploadFile.swf?v2.2.1";
		var buttonImage = getCtxPath()+"/res/scripts/components/upload/styles/img/uploadpic.gif";
		$.fileUpload.init(uploadUrl,flashUrl,buttonImage, callback,fileTypes);
		$('#uploadWindow').createWindow(title);
	},
	$.fileUpload.init = function (uploadUrl, flashUrl, buttonImage, callback, fileTypes) {
		initUploaderFrame();
		setUploaderBottom();
		uploadComplelteCallback=callback;
		fileUploader = new SWFUpload({
			upload_url : uploadUrl,
			flash_url : flashUrl,
			post_params : {
				
			},
			file_size_limit : "500MB",
			button_image_url:buttonImage,
			button_width: "145",
			button_height: "30",
			button_placeholder_id: "uploaderContainer",
			button_text: '',
			button_text_style: ".theFont { font-size: 12; }",
			button_text_left_padding: 1,
			button_text_top_padding: 1,
			button_cursor:SWFUpload.CURSOR.HAND,
			file_types : fileTypes,
			file_queued_handler:$.fileUpload.fileQueued,
			file_dialog_complete_handler:$.fileUpload.fileDialogCompleteHandler,
			upload_progress_handler:$.fileUpload.fileProgressHandler,
			upload_start_handler:$.fileUpload.uploadStartHandler,
			upload_success_handler:$.fileUpload.uploadSuccessEventHandler,
			upload_complete_handler:$.fileUpload.uploadCompleteHandler			 
		});
	}
	$.fileUpload.uploadSuccessEventHandler = function(file, server_data) {
		var result = eval('(' + server_data + ')');
		if(result.status == 'success') {
			var upid = '#up' + file.index;
			$('#info' + file.index).find('.upload_del').removeClass('upload_del').addClass('upload_success').append('<div></div>');
			$(upid).css('width', 400).remove();
			for(var i=0; i < queuedImages.length;i++) {
				if(queuedImages[i].index == file.index) {queuedImages.splice(i, 1);break;}
			}
			if(queuedImages.length == 0) {
				$('.upload_btn').html('<div class="upload_ok">上传成功！</div>');
				if(typeof(uploadComplelteCallback) == 'function') uploadComplelteCallback();
			}
		}
	}
	$.fileUpload.uploadCompleteHandler=function(file) {
		totalUploadBytes += file.size;
		fileUploader.startUpload();
	}
	$.fileUpload.fileQueued = function(file) {
		queuedImages[queuedImages.length] = file;
	}
	$.fileUpload.fileDialogCompleteHandler = function(selected, queued) {
		setImageUploadFrame();
		setImageFiles(queuedImages);
		setUploaderBottom();
	}
	$.fileUpload.openSelectDialog = function() {
		fileUploader.selectFiles();
	}
	$.fileUpload.removeFileFromQueue = function(index, delImg) {
		$(delImg.parentNode.parentNode).remove();
		fileUploader.removeFileFromQueue(index);
		for(var i=0; i < queuedImages.length;i++) {
			if(queuedImages[i].index == index) {queuedImages.splice(i, 1);break;}
		}
		setUploaderBottom();
	}
	$.fileUpload.startUpload=function() {
		var infos = $('.action_del');
		if(infos.length == 0) return;
		for(var i=0;i<infos.length;i++) {
			$(infos[i]).find('a').remove();
		}
		fileUploader.setFilePostName('doc');
		$('.upload_btn').html('<div class="upload_bg_all"><div class="upload_c_all"></div></div>');
		totalUploadBytes = 0;
		fileUploader.startUpload();
	}
	$.fileUpload.fileProgressHandler=function(file, bytes, total) {
		var upid = '#up' + file.index;
		$(upid).css('width', 400*bytes/total);
		$('.upload_c_all').css('width', 398*(totalUploadBytes + bytes)/totalBytes);
	}

	$.fileUpload.uploadStartHandler=function(file){
		var divId = "#info" + file.index;
		var progressDiv = '<div class="upload_c_one" id="up{fileindex}"></div>'.replace(/{fileindex}/, file.index);
		$(divId).addClass('upload_bg_one').append(progressDiv)
	}
	
})(jQuery);