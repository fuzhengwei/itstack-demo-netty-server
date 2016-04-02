package itstack.demo.netty.server.common.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collection;
import java.util.Enumeration;
import java.util.Iterator;

public class GsonUtils {

    private static final String EMPTY_JSON = "{}";

    private static final String EMPTY_JSON_ARRAY = "[]";

    private static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";


    public static String toJson(Object target) {
        return toJson(target, null, null);
    }


    public static String toJson(Object target, Type targetType, String datePattern) {
        if (target == null) {
            return EMPTY_JSON;
        }
        GsonBuilder builder = new GsonBuilder();
        if (datePattern == null || datePattern.length() < 1) {
            datePattern = DEFAULT_DATE_PATTERN;
        }
        builder.setDateFormat(datePattern);

        Gson gson = builder.create();
        String result = EMPTY_JSON;
        try {
            if (targetType == null) {
                result = gson.toJson(target);
            } else {
                result = gson.toJson(target, targetType);
            }
        } catch (Exception ex) {
            // logger.warn("目标对象 " + target.getClass().getName() +
            // " 转换 JSON 字符串时，发生异常！", ex);
            if (target instanceof Collection<?> || target instanceof Iterator<?> || target instanceof Enumeration<?> || target.getClass().isArray()) {
                result = EMPTY_JSON_ARRAY;
            }
        }
        return result;
    }


    public static String toJson(Object target, Type targetType) {
        return toJson(target, targetType, null);
    }


    public static <T> T fromJson(String json, TypeToken<T> token, String datePattern) {
        if (json == null || json.length() < 1) {
            return null;
        }
        GsonBuilder builder = new GsonBuilder();
        if (datePattern == null || datePattern.length() < 1) {
            datePattern = DEFAULT_DATE_PATTERN;
        }

        builder.setDateFormat(datePattern);
        Gson gson = builder.create();
        try {
            return (T) gson.fromJson(json, token.getType());
        } catch (Exception ex) {
            // logger.error(json + " 无法转换为 " + token.getRawType().getName() +
            // " 对象!", ex);
            return null;
        }
    }


    public static Object fromJson(String json, Type type, String datePattern) {
        if (json == null || json.length() < 1) {
            return null;
        }

        GsonBuilder builder = new GsonBuilder();
        if (datePattern == null || datePattern.length() < 1) {
            datePattern = DEFAULT_DATE_PATTERN;
        }

        builder.setDateFormat(datePattern);
        Gson gson = builder.create();
        try {
            return gson.fromJson(json, type);
        } catch (Exception ex) {
            // logger.error(json + " 无法转换为 " + token.getRawType().getName() +
            // " 对象!", ex);
            return null;
        }
    }

    public static Object fromJson(String json, Type type) {
        return fromJson(json, type, null);
    }

    public static <T> T fromJson(String json, TypeToken<T> token) {
        return fromJson(json, token, null);
    }

    public static <T> T fromJson(String json, Class<T> clazz, String datePattern) {
        if (json == null || json.length() < 1) {
            return null;
        }
        GsonBuilder builder = new GsonBuilder();
        if (datePattern == null || datePattern.length() < 1) {
            datePattern = DEFAULT_DATE_PATTERN;
        }
        builder.setDateFormat(datePattern);
        Gson gson = builder.create();
        try {
            return gson.fromJson(json, clazz);
        } catch (Exception ex) {
            // logger.error(json + " 无法转换为 " + clazz.getName() + " 对象!", ex);
            return null;
        }
    }

    public static <T> T fromJson(String json, Class<T> clazz) {
        return fromJson(json, clazz, null);
    }


}