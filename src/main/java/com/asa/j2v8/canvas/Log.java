package com.asa.j2v8.canvas;

import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by bob.huang on 2018/8/20
 * 日志输出
 */
public class Log {
    private static final Logger LOGGER = Logger.getLogger("JCanvas");

    static {
        LOGGER.setLevel(Level.FINE);
        ConsoleHandler handler = new ConsoleHandler();
        handler.setLevel(Level.FINE);
        LOGGER.addHandler(handler);
    }

    public static void d(String text) {
        LOGGER.log(Level.FINE, text);
    }

    public static void i(String text) {
        LOGGER.log(Level.INFO, text);
    }
}
