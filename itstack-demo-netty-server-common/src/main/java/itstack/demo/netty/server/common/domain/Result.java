package itstack.demo.netty.server.common.domain;


import itstack.demo.netty.server.common.constants.Constants;

public class Result implements java.io.Serializable {

    private static final long serialVersionUID = 752386055477259305L;

    /**
     * 调用是否成功 1成功 0失败*
     */
    private boolean isSuccess;
    /**
     * 返回结果码*
     */
    private String code;
    /**
     * 返回结果信息*
     */
    private String info;

    public Result() {
    }

    public Result(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {

        return "{\"isSuccess\":" + isSuccess + ",\"info\":\"" + info + "\",\"code\":\"" + code + "\"}";
    }

    public static Result buildSuccessResult() {
        Result result = new Result();
        result.setSuccess(true);
        result.setCode(Constants.ResponseCode.SUCCESS);
        result.setInfo(Constants.ResponseInfo.SUCCESS);
        return result;
    }

    public static Result buildFailedResult(String code, String info) {
        Result result = new Result();
        result.setSuccess(true);
        result.setCode(code);
        result.setInfo(info);
        return result;
    }

    public static Result buildErrorResult(String code, String info) {
        Result result = new Result();
        result.setSuccess(false);
        result.setCode(code);
        result.setInfo(info);
        return result;
    }

}
