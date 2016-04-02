package itstack.demo.netty.server.domain.res;

/**
 * Created with IntelliJ IDEA.
 * User: fuzhengwei1
 * Date: 15-11-4
 * Time: 下午8:08
 * To change this template use File | Settings | File Templates.
 */
public class EasyResult {

    private boolean success;
    private String title;
    private String msg;

    static public EasyResult buildSuccessResult(){
        EasyResult easyResult = new EasyResult();
        easyResult.setSuccess(true);
        easyResult.setMsg("ok");
        return easyResult;
    }

    static public EasyResult buildErrResult(Exception e){
        EasyResult easyResult = new EasyResult();
        easyResult.setSuccess(false);
        easyResult.setMsg(e.getMessage());
        return easyResult;
    }

    static public EasyResult buildErrResult(String msg){
        EasyResult easyResult = new EasyResult();
        easyResult.setSuccess(false);
        easyResult.setMsg(msg);
        return easyResult;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
