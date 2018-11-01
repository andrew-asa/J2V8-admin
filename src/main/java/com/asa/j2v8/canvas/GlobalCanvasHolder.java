package com.asa.j2v8.canvas;

import javafx.scene.canvas.Canvas;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by bob.huang on 2018/8/19
 * 用于持有js端创建的canvas对应的原生对象,在drawImage接口可能会传入一个作为缓冲的离屏canvas
 */
public class GlobalCanvasHolder {
    private static final Map<String,Canvas> CANVAS_HOLDER = new HashMap<>();
    public static Canvas get(String id) {
        return CANVAS_HOLDER.get(id);
    }
    public static void put(String id, Canvas canvas) {
        //fixme 什么时机该释放引用? 大部分canvas都是被临时使用,只有需要drawImage的才需要被持有
        CANVAS_HOLDER.put(id,canvas);
    }
}
