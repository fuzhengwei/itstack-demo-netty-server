package itstack.demo.netty.server.socket.redis;

import org.springframework.data.redis.core.RedisTemplate;

import java.io.Serializable;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public interface MessageProduce {

    public abstract void sendMessage(String channel, Serializable message);

    public abstract RedisTemplate getRedisTemplate();

    public abstract void setRedisTemplate(RedisTemplate redisTemplate);

}
