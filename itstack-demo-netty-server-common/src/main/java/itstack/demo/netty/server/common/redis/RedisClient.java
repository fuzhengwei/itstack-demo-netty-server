package itstack.demo.netty.server.common.redis;

import itstack.demo.netty.server.common.utils.GsonUtils;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Set;

/**
 * Created by fuzhengwei on 2016/3/12.
 */
@Component("redisClient")
public class RedisClient<K extends Serializable, V extends Serializable> {

    @Resource(name = "redisTemplate")
    protected RedisTemplate<K, V> redisTemplate;

    /**
     * 添加
     *
     * @param key
     * @param value
     * @return
     */
    public boolean add(final String key, final String value) {
        boolean resultBoolean = false;
        if (redisTemplate != null) {
            resultBoolean = redisTemplate.execute(new RedisCallback<Boolean>() {
                public Boolean doInRedis(RedisConnection connection)
                        throws DataAccessException {
                    RedisSerializer<String> serializer = getRedisSerializer();
                    byte[] keys = serializer.serialize(key);
                    byte[] values = serializer.serialize(value);
                    return connection.setNX(keys, values);
                }
            });
        } else {
            return redisTemplate == null;
        }
        return resultBoolean;
    }


    /**
     * 根据key获取对象
     */
    public String get(final String key) {
        String resultStr = null;
        if (redisTemplate != null) {
            resultStr = redisTemplate.execute(new RedisCallback<String>() {
                public String doInRedis(RedisConnection connection) throws DataAccessException {
                    RedisSerializer<String> serializer = getRedisSerializer();
                    byte[] keys = serializer.serialize(key);
                    byte[] values = connection.get(keys);

                    if (values == null) {
                        return null;
                    }
                    String value = serializer.deserialize(values);
                    return value;
                }
            });
        }
        return resultStr;
    }

    public String keys(final String key, final String filter) {
        String resultStr = null;
        if (redisTemplate != null) {
            resultStr = redisTemplate.execute(new RedisCallback<String>() {
                public String doInRedis(RedisConnection connection) throws DataAccessException {
                    RedisSerializer<String> serializer = getRedisSerializer();
                    byte[] keys = serializer.serialize(key);
                    Set<byte[]> values = connection.keys(keys);
                    if (values == null) {
                        return null;
                    }
                    ArrayList<String> list = new ArrayList<String>();
                    for (byte[] bytes : values) {
                        String str = serializer.deserialize(bytes);
                        if (filter != null && !filter.equals("")&& str.indexOf(filter) > 0) {
                            list.add(str);
                        } else {
                            list.add(str);
                        }
                    }
                    return GsonUtils.toJson(list);
                }
            });
        }
        return resultStr;
    }

    /**
     * 根据key删除对象
     */
    public void delete(final String key) {
        redisTemplate.execute(new RedisCallback<Object>() {
            public String doInRedis(RedisConnection connection) throws DataAccessException {
                connection.del(redisTemplate.getStringSerializer().serialize(key));
                return null;
            }
        });
    }

    /**
     * 获取 RedisSerializer
     */
    protected RedisSerializer<String> getRedisSerializer() {
        return redisTemplate.getStringSerializer();
    }

}
