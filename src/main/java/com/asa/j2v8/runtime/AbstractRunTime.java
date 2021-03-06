package com.asa.j2v8.runtime;

import com.asa.j2v8.canvas.ChartRuntime;
import com.asa.j2v8.canvas.V8Canvas;
import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.Releasable;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Function;
import com.eclipsesource.v8.V8Object;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.canvas.Canvas;
import javafx.util.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

/**
 * @author andrew_asa
 * @date 2018/8/22.
 */
public class AbstractRunTime {

    protected V8 v8 = V8.createV8Runtime();

    protected List<Releasable> unReleaseTimer = new ArrayList<Releasable>();

    protected Logger LOGGER = LoggerFactory.getLogger(ChartRuntime.class);

    public AbstractRunTime() {

    }


    public void prepareBaseEnv() {
        //将log/warn方法代理成原生print
        v8.executeVoidScript("var console = {" +
                                     "log:function(s){print(s);}, warn:function(s){print(s);}, error:function(s){print(s);}"

                                     +
                                     "}");
        v8.registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                //LOGGER.info(parameters.getString(0));
                return null;
            }
        }, "print");

        //注册setTimeout
        v8.registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object v8Object, V8Array v8Array) {

                V8Function function = (V8Function) v8Array.getObject(0);
                int time = v8Array.getInteger(1);
                unReleaseTimer.add(function);
                LOGGER.info("do setTimeout after {}", time);
                Platform.runLater(new Runnable() {

                    @Override
                    public void run() {

                        new Timeline(new KeyFrame(Duration.millis(time), new EventHandler<ActionEvent>() {

                            @Override
                            public void handle(ActionEvent event) {

                                if (!v8.isReleased()) {
                                    function.call(null, null);
                                }
                                unReleaseTimer.remove(function);
                                function.release();
                                LOGGER.info("time run");
                            }
                        })).play();
                    }
                });
                return null;
            }
        }, "setTimeout");

        //注册setInterval
        v8.registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object v8Object, V8Array v8Array) {

                V8Function function = (V8Function) v8Array.getObject(0);
                int time = v8Array.getInteger(1);
                Platform.runLater(new Runnable() {

                    @Override
                    public void run() {

                        Timeline timeline = new Timeline(new KeyFrame(Duration.millis(time), new EventHandler<ActionEvent>() {

                            @Override
                            public void handle(ActionEvent event) {

                                if (!v8.isReleased()) {
                                    function.call(null, null);
                                }
                            }
                        }));
                        timeline.setCycleCount(Timeline.INDEFINITE);
                        timeline.play();
                    }
                });
                return null;

            }
        }, "setInterval");
    }

    public void release() {
        //释放v8,并报告内存泄漏情况
        unReleaseTimer.forEach(new Consumer<Releasable>() {

            @Override
            public void accept(Releasable releasable) {

                releasable.release();
            }
        });
        unReleaseTimer.clear();
        v8.release(true);
    }

    public String loadJS(String name) throws Exception {

        return readText(this.getClass().getClassLoader().getResourceAsStream(name));
    }


    /*读取Text文件操作*/
    public String readText(InputStream stream) {

        String lines = "";
        StringBuffer sb = new StringBuffer();
        try {
            Reader fileReader = new InputStreamReader(stream);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sb.toString();
    }

    public V8 getV8() {

        return v8;
    }

    public void setV8(V8 v8) {

        this.v8 = v8;
    }

    public void registerCanvasConstructor() {

        V8Function v8CanvasFunc = new V8Function(v8, new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                LOGGER.info("new canvas");
                double width = 0;
                double height = 0;
                if (parameters.length() == 2) {
                    width = parameters.getDouble(0);
                    height = parameters.getDouble(0);
                }
                return new V8Canvas(v8, new Canvas(width, height));
            }
        });
        v8.add("Canvas", v8CanvasFunc);
        v8CanvasFunc.release();
    }
}
