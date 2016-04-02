package itstack.demo.test.common;

import itstack.demo.netty.server.common.constants.Constants;
import itstack.demo.netty.server.common.utils.GsonUtils;
import itstack.demo.netty.server.socket.agreement.Body;
import itstack.demo.netty.server.socket.agreement.Head;
import itstack.demo.netty.server.socket.agreement.Message;
import org.junit.Test;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 16-3-1
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
public class GsonUtilsTest {

    @Test
    public void test_toJson(){
        Head head = new Head();
        head.setSendType(Constants.HeadSendType.ONE2ONE);
        head.setChannelId("edfbaefa");
        head.setReceiveServerKey("127.0.0.1:7391");
        Body body = new Body();
        body.setContent("你好，我是hello");

        Message message = new Message();
        message.setHead(head);
        message.setBody(body);

        System.out.println(GsonUtils.toJson(message));
    }


}
