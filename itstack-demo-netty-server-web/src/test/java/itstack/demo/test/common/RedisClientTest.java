package itstack.demo.test.common;

import itstack.demo.netty.server.common.redis.RedisClient;
import itstack.demo.netty.server.common.utils.GsonUtils;
import itstack.demo.netty.server.domain.vo.ChannelUserRedisVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.ArrayList;

/**
 * Created by fuzhengwei on 2016/3/12.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/spring-config.xml")
public class RedisClientTest {

    @Resource
    private RedisClient<String, String> redisClient;
    @Resource(name = "redisTemplate")
    protected RedisTemplate<String, String> redisTemplate;
    @Test
    public void test_add() {

        String str = redisClient.keys("node",null);

        System.out.println(str);
    }


}
