package itstack.demo.netty.server.web;

import itstack.demo.netty.server.common.constants.Constants;
import itstack.demo.netty.server.common.domain.Result;
import itstack.demo.netty.server.common.utils.ApplicationContextHelper;
import itstack.demo.netty.server.common.utils.GsonUtils;
import itstack.demo.netty.server.domain.po.ChannelServerInfo;
import itstack.demo.netty.server.domain.po.ChannelUser;
import itstack.demo.netty.server.domain.res.ChannelUserRes;
import itstack.demo.netty.server.domain.res.EasyResult;
import itstack.demo.netty.server.domain.res.SeekIpPortRes;
import itstack.demo.netty.server.domain.vo.SeekIpPortVo;
import itstack.demo.netty.server.service.SocketServerService;
import itstack.demo.netty.server.socket.cache.CacheChannelUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 16-3-2
 * Time: 上午11:36
 * To change this template use File | Settings | File Templates.
 */
@Controller("socketServerController")
@RequestMapping("/socketServerController/")
public class SocketServerController {

    private Logger logger = LoggerFactory.getLogger(SocketServerController.class);

    @Value("${netty.port}")
    private int port;
    @Value("${netty.ip}")
    private String ip;

    @Autowired
    private SocketServerService socketServerService;

    @RequestMapping(value = "doOpenServer")
    @ResponseBody
    public EasyResult doOpenServer() {
        logger.info("开启socket服务端开始");
        try {
            ChannelServerInfo channelServerInfo = new ChannelServerInfo();
            channelServerInfo.setIp(ip);
            channelServerInfo.setPort(port);
            socketServerService.openServer(channelServerInfo);
            logger.info("开启socket服务端结束");
            return EasyResult.buildSuccessResult();
        } catch (Exception e) {
            logger.info("开启服务端失败。",e);
            return EasyResult.buildErrResult(e);
        }
    }

    @RequestMapping(value = "doCloseServer")
    @ResponseBody
    public EasyResult doCloseServer() {
        logger.info("关闭socket服务端开始");
        try {
            socketServerService.closeServer();
            logger.info("关闭socket服务端结束");
            return EasyResult.buildSuccessResult();
        } catch (Exception e) {
            logger.error("关闭socket服务端失败。", e);
            return EasyResult.buildErrResult(e);
        }
    }

    @RequestMapping(value = "queryChannelUsers")
    @ResponseBody
    public Map<String, Object> queryChannelUsers() {
        ChannelUserRes channelUserRes = socketServerService.queryChannelUsers();
        if ("0000".equals(channelUserRes.getResult().getCode())) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("total", channelUserRes.getChannelUsers().size());
            map.put("rows", channelUserRes.getChannelUsers());
            return map;
        } else {
            return null;
        }
    }

    @RequestMapping(value = "doSendMessage")
    @ResponseBody
    public EasyResult doSendMessage(@RequestParam String channelId, @RequestParam String content) {
        String requestStr = GsonUtils.toJson(channelId) + GsonUtils.toJson(content);
        logger.info("发送消息。req：" + requestStr);
        try {
            // 查找对应id的channel
            ChannelUser channelUser = CacheChannelUser.cacheChannel.get(channelId);
            if (null != channelUser) {
                channelUser.getChannel().writeAndFlush(content);
            } else {
                return EasyResult.buildErrResult("对方已经下线");
            }
            return EasyResult.buildSuccessResult();
        } catch (Exception e) {
            logger.info("发送消息失败。req：" + requestStr, e);
            return EasyResult.buildErrResult(e);
        }
    }

    @RequestMapping(value = "doSendMessage")
    @ResponseBody
    public SeekIpPortRes seek(){
        SeekIpPortRes seekIpPortRes = new SeekIpPortRes();
        try {
            logger.info("socket寻址开始。");
            SeekIpPortVo seekIpPortVo = new SeekIpPortVo();
            seekIpPortVo.setIp(ip);
            seekIpPortVo.setPort(port);
            seekIpPortVo.setCpuRatio(Runtime.getRuntime().totalMemory() / 1024);
            seekIpPortRes.setResult(Result.buildSuccessResult());
            seekIpPortRes.setSeekIpPortVo(seekIpPortVo);
            logger.info("socket寻址结束。res："+GsonUtils.toJson(seekIpPortRes));
        } catch (Exception e){
            logger.error("socket寻址失败。",e);
            seekIpPortRes.setResult(Result.buildFailedResult(Constants.ResponseCode.UNKNOWN_ERROR,Constants.ResponseInfo.UNKNOWN_ERROR));
        }
        return seekIpPortRes;
    }


}
