/**
 * 个人信息维护JS
 *
 * @author ibm
 */

var formPass;
//==修改密码窗口
function editPass(){
	//==权限判断
	$.get(getCtxPath()+"/rest/user/own/password/update/put/pre",null,function(resData){
		//==创建窗体对象
		var winPass = $.fn.createWindowWithPage('密码修改',resData);
		formPass = winPass.find('form');
		formPass.url = getCtxPath()+'/rest/user/own/password/update';
	});
}

//==保存个人信息
function saveOwnInfo(){
	var formOwnInfo = $('#ownForm');
	formOwnInfo.form('submit',{
		onSubmit:function(){
			if (formOwnInfo.form('validate')){
				$.putJSON(getCtxPath()+'/rest/user/own/info/update', formOwnInfo.serialize(),function(resData){
					if(resData.status == "success"){
						top.msgTipSuccess(resData.message);
					} else {
						top.msgTipFail(resData.message);
					}});
			}
			return false;
		}
	});
}

//==保存用户信息
function savePass(){
	formPass.form('submit',{
		onSubmit:function(){
			if (formPass.form('validate')){
				$.putJSON(formPass.url, formPass.serialize(),function(resData){
					if(resData.status == "success"){
						top.msgTipSuccess(resData.message);
						$.fn.closeWindow();
					} else {
						top.msgTipFail(resData.message);
					}
				});
			}
			return false;
		}
	});
}
