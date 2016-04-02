package itstack.demo.netty.server.socket.redis.impl;

import itstack.demo.netty.server.socket.redis.MessageProduce;
import org.springframework.data.redis.core.RedisTemplate;

import java.io.Serializable;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public class MessageProduceImpl implements MessageProduce {

    private RedisTemplate<String, Object> redisTemplate = null;

    public MessageProduceImpl() {

    }

    @Override
    public void sendMessage(String channel, Serializable message) {
        redisTemplate.convertAndSend(channel, message);
    }


    public RedisTemplate getRedisTemplate() {
        return redisTemplate;
    }

    public void setRedisTemplate(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
}
