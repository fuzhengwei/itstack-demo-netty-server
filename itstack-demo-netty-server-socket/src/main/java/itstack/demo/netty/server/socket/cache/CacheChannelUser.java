package itstack.demo.netty.server.socket.cache;


import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;
import itstack.demo.netty.server.domain.po.ChannelUser;


import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 16-3-2
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */
public class CacheChannelUser {

    // 缓存channel
    public static Map<String, ChannelUser> cacheChannel = Collections.synchronizedMap(new HashMap<String, ChannelUser>());
    // 缓存channel组
    public static ChannelGroup cacheChannelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

}


