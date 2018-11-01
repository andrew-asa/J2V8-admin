package com.asa.j2v8.canvas;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by bob.huang on 2018/8/19
 */
public class UrlUtils {
    public static URL baseUrl = null;
    public static String resolve(String url) {
        try {
            if (url == null) {
                return "";
            }
            if (url.startsWith("data:")) {
                //base64
                return url;
            }
            return new URL(baseUrl,url).toString();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return url;
    }
}
