package itstack.demo.netty.server.common.constants;

public class Constants {

    public static final class ResponseCode {
        public static final String SUCCESS = "0000";
        public static final String UNKNOWN_ERROR = "0001";
        public static final String INDEX_DUP = "0002";
    }

    public static final class ResponseInfo {
        public static final String SUCCESS = "成功";
        public static final String UNKNOWN_ERROR = "未知错误";
        public static final String INDEX_DUP = "唯一索引冲突";
    }

    public static final class HeadSendType{
        public static final Integer ONE2ONE = 1;
        public static final Integer ONE2ALL = 2;
    }


}
