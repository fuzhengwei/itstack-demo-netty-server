package itstack.demo.netty.server.service.impl;


import itstack.demo.netty.server.common.constants.Constants;
import itstack.demo.netty.server.common.domain.Result;
import itstack.demo.netty.server.common.redis.RedisClient;
import itstack.demo.netty.server.domain.po.ChannelServerInfo;
import itstack.demo.netty.server.domain.po.ChannelUser;
import itstack.demo.netty.server.domain.res.ChannelUserRes;
import itstack.demo.netty.server.service.SocketServerService;
import itstack.demo.netty.server.socket.cache.CacheChannelUser;
import itstack.demo.netty.server.socket.netty.ServerSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 16-3-2
 * Time: 下午12:00
 * To change this template use File | Settings | File Templates.
 */
@Service("socketServerService")
public class SocketServerServiceImpl implements SocketServerService {

    private Logger logger = LoggerFactory.getLogger(SocketServerServiceImpl.class);

    private ExecutorService executorService;
    private ServerSocket serverSocket;
    private String channelKey = "ITSTACK-NETTY-CHANNEL-KEY";
    @Resource
    private RedisClient<String, ArrayList<ChannelUser>> redisClient;

    @Override
    public void openServer(ChannelServerInfo channelServerInfo) {
        // 实例化netty
        serverSocket = new ServerSocket(channelServerInfo);
        executorService = Executors.newCachedThreadPool();
        executorService.execute(serverSocket);

    }

    @Override
    public void closeServer() {
        if (serverSocket.isActiveSocketServer()) {
            boolean isCloseOk = serverSocket.doCloseSocket();
            // Socket关闭成功
            if (isCloseOk) {
                // 关闭线程池
                if (executorService != null) {
                    if (!executorService.isShutdown()) {
                        //关闭线程池
                        executorService.shutdown();
                    }
                }
            }
        }
    }

    @Override
    public ChannelUserRes queryChannelUsers() {
        ChannelUserRes channelUserRes = new ChannelUserRes();
        try {
            Collection<ChannelUser> channelUsers = CacheChannelUser.cacheChannel.values();
            channelUserRes.setResult(Result.buildSuccessResult());
            channelUserRes.setChannelUsers(channelUsers);
        } catch (Exception e) {
            logger.info("链接用户失败。", e);
            channelUserRes.setResult(Result.buildFailedResult(Constants.ResponseCode.UNKNOWN_ERROR, Constants.ResponseInfo.UNKNOWN_ERROR));
        }
        return channelUserRes;
    }

}
