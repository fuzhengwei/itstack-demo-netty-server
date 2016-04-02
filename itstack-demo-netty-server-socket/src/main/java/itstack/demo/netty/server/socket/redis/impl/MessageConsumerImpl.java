package itstack.demo.netty.server.socket.redis.impl;


import itstack.demo.netty.server.common.utils.GsonUtils;
import itstack.demo.netty.server.domain.po.ChannelUser;
import itstack.demo.netty.server.socket.agreement.Body;
import itstack.demo.netty.server.socket.agreement.Head;
import itstack.demo.netty.server.socket.agreement.Message;
import itstack.demo.netty.server.socket.cache.CacheChannelUser;
import itstack.demo.netty.server.socket.redis.MessageConsumer;

import javax.annotation.Resource;
import java.io.Serializable;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public class MessageConsumerImpl implements MessageConsumer {

    private String serverNodeKey;

    public MessageConsumerImpl(String serverNodeKey) {
        this.serverNodeKey = serverNodeKey;
    }

    @Override
    public void handleMessage(Serializable msg) {
        Message message = GsonUtils.fromJson(msg.toString(), Message.class);
        Head head = message.getHead();
        Body body = message.getBody();
        // 如果广播消息从本节点中发出直接返回不处理
        if (serverNodeKey.equals(head.getRedisPubKey())){
            return;
        }
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
                break;
            //1vn 群发消息
            case 2:
                CacheChannelUser.cacheChannelGroup.writeAndFlush(body.getContent());
                break;
            default:
                break;
        }
    }


}
