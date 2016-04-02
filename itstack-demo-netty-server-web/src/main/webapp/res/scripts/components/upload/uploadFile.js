var selectFile;
var fileUploader;
(function($){
	$.fileUpload=function(){}
	$.fileUpload.uploadComplelteCallback = null;
	$.fileUpload.fileSelectOkCallback = null;
	$.fileUpload.init = function (uploadUrl, flashUrl, buttonImage, buttonWidth,buttonHeight,uploadOkCallback, fileSelectOkCallback,fileTypes) {
		$.fileUpload.uploadComplelteCallback=uploadOkCallback;
		$.fileUpload.fileSelectOkCallback=fileSelectOkCallback;
		fileUploader = new SWFUpload({
			upload_url : uploadUrl,
			flash_url : flashUrl,
			post_params : {
			},
			file_size_limit : "500MB",
			button_image_url:buttonImage,
			button_width: buttonWidth?buttonWidth:"145",
			button_height: buttonHeight?buttonHeight:"30",
			button_placeholder_id: "uploaderContainer",
			button_text: '',
			button_text_style: ".theFont { font-size: 12; }",
			button_text_left_padding: 1,
			button_text_top_padding: 1,
			button_cursor:SWFUpload.CURSOR.HAND,
			file_types : fileTypes,
			file_queued_handler:$.fileUpload.fileQueued,
			file_dialog_complete_handler:$.fileUpload.fileDialogCompleteHandler,
			upload_success_handler:$.fileUpload.uploadSuccessEventHandler
		});
	}
	$.fileUpload.fileQueued = function(file) {
		selectFile = file;
	}
	$.fileUpload.uploadSuccessEventHandler = function(file, server_data) {
		var result = eval('(' + server_data + ')');
		if(typeof($.fileUpload.uploadComplelteCallback) == 'function') $.fileUpload.uploadComplelteCallback(file,result);
	}
	$.fileUpload.fileDialogCompleteHandler = function(selected, queued) {
		if(typeof($.fileUpload.fileSelectOkCallback) == 'function') $.fileUpload.fileSelectOkCallback(selectFile);
	}
})(jQuery);