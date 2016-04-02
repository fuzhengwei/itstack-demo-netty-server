package itstack.demo.netty.server.domain.vo;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public class SeekIpPortVo {

    private String ip;      //ip
    private int port;      //端口
    private long cpuRatio; //cpu使用率

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public long getCpuRatio() {
        return cpuRatio;
    }

    public void setCpuRatio(long cpuRatio) {
        this.cpuRatio = cpuRatio;
    }
}
