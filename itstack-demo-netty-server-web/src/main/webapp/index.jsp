<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ include file="/res_head.jsp" %>
<html>
<head>
    <title>后台管理</title>
    <%@ include file="/res_easyui.jsp" %>
</head>
<html>
<body>
<table id="dg" class="easyui-datagrid"
       style="width: 100%;" url="socketServerController/queryChannelUsers.do"
       toolbar="#tb" rownumbers="true" singleSelect="true">
    <thead>
    <tr>
        <th data-options="field:'ck',checkbox:true"></th>
        <th field="nodeIp">节点IP</th>
        <th field="nodePort">节点Port</th>
        <th field="ip">用户IP</th>
        <th field="port">用户Port</th>
        <th field="channelid">channelId</th>
        <th field="shakedate">链接日期</th>
    </thead>
</table>
<!-- 工具栏 -->
<div id="tb" style="padding:2px 5px;">
    <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-push" plain="true" onclick="doOpen()">开启服务</a>
    |
    <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-push" plain="true" onclick="doClose()">关闭服务</a>
    |
    <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-push" plain="true" onclick="doPush()">发送消息</a>
</div>

<!-- 发送消息 -->
<div id="dg_push" class="easyui-dialog" style="width: 350px; height: 200px; padding: 10px 20px" closed="true"
     buttons="#dlg-push-buttons">
    <div class="ftitle">
        发送消息
    </div>
    <div class="fitem">
        <label style="text-align:right;width: 90px;">
            IP：
        </label>
        <span id="p_ip"></span>
    </div>
    <div class="fitem">
        <label style="text-align:right;width: 90px;">
            PORT：
        </label>
        <span id="p_port"></span>
    </div>
    <div class="fitem">
        <div style="width: 90px;float:left;text-align: left;">
            发送内容：
        </div>
        <input id="p_content" class="easyui-textbox"
               data-options="multiline:true,missingMessage:'该输入项为必输项'"
               style="width:300px;height:50px" required="true" max="20">
    </div>
</div>
<div id="dlg-push-buttons">
    <a href="javascript:void(0)" class="easyui-linkbutton c6"
       iconCls="icon-ok" onclick="doPushSubmit();" style="width: 90px">发送</a>
    <a href="javascript:void(0)" class="easyui-linkbutton"
       iconCls="icon-cancel" onclick="javascript: $('#dg_push').dialog('close');" style="width: 90px">关闭</a>
</div>

<script language="javascript">

    function doOpen() {
        $.messager.confirm('确认框',
                '确定开启服务吗？', function (r) {
                    if (r) {
                        $.get('socketServerController/doOpenServer.do',
                                function (result) {
                                    $.messager.alert('提醒', result.msg);
                                }, 'json');
                    }
                });

    }

    function doClose() {
        $.messager.confirm('确认框',
                '确定关闭服务吗？', function (r) {
                    if (r) {
                        $.get('socketServerController/doCloseServer.do',
                                function (result) {
                                    $.messager.alert('提醒', result.msg);
                                }, 'json');
                    }
                });

    }

    function doPush() {
        var row = $('#dg').datagrid('getChecked');
        if (row.length == 0) {
            $.messager.alert('警告', '没有选中任何数据');
            return;
        } else if (row.length > 1) {
            $.messager.alert('警告', '每次只能选中一条数据');
            return;
        } else {
            $('#p_ip').text(row[0].ip);
            $('#p_port').text(row[0].port);
            $('#dg_push').dialog('open').dialog('setTitle', '发送消息');
        }
    }

    function doPushSubmit() {
        var row = $('#dg').datagrid('getChecked');
        if (row.length == 0) {
            $.messager.alert('警告', '没有选中任何数据');
            return;
        } else if (row.length > 1) {
            $.messager.alert('警告', '每次只能选中一条数据');
            return;
        } else {
            $.messager.confirm('确认框',
                    '确定发送消息吗？', function (r) {
                        if (r) {
                            $.post('socketServerController/doSendMessage.do',
                                    {
                                        channelId: row[0].channelid,
                                        content: $('#p_content').textbox("getValue")
                                    }, function (result) {
                                        if (result.success) {
                                            $('#dg_push').dialog('close')
                                        } else {
                                            $.messager.show({
                                                title: 'Error',
                                                msg: result.msg
                                            });
                                        }
                                    }, 'json');
                        }
                    });
        }
    }
</script>

<style type="text/css">
    #fm {
        margin: 0;
        padding: 10px 30px;
    }

    .ftitle {
        font-size: 14px;
        font-weight: bold;
        padding: 5px 0;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
    }

    .fitem {
        margin-bottom: 5px;
    }

    .fitem label {
        display: inline-block;
        width: 80px;
    }

    .fitem input {
        width: 160px;
    }
</style>
</body>
</html>