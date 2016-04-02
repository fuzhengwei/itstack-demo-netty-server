package itstack.demo.test.redis;

import itstack.demo.netty.server.socket.redis.MessageProduce;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/spring-config.xml")
public class RedisProduceTest {

    @Resource
    private MessageProduce messageProduce;

    @Test
    public void test_sendMessage() {
        messageProduce.sendMessage("itstack","hi boy");

    }

}
