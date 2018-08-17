package com.asa.j2v8.canvas;

import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.JavaVoidCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;
import javafx.scene.canvas.Canvas;

/**
 *
 */
public class V8Canvas extends V8Object {

    public V8Canvas(final V8 v8, final Canvas canvas) {
        super(v8);

        registerJavaMethod(new JavaCallback() {
            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {
                System.out.println("调用方法getContext");
                return new V8Context(v8, canvas.getGraphicsContext2D());
            }
        }, "getContext");

        registerJavaMethod(new JavaCallback() {
            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {
                return canvas.getWidth();
            }
        }, "getWidth");
        registerJavaMethod(new JavaCallback() {
            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {
                return canvas.getHeight();
            }
        }, "getHeight");
        registerJavaMethod(canvas, "setWidth", "setWidth", new Class[]{double.class});
        registerJavaMethod(canvas, "setHeight", "setHeight", new Class[]{double.class});
        add("width", canvas.getWidth());
        add("height", canvas.getHeight());
    }

}
