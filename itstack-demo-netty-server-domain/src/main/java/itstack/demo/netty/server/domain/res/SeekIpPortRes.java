package itstack.demo.netty.server.domain.res;

import itstack.demo.netty.server.common.domain.Result;
import itstack.demo.netty.server.domain.vo.SeekIpPortVo;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
public class SeekIpPortRes {

    private Result result;
    private SeekIpPortVo seekIpPortVo;

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public SeekIpPortVo getSeekIpPortVo() {
        return seekIpPortVo;
    }

    public void setSeekIpPortVo(SeekIpPortVo seekIpPortVo) {
        this.seekIpPortVo = seekIpPortVo;
    }
}
