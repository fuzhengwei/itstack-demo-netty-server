package itstack.demo.netty.server.service;


import itstack.demo.netty.server.domain.po.ChannelServerInfo;
import itstack.demo.netty.server.domain.res.ChannelUserRes;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 16-3-2
 * Time: 上午11:59
 * To change this template use File | Settings | File Templates.
 */
public interface SocketServerService {

     public void openServer(ChannelServerInfo channelServerInfo);

     public void closeServer();

     public ChannelUserRes queryChannelUsers();

}
