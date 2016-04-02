/*
 * @(#)DateUtils.java
 *
 * Copyright 2014 Copyright© 2004-2013 360buy京东商城  All rights reserved.
 */
package itstack.demo.netty.server.common.utils;

import org.apache.commons.lang.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


public final class DateUtils {


    public static final String COMPLETE_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";

    public static final String ONLY_YEAR_DATE_PATTERN = "yyyy";

    public static final String YEAR_MONTH_PATTERN = "yyyy-MM";

    public static final String YEAR_MONTH_DATE_PATTEN = "yyyyMMdd";

    private static final String DEFAULT_DETE_PATTERN = "yyyy-MM-dd";

    public static final String HOUR_MINTUS_SECOND_PATTERN = "HHmmss";

    private static final int WEEK_SATURDAY = 6;

    private static final int WEEK_SUNDAY = 0;


    private DateUtils() {

    }

    public static String getDefaultDatePattern() {
        return DEFAULT_DETE_PATTERN;
    }


    public static String getToday() {
        Date today = new Date();
        return format(today);
    }


    public static String getToday(String pattern) {
        Date today = new Date();
        return format(today, pattern);
    }


    public static String format(Date date) {
        if (date != null) {
            return format(date, getDefaultDatePattern());
        }
        return "";
    }


    public static String format(Date date, String pattern) {
        if (date != null) {
            return new SimpleDateFormat(pattern).format(date);
        }
        return "";
    }


    public static Date parse(String strDate) throws ParseException {
        if (StringUtils.isBlank(strDate)) {
            return null;
        }
        return parse(strDate, getDefaultDatePattern());
    }


    public static Date parse(String strDate, String pattern) throws ParseException {
        if (StringUtils.isBlank(strDate)) {
            return null;
        }
        return new SimpleDateFormat(pattern).parse(strDate);

    }


    public static Date addMonth(Date date, int n) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, n);
        return cal.getTime();
    }


    public static Date addDay(Date date, int n) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DAY_OF_MONTH, n);
        return cal.getTime();
    }


    public static String addDay(String date, int n) throws ParseException {
        Calendar cal = Calendar.getInstance();
        cal.setTime(parse(date));
        cal.add(Calendar.DAY_OF_MONTH, n);
        return format(cal.getTime());
    }


    public static boolean isWeekEnd(String today) throws ParseException {
        Calendar cal = Calendar.getInstance();
        cal.setTime(parse(today));
        int week = cal.get(Calendar.DAY_OF_WEEK) - 1;
        if (week == WEEK_SATURDAY || week == WEEK_SUNDAY) {
            return true;
        }
        return false;
    }


    public static List<String> getDateDiffValues(final String startDate, final String endDate) throws ParseException {
        String newstartDate = format(parse(startDate));
        String newendDate = format(parse(endDate));
        List<String> result = new ArrayList<String>();
        if (newstartDate.equals(newendDate)) {
            result.add(newstartDate);
            return result;
        }

        result.add(newstartDate);
        while (!newstartDate.equals(newendDate)) {
            newstartDate = addDay(newstartDate, 1);
            result.add(newstartDate);
        }

        return result;
    }


    public static int getDateDiff(final Date startTime, final Date endTime) {
        int times = Integer.valueOf((startTime.getTime() - endTime.getTime()) / (24 * 3600 * 1000) + "");
        return times;
    }


    public static Date getDateMaxTime(Date date) {
        if (date == null) {
            return date;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        return calendar.getTime();

    }
}