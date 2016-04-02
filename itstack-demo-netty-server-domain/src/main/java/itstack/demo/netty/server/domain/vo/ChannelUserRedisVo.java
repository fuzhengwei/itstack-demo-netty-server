package itstack.demo.netty.server.domain.vo;

import java.io.Serializable;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public class ChannelUserRedisVo implements Serializable {

    private String nodeIp;      //节点ip
    private String nodePort;    //节点端口
    private String ip;            //ip
    private Integer port;        //端口
    private String channelid;   //channelid
    private String shakedate;     //握手日期

    public String getNodeIp() {
        return nodeIp;
    }

    public void setNodeIp(String nodeIp) {
        this.nodeIp = nodeIp;
    }

    public String getNodePort() {
        return nodePort;
    }

    public void setNodePort(String nodePort) {
        this.nodePort = nodePort;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getChannelid() {
        return channelid;
    }

    public void setChannelid(String channelid) {
        this.channelid = channelid;
    }

    public String getShakedate() {
        return shakedate;
    }

    public void setShakedate(String shakedate) {
        this.shakedate = shakedate;
    }
}
