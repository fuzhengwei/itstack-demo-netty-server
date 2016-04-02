package itstack.demo.netty.server.socket.redis;

import java.io.Serializable;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public interface MessageConsumer {

    void handleMessage(Serializable message);

}
