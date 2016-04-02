package itstack.demo.netty.server.socket.netty;


import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;
import itstack.demo.netty.server.common.redis.RedisClient;
import itstack.demo.netty.server.common.utils.ApplicationContextHelper;
import itstack.demo.netty.server.common.utils.DateUtils;
import itstack.demo.netty.server.common.utils.GsonUtils;
import itstack.demo.netty.server.domain.po.ChannelServerInfo;
import itstack.demo.netty.server.domain.po.ChannelUser;
import itstack.demo.netty.server.socket.agreement.Body;
import itstack.demo.netty.server.socket.agreement.Head;
import itstack.demo.netty.server.socket.agreement.Message;
import itstack.demo.netty.server.socket.cache.CacheChannelUser;
import itstack.demo.netty.server.socket.redis.MessageProduce;

import javax.annotation.Resource;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Date;

public class MyServerHandLer extends ChannelHandlerAdapter {
    // 链接信息
    private ChannelServerInfo channelServerInfo;
    private String serverNodeKey = "";
    // 广播
    private static MessageProduce messageProduce = ApplicationContextHelper.getBean("messageProduce", MessageProduce.class);
    // redis
    private static RedisClient<String, ArrayList<String>> redisClient = ApplicationContextHelper.getBean("redisClient", RedisClient.class);

    public MyServerHandLer(ChannelServerInfo channelServerInfo) {
        this.channelServerInfo = channelServerInfo;
        serverNodeKey = channelServerInfo.getIp() + ":" + channelServerInfo.getPort();
    }

    /*
     * channelAction
     *
     * channel 通道
     * action  活跃的
     *
     * 当客户端主动链接服务端的链接后，这个通道就是活跃的了。也就是客户端与服务端建立了通信通道并且可以传输数据
     *
     */
    public void channelActive(ChannelHandlerContext ctx) throws Exception {

        System.out.println(ctx.channel().localAddress().toString() + " channelActive");
        String str = "您已经开启与服务端链接" + " 您的channelId：" + ctx.channel().id() + " " + new Date() + " " + ctx.channel().localAddress();
        ctx.writeAndFlush(str);

        // 获取IP&PORT
        InetSocketAddress inetSocketAddress = (InetSocketAddress) ctx.channel().remoteAddress();
        // 封装对象
        ChannelUser channelUser = new ChannelUser();
        channelUser.setNodeIp(channelServerInfo.getIp());
        channelUser.setNodePort(String.valueOf(channelServerInfo.getPort()));
        channelUser.setIp(inetSocketAddress.getAddress().getHostAddress());
        channelUser.setPort(inetSocketAddress.getPort());
        channelUser.setChannelid(ctx.channel().id().toString());
        channelUser.setShakedate(DateUtils.format(new Date(), DateUtils.COMPLETE_DATE_PATTERN));
        channelUser.setChannel(ctx.channel());
        // 链接对象添加到缓存
        CacheChannelUser.cacheChannel.put(channelUser.getChannelid(), channelUser);
        // 添加到组里
        CacheChannelUser.cacheChannelGroup.add(ctx.channel());
    }

    /*
     * channelInactive
     *
     * channel 	通道
     * Inactive 不活跃的
     *
     * 当客户端主动断开服务端的链接后，这个通道就是不活跃的。也就是说客户端与服务端的关闭了通信通道并且不可以传输数据
     *
     */
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        // 从channelGroup中移除，当有客户端退出后，移除channel。
        System.out.println(ctx.channel().localAddress().toString() + " channelInactive");
        // 链接对象添加到缓存
        CacheChannelUser.cacheChannel.remove(ctx.channel().id().toString());
        // 移除channel组
        CacheChannelUser.cacheChannelGroup.remove(ctx.channel());
        //捕获约即可关闭
        ctx.close();
    }

    /*
     * channelRead
     *
     * channel 通道
     * Read    读
     *
     * 简而言之就是从通道中读取数据，也就是服务端接收客户端发来的数据
     * 但是这个数据在不进行解码时它是ByteBuf类型的后面例子我们在介绍
     *
     */
    public void channelRead(ChannelHandlerContext ctx, Object msg)
            throws Exception {

        Message message = GsonUtils.fromJson(msg.toString(), Message.class);
        Head head = message.getHead();
        Body body = message.getBody();
        head.setRedisPubKey(serverNodeKey);
        //消息处理
        switch (head.getSendType()) {
            //1v1 发消息
            case 1:
                // 验证消息接收方是否属于本节点
                // 如果在直接根据channelId调出channel发送信息
                if (serverNodeKey.equals(head.getReceiveServerKey())) {
                    String channelId = head.getChannelId();
                    ChannelUser channelUser = CacheChannelUser.cacheChannel.get(channelId);
                    channelUser.getChannel().writeAndFlush(body.getContent());
                }
                // 如果不在则发送广播redis-pub
                else {
                    messageProduce.sendMessage("itstack", GsonUtils.toJson(message));
                }
                break;
            //1vn 群发消息
            case 2:
                CacheChannelUser.cacheChannelGroup.writeAndFlush(body.getContent());
                messageProduce.sendMessage("itstack", GsonUtils.toJson(message));
                break;
            default:
                break;
        }
    }

    /*
     * channelReadComplete
     *
     * channel  通道
     * Read     读取
     * Complete 完成
     *
     * 在通道读取完成后会在这个方法里通知，对应可以做刷新操作
     * ctx.flush()
     *
     */
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }

    /*
     * exceptionCaught
     *
     * exception	异常
     * Caught		抓住
     *
     * 抓住异常，当发生异常的时候，可以做一些相应的处理，比如打印日志、关闭链接
     *
     */
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause)
            throws Exception {
        // 链接对象移除出缓存
        CacheChannelUser.cacheChannel.remove(ctx.channel().id().toString());
        ctx.close();
    }

}
