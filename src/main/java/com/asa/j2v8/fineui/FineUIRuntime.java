package com.asa.j2v8.fineui;

import com.asa.j2v8.runtime.AbstractRunTime;

import java.util.Map;

/**
 * @author andrew_asa
 * @date 2018/8/22.
 */
public class FineUIRuntime extends AbstractRunTime {

    public FineUIRuntime() {

        init();
    }

    private void init() {

        try {
            prepareBaseEnv();
            prepareFineUIEnv();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void prepareFineUIEnv() throws Exception {

        String fui = loadJS("fineui_without_jquery_polyfill.js");
        String constant = loadJS("constant.js");
        //load echarts library
        String sta = loadJS("export.js");
        String en = loadJS("enums.js");
        String ma = loadJS("materials_without_jquery.js");
        //StringBuffer sb = new StringBuffer();
        //sb.append(fui).append("\n").append(sta);
        v8.executeVoidScript(fui);
        v8.executeVoidScript(constant);
        v8.executeVoidScript(en);
        //v8.executeStringScript("JSON.stringify(BI.extend)");
        v8.executeVoidScript(ma);
        v8.executeVoidScript(sta);
        //v8.executeStringScript("!(function () {\n" +
        //                               "    var Service = BI.inherit(BI.OB, {\n" +
        //                               "        getWidgetMap: function (template) {\n" +
        //                               "            var store = this._initStore(template);\n" +
        //                               "            var result = {};\n" +
        //                               "            BI.each(store.widgets, function (idx, widget) {\n" +
        //                               "                result[widget.wId] = BI.Utils.getWidgetCalculationByID(widget.wId);\n" +
        //                               "            });\n" +
        //                               "            return result;\n" +
        //                               "        },\n" +
        //                               "\n" +
        //                               "        _initStore: function (template) {\n" +
        //                               "            BI.designData = BI.deepExtend({}, BI.deepClone(BI.Constants.getConstant(\"bi.constant.design.template.conf\")), template);\n" +
        //                               "            BI.designModel = {\n" +
        //                               "                templateStyle: BI.designData.templateStyle,\n" +
        //                               "                widgets: BI.designData.widgets,\n" +
        //                               "                linkageGroup: BI.designData.linkageGroup,\n" +
        //                               "                layoutRatio: BI.designData.layoutRatio || {\n" +
        //                               "                    x: 0,\n" +
        //                               "                    y: 0\n" +
        //                               "                },\n" +
        //                               "                freeLayoutRatio: BI.designData.freeLayoutRatio || {\n" +
        //                               "                    x: 0,\n" +
        //                               "                    y: 0\n" +
        //                               "                },\n" +
        //                               "                reportName: BI.designData.reportName,\n" +
        //                               "                reportId: BI.designData.reportId\n" +
        //                               "            };\n" +
        //                               "\n" +
        //                               "            // 是否打开页面时自动查询\n" +
        //                               "            if (BI.Utils.isQueryAutoQueryWhenFresh()) {\n" +
        //                               "                BI.SharingPool.put(\"controlFilters\", BI.Utils.getControlCalculations());\n" +
        //                               "            }\n" +
        //                               "\n" +
        //                               "            return BI.designModel;\n" +
        //                               "        }\n" +
        //                               "    });\n" +
        //                               "    BI.service(\"bi.service.static.calculate\", Service);\n" +
        //                               "})(); ");
        //v8.executeObjectScript("console.log(BI)");

        //v8.executeVoidScript(sb.toString());
    }

    public Map<String, String> getWidgetReqDatas(String reportBean) {

        StringBuffer sb = new StringBuffer();
        sb.append("var service = BI.Services.getService(\"bi.service.static.calculate\");\n" +
                          "JSON.stringify(service.getWidgetMap(").append(reportBean).append("))");
        String object = v8.executeStringScript(sb.toString());
        return null;
    }
}
