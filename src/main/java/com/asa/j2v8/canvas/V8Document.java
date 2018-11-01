package com.asa.j2v8.canvas;

import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;
import com.fr.general.ComparatorUtils;
import javafx.scene.canvas.Canvas;

/**
 * @author andrew_asa
 * @date 2018/10/29.
 */
public class V8Document extends V8Object {

    private Canvas canvas;

    public V8Document(V8 v8, Canvas canvas) {

        super(v8);
        this.canvas = canvas;
        init();
    }

    private void init() {

        registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                if (parameters.length() == 1 && ComparatorUtils.equals("canvas", parameters.getString(0))) {
                    System.out.println("调用方法getElementById");
                    return new V8Canvas(v8, canvas);
                }
                throw new RuntimeException("no support document method");
            }
        }, "getElementById");
    }
}
