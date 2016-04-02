package itstack.demo.netty.server.common.utils;

/**
 * Created by fuzhengwei on 2016/3/13.
 */
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class ApplicationContextHelper implements ApplicationContextAware {

    private static ApplicationContext appCtx;

    /**
     * 此方法可以把ApplicationContext对象inject到当前类中作为一个静态成员变量。
     *
     * @param applicationContext
     *            ApplicationContext 对象.
     * @throws BeansException
     * @author fuzhengwei
     */
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
        appCtx = applicationContext;
    }

    /**
     * 获取ApplicationContext
     *
     * @return
     * @author fuzhengwei
     */
    public static ApplicationContext getApplicationContext() {
        return appCtx;
    }

    /**
     * 这是一个便利的方法，帮助我们快速得到一个BEAN
     *
     * @param beanName
     *            bean的名字
     * @return 返回一个bean对象
     * @author fuzhengwei
     */
    public static Object getBean(String beanName) {
        return appCtx.getBean(beanName);
    }

    /**
     * 这是一个便利的方法，帮助我们快速得到一个BEAN
     *
     * @param beanName
     *            bean的名字
     * @return 返回一个bean对象
     * @author fuzhengwei
     */
    public static <T> T getBean(String beanName, Class<T> beanClass) {
        return appCtx.getBean(beanName, beanClass);
    }
}
