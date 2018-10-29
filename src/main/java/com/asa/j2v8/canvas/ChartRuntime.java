package com.asa.j2v8.canvas;

import com.asa.j2v8.runtime.AbstractRunTime;
import com.eclipsesource.v8.V8Array;
import javafx.scene.canvas.Canvas;
import org.apache.commons.lang3.StringUtils;

/**
 * @author andrew_asa
 * @date 2018/8/17.
 */
public class ChartRuntime extends AbstractRunTime {


    public ChartRuntime() {

        init();
    }

    private void init() {

        try {
            prepareBaseEnv();
            prepareEChartEnv();
            registerCanvasConstructor();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void prepareEChartEnv() throws Exception {

        String echarts = loadJS("echarts.js");

        //load echarts library
        v8.executeVoidScript(echarts);
        //show echarts env
        String env = v8.executeStringScript("JSON.stringify(echarts.env)");
        LOGGER.info("echarts status {}", env);
    }


    public void reloadChart(String optionScript) {

        if (StringUtils.isNotEmpty(optionScript)) {
            v8.executeVoidScript(optionScript);
            v8.executeVoidFunction("reloadChart", null);
        }
    }

    public void initChart(Canvas canvas) throws Exception {

        String render = loadJS("render.js");
        v8.executeVoidScript(render);
        V8Canvas v8Canvas = new V8Canvas(v8, canvas);
        V8Array params = new V8Array(v8).push(v8Canvas);//.push(LINE_CHART_DATA)
        v8.executeVoidFunction("initChart", params);
        v8Canvas.release();
        params.release();
    }
}

