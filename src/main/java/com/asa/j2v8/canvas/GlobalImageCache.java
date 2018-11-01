package com.asa.j2v8.canvas;

import com.google.common.io.BaseEncoding;
import javafx.scene.SnapshotParameters;
import javafx.scene.canvas.Canvas;
import javafx.scene.image.Image;
import javafx.scene.paint.Color;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by bob.huang on 2018/8/19
 * 基于LruCache的全局图片缓存
 */
public class GlobalImageCache {

    private static final LruCache<String, Image> imageChahe = new LruCache<>(50);

    public static void put(String src, Image image) {

        imageChahe.put(src, image);
    }

    public static Image get(String src) {

        return imageChahe.get(src);
    }

    public static Image getOrCreate(String src) {

        Image image = imageChahe.get(src);
        if (image == null) {
            image = create(src);
            imageChahe.put(src, image);
        }
        return image;
    }

    public static Image create(String src) {

        if (src.contains("resizeApi")) {
            InputStream inputStream = GlobalImageCache.class.getClassLoader().getResourceAsStream("resizeApi.png");
            return new Image(inputStream);
        }
        if (src.startsWith("data:")) {
            //base64
            String imageData = src.split("base64,")[1];
            byte[] data = BaseEncoding.base64().decode(imageData);
            return new Image(new ByteArrayInputStream(data));
        }
        src = UrlUtils.resolve(src);
        return new Image(src);
    }

    /**
     * 根据地址获得数据的字节流
     *
     * @param strUrl 网络连接地址
     * @return
     */
    public static byte[] getImageFromNetByUrl(String strUrl) {

        try {
            URL url = new URL(strUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5 * 1000);
            InputStream inStream = conn.getInputStream();//通过输入流获取图片数据
            byte[] btImg = readInputStream(inStream);//得到图片的二进制数据
            return btImg;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 从输入流中获取数据
     *
     * @param inStream 输入流
     * @return
     * @throws Exception
     */
    public static byte[] readInputStream(InputStream inStream) throws Exception {

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len = 0;
        while ((len = inStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, len);
        }
        inStream.close();
        return outStream.toByteArray();
    }

    public static Image createFromCanvas(String canvasId) {
        //fixme 通过另一个canvas的截图,效果好些有点模糊
        Canvas canvas = GlobalCanvasHolder.get(canvasId);
        if (canvas == null) {
            return null;
        }
        SnapshotParameters snapshotParameters = new SnapshotParameters();
        snapshotParameters.setFill(Color.TRANSPARENT);
        return canvas.snapshot(snapshotParameters, null);
    }


}
