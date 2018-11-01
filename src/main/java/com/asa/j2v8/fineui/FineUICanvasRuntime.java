package com.asa.j2v8.fineui;

import com.asa.j2v8.canvas.V8Document;
import com.asa.j2v8.canvas.V8Image;
import com.asa.j2v8.canvas.V8Window;
import com.asa.j2v8.runtime.AbstractRunTime;
import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Function;
import com.eclipsesource.v8.V8Object;
import com.fr.third.org.apache.commons.io.IOUtils;
import javafx.scene.canvas.Canvas;
import javafx.scene.text.Font;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

/**
 * @author andrew_asa
 * @date 2018/10/23.
 * Fine ui 用canvas运行环境适配
 */
public class FineUICanvasRuntime extends AbstractRunTime {

    private String BASE_PATH = "/Users/andrew_asa/Documents/code/finebi/direct-maven/fineui-platform-canvas";

    private Canvas canvas;


    public String[] FINE_UI_JS_LIST = new String[]{
            "fineui/dist/fineui_without_jquery_polyfill.js",
            "fineui-materials/docs/materials_without_jquery.js",
            "dist/fineui.platform.canvas.js",
            "dist/cssom.js",
            "dist/cssfont.js",
            //"dist/bundle.js",
    };

    public FineUICanvasRuntime(Canvas canvas) {

        try {
            initCanvas(canvas);
            prepareBaseEnv();
            prepareFineUIEnv();
            prepareWidgetEnv();
            registerCanvasConstructor();
            registerWindowObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * fine ui 环境
     */
    public void prepareFineUIEnv() throws Exception {

        System.out.println("prepareFineUIEnv");
        File baseFile = new File(BASE_PATH);
        for (String js : FINE_UI_JS_LIST) {
            File jsFile = new File(baseFile, js);
            InputStream inputStream = new FileInputStream(jsFile);
            try {
                String jst = readText(inputStream);
                v8.executeVoidScript(jst);
                System.out.println("success load " + jsFile.getName());
            } catch (Exception e) {
                System.out.println("error load " + jsFile.getName());
                e.printStackTrace();
            } finally {
                IOUtils.closeQuietly(inputStream);
            }
        }
        loadBIFont();
    }

    public void prepareWidgetEnv() throws Exception {

        try {
            String imageFix = loadJS("image-fix.js");
            v8.executeVoidScript(imageFix);
            String fx = loadJS("fx-adapter.js");
            v8.executeVoidScript(fx);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }


    public void registerWindowObject() {

        V8Window window = new V8Window(v8);
        v8.add("window", window);
        V8Object document = new V8Document(v8, canvas);
        v8.add("document", document);
        V8Function constructor = new V8Function(v8, new JavaCallback() {
            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {
                return new V8Image(v8);
            }
        });
        v8.add("Image", constructor);
    }

    private void loadBIFont() {

        Font font = Font.loadFont(this.getClass().getClassLoader().getResource("bi.ttf").toString(), 12);
        //Font font = Font.loadFont(this.getClass().getClassLoader().getResourceAsStream("iconfont.ttf"), 12);
        //FontUtils.setBIFONT(font);
        //GraphicsEnvironment ge =
        //        GraphicsEnvironment.getLocalGraphicsEnvironment();
        //ge.registerFont(Font.createFont(Font.TRUETYPE_FONT, new File("iconfont.ttf")));

    }

    public Canvas getCanvas() {

        return canvas;
    }

    public void setCanvas(Canvas canvas) {

        this.canvas = canvas;
    }

    /**
     * 创建组件
     *
     * @param js
     */
    public void createWidget(String js) {

        if (StringUtils.isNotEmpty(js)) {
            v8.executeVoidScript(js);
        }
    }

    public void initCanvas(Canvas canvas) throws Exception {

        this.canvas = canvas;
        //String render = loadJS("render-fineui-canvas.js");
        //v8.executeVoidScript(render);
        //V8Array params = new V8Array(v8).push(v8Canvas);
        //v8.executeVoidFunction("initFineUIWithCanvas", params);
    }
}
