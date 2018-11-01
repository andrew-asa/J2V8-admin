package com.asa.j2v8.canvas;

import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.JavaVoidCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Function;
import com.eclipsesource.v8.V8Object;
import com.google.common.io.BaseEncoding;
import javafx.scene.image.Image;
import org.apache.batik.css.engine.value.css2.SrcManager;

import java.io.ByteArrayInputStream;

/**
 * Created by bob.huang on 2018/8/19
 */
public class V8Image extends V8Object {

    private Image image;

    public static void register(final V8 v8) {

        V8Function constructor = new V8Function(v8, new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                return new V8Image(v8);
            }
        });
        v8.add("Image", constructor);
        constructor.release();
    }

    public V8Image(V8 v8) {

        super(v8);
        V8Object proto = v8.getObject("NativeImagePrototype");
        setPrototype(proto);
        proto.release();
        registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                if (image == null) {
                    return 0;
                }
                return image.getHeight();
            }
        }, "getHeight");
        registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                if (image == null) {
                    return 0;
                }
                return image.getWidth();
            }
        }, "getWidth");

        registerJavaMethod(new JavaVoidCallback() {

            @Override
            public void invoke(V8Object receiver, V8Array parameters) {

                String src = parameters.getString(0);

                //System.out.println("setSrc " + src);
                //if (src.startsWith("data:")) {
                //    //base64
                //    String imageData = src.split("base64,")[1];
                //    byte[] data = BaseEncoding.base64().decode(imageData);
                //    image = new Image(new ByteArrayInputStream(data));
                //} else {
                //    //fixme 这种是属于同步加载图片,会阻塞图表绘制,先实现了效果,再优化下异步加载方式的适配
                //    image = GlobalImageCache.getOrCreate(src);
                //}
                //if (receiver.getType("onload") == V8_FUNCTION) {
                //    //同步加载方式,这里可以立即通知图表图片加载完成
                //    V8Function onload = (V8Function) receiver.getObject("onload");
                //    onload.call(receiver, null);
                //    onload.release();
                //}

                ImageFetchService fetchService = new ImageFetchService();
                fetchService.loadImage(src, image -> {
                    if (receiver.getType("onload") == V8_FUNCTION) {
                        //同步加载方式,这里可以立即通知图表图片加载完成
                        V8Function onload = (V8Function) receiver.getObject("onload");
                        onload.call(receiver, null);
                        onload.release();
                    }
                });

            }
        }, "setSrc");
    }
}
