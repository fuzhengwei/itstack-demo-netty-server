package itstack.demo.netty.server.socket.agreement;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 16-3-2
 * Time: 下午1:49
 * To change this template use File | Settings | File Templates.
 */
public class Head {

    // 发送类型
    private Integer sendType;
    // channelId
    private String channelId;
    // 接收方服务端key：ip_port 127.0.0.1_7398
    private String receiveServerKey;
    // 广播key：ip_port 127.0.0.1_7397
    private String redisPubKey;

    public Integer getSendType() {
        return sendType;
    }

    public void setSendType(Integer sendType) {
        this.sendType = sendType;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getReceiveServerKey() {
        return receiveServerKey;
    }

    public void setReceiveServerKey(String receiveServerKey) {
        this.receiveServerKey = receiveServerKey;
    }

    public String getRedisPubKey() {
        return redisPubKey;
    }

    public void setRedisPubKey(String redisPubKey) {
        this.redisPubKey = redisPubKey;
    }
}
