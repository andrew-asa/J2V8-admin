package com.asa.fineui;

import com.asa.j2v8.fineui.FineUIRuntime;
import org.junit.Test;

/**
 * @author andrew_asa
 * @date 2018/8/22.
 */
public class FineUIRuntimeTest {

    @Test
    public void testGetWidgetReqDatas() {

        FineUIRuntime fineUIRuntime = new FineUIRuntime();
        fineUIRuntime.getWidgetReqDatas("{\n" +
                                                "  \"layoutRatio\": {\n" +
                                                "    \"x\": 0.92,\n" +
                                                "    \"y\": 1\n" +
                                                "  },\n" +
                                                "  \"freeLayoutRatio\": {\n" +
                                                "    \"x\": 0,\n" +
                                                "    \"y\": 0\n" +
                                                "  },\n" +
                                                "  \"layoutType\": 0,\n" +
                                                "  \"widgets\": {\n" +
                                                "    \"dfb38029f39e0c7c\": {\n" +
                                                "      \"type\": 4,\n" +
                                                "      \"tableName\": \"数据连接_DEMO_CONTRACT\",\n" +
                                                "      \"timeStamp\": 1534904864455,\n" +
                                                "      \"bounds\": {\n" +
                                                "        \"height\": 261,\n" +
                                                "        \"left\": 0,\n" +
                                                "        \"top\": 0,\n" +
                                                "        \"width\": 615.3333333333334\n" +
                                                "      },\n" +
                                                "      \"wId\": \"dfb38029f39e0c7c\",\n" +
                                                "      \"name\": \"未命名组件\",\n" +
                                                "      \"viewAttr\": {\n" +
                                                "        \"10000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"left\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"right\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"size\": 0\n" +
                                                "        },\n" +
                                                "        \"20000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"size\": 0\n" +
                                                "        },\n" +
                                                "        \"30000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"left\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"right\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"size\": 0\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"allowOverlap\": false,\n" +
                                                "      \"dataMining\": {\n" +
                                                "        \"algorithmName\": \"EMPTY\",\n" +
                                                "        \"uuid\": \"\",\n" +
                                                "        \"fields\": []\n" +
                                                "      },\n" +
                                                "      \"showTitle\": true,\n" +
                                                "      \"mobile\": false,\n" +
                                                "      \"view\": {\n" +
                                                "        \"10000\": [\n" +
                                                "          \"69e6f3c9633f843a\",\n" +
                                                "          \"ac25d152d1761268\"\n" +
                                                "        ],\n" +
                                                "        \"20000\": [],\n" +
                                                "        \"30000\": []\n" +
                                                "      },\n" +
                                                "      \"dimensions\": {\n" +
                                                "        \"69e6f3c9633f843a\": {\n" +
                                                "          \"name\": \"合同类型\",\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"69e6f3c9633f843a\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][7c7b][578b]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"group\": {\n" +
                                                "            \"type\": 11\n" +
                                                "          },\n" +
                                                "          \"calculation\": {\n" +
                                                "            \"type\": 0,\n" +
                                                "            \"value\": 0\n" +
                                                "          },\n" +
                                                "          \"settings\": {\n" +
                                                "            \"trendLine\": [],\n" +
                                                "            \"cordon\": [],\n" +
                                                "            \"categoryAxis\": {},\n" +
                                                "            \"valueAxis\": {\n" +
                                                "              \"sharedAxis\": null,\n" +
                                                "              \"reversed\": false,\n" +
                                                "              \"log\": false\n" +
                                                "            },\n" +
                                                "            \"annotate\": [],\n" +
                                                "            \"size\": 0,\n" +
                                                "            \"stack\": false,\n" +
                                                "            \"formatStyle\": 1,\n" +
                                                "            \"formatDecimal\": -1,\n" +
                                                "            \"numLevel\": 1,\n" +
                                                "            \"numSeparators\": true,\n" +
                                                "            \"unit\": \"\",\n" +
                                                "            \"dateFormat\": {},\n" +
                                                "            \"flash\": [],\n" +
                                                "            \"imageData\": []\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"counterDep\": \"TOTAL_ROWS\",\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true,\n" +
                                                "          \"drillDimensions\": {}\n" +
                                                "        },\n" +
                                                "        \"ac25d152d1761268\": {\n" +
                                                "          \"name\": \"购买数量\",\n" +
                                                "          \"type\": 2,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"ac25d152d1761268\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"group\": {\n" +
                                                "            \"type\": 3\n" +
                                                "          },\n" +
                                                "          \"calculation\": {\n" +
                                                "            \"type\": 0,\n" +
                                                "            \"value\": 0\n" +
                                                "          },\n" +
                                                "          \"settings\": {\n" +
                                                "            \"trendLine\": [],\n" +
                                                "            \"cordon\": [],\n" +
                                                "            \"categoryAxis\": {},\n" +
                                                "            \"valueAxis\": {\n" +
                                                "              \"sharedAxis\": null,\n" +
                                                "              \"reversed\": false,\n" +
                                                "              \"log\": false\n" +
                                                "            },\n" +
                                                "            \"annotate\": [],\n" +
                                                "            \"size\": 0,\n" +
                                                "            \"stack\": false,\n" +
                                                "            \"formatStyle\": 1,\n" +
                                                "            \"formatDecimal\": -1,\n" +
                                                "            \"numLevel\": 1,\n" +
                                                "            \"numSeparators\": true,\n" +
                                                "            \"unit\": \"\",\n" +
                                                "            \"dateFormat\": {},\n" +
                                                "            \"flash\": [],\n" +
                                                "            \"imageData\": []\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"counterDep\": \"TOTAL_ROWS\",\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true,\n" +
                                                "          \"drillDimensions\": {}\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"page\": 0,\n" +
                                                "      \"realData\": false,\n" +
                                                "      \"allData\": false,\n" +
                                                "      \"settings\": {\n" +
                                                "        \"chartAttr\": {},\n" +
                                                "        \"chartStyle\": {\n" +
                                                "          \"legend\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"fontStyle\": {\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"type\": 0,\n" +
                                                "              \"fontFamily\": \"Microsoft YaHei\",\n" +
                                                "              \"fontSize\": 12,\n" +
                                                "              \"fontColor\": \"\",\n" +
                                                "              \"fontBold\": false,\n" +
                                                "              \"bold\": false,\n" +
                                                "              \"italic\": false\n" +
                                                "            },\n" +
                                                "            \"borderColor\": \"transparent\",\n" +
                                                "            \"position\": \"right\"\n" +
                                                "          },\n" +
                                                "          \"axis\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"hGrid\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"vGrid\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"background\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"color\": null,\n" +
                                                "            \"image\": null,\n" +
                                                "            \"mapLayer\": null,\n" +
                                                "            \"type\": null\n" +
                                                "          },\n" +
                                                "          \"adaptive\": {\n" +
                                                "            \"type\": \"standard\"\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"tableStyle\": {\n" +
                                                "          \"form\": 1,\n" +
                                                "          \"style\": 0,\n" +
                                                "          \"themeColor\": null,\n" +
                                                "          \"showTitle\": false,\n" +
                                                "          \"freezeDim\": true,\n" +
                                                "          \"transmitLinkages\": true,\n" +
                                                "          \"expandRowHeader\": false,\n" +
                                                "          \"expandColHeader\": false,\n" +
                                                "          \"showRowSum\": true,\n" +
                                                "          \"showColSum\": true,\n" +
                                                "          \"showSequence\": false,\n" +
                                                "          \"rowHeight\": 25,\n" +
                                                "          \"rowCounts\": 20,\n" +
                                                "          \"colCounts\": 7,\n" +
                                                "          \"totalRows\": 1000,\n" +
                                                "          \"font\": {\n" +
                                                "            \"type\": 1,\n" +
                                                "            \"header\": {\n" +
                                                "              \"fontFamily\": null,\n" +
                                                "              \"fontSize\": null,\n" +
                                                "              \"bold\": null,\n" +
                                                "              \"italic\": null,\n" +
                                                "              \"underline\": null,\n" +
                                                "              \"fontAlign\": null,\n" +
                                                "              \"fontColor\": null\n" +
                                                "            },\n" +
                                                "            \"body\": {\n" +
                                                "              \"fontFamily\": null,\n" +
                                                "              \"fontSize\": null,\n" +
                                                "              \"bold\": null,\n" +
                                                "              \"italic\": null,\n" +
                                                "              \"underline\": null,\n" +
                                                "              \"dimFontAlign\": null,\n" +
                                                "              \"tarFontAlign\": null,\n" +
                                                "              \"fontColor\": null\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"metric\": {\n" +
                                                "            \"show\": true,\n" +
                                                "            \"position\": 3,\n" +
                                                "            \"type\": 1\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"tableAttr\": {\n" +
                                                "          \"equalDivideColumn\": false,\n" +
                                                "          \"color\": {\n" +
                                                "            \"all\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"color\": \"\",\n" +
                                                "              \"conditions\": []\n" +
                                                "            },\n" +
                                                "            \"ac25d152d1761268\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"color\": \"\",\n" +
                                                "              \"conditions\": []\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"shape\": {\n" +
                                                "            \"all\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"shape\": -1,\n" +
                                                "              \"value\": 0\n" +
                                                "            },\n" +
                                                "            \"ac25d152d1761268\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"shape\": -1,\n" +
                                                "              \"value\": 0\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"filterValue\": {}\n" +
                                                "        },\n" +
                                                "        \"titleBackground\": {\n" +
                                                "          \"type\": \"color\",\n" +
                                                "          \"color\": \"\",\n" +
                                                "          \"imageId\": \"\"\n" +
                                                "        },\n" +
                                                "        \"widgetBackground\": {\n" +
                                                "          \"type\": \"color\",\n" +
                                                "          \"color\": \"\",\n" +
                                                "          \"imageId\": \"\"\n" +
                                                "        },\n" +
                                                "        \"titleHeight\": 25,\n" +
                                                "        \"nameStyleType\": 1,\n" +
                                                "        \"gisBackground\": {\n" +
                                                "          \"show\": true,\n" +
                                                "          \"layer\": null,\n" +
                                                "          \"zoomIn\": \"放大\",\n" +
                                                "          \"zoomOut\": \"缩小\"\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"linkage\": {\n" +
                                                "        \"25d83f46a75f1fb7\": {\n" +
                                                "          \"widget\": null,\n" +
                                                "          \"clicked\": null\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"jump\": [],\n" +
                                                "      \"openJump\": true,\n" +
                                                "      \"dimensionGroups\": {\n" +
                                                "        \"dfb38029f39e0c7c_数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]_3_0\": {\n" +
                                                "          \"group\": \"dfb38029f39e0c7c_数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]_3_0\",\n" +
                                                "          \"dimensionIds\": [\n" +
                                                "            \"ac25d152d1761268\"\n" +
                                                "          ]\n" +
                                                "        },\n" +
                                                "        \"dfb38029f39e0c7c_数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][7c7b][578b]_11\": {\n" +
                                                "          \"group\": \"dfb38029f39e0c7c_数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][7c7b][578b]_11\",\n" +
                                                "          \"dimensionIds\": [\n" +
                                                "            \"69e6f3c9633f843a\"\n" +
                                                "          ]\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"drillOrder\": [],\n" +
                                                "      \"resultFilter\": [],\n" +
                                                "      \"columnSize\": [],\n" +
                                                "      \"regionColumnSize\": [],\n" +
                                                "      \"uploadedImages\": [],\n" +
                                                "      \"measures\": [\n" +
                                                "        {\n" +
                                                "          \"name\": \"购买数量\",\n" +
                                                "          \"id\": \"数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]\",\n" +
                                                "          \"type\": 32,\n" +
                                                "          \"geoType\": 0,\n" +
                                                "          \"transform\": false,\n" +
                                                "          \"copied\": false,\n" +
                                                "          \"drilled\": false,\n" +
                                                "          \"group\": {\n" +
                                                "            \"summary_3\": {\n" +
                                                "              \"cal\": {\n" +
                                                "                \"cal_0\": {\n" +
                                                "                  \"repeatCal\": true,\n" +
                                                "                  \"settings\": {\n" +
                                                "                    \"trendLine\": [],\n" +
                                                "                    \"cordon\": [],\n" +
                                                "                    \"annotate\": [],\n" +
                                                "                    \"size\": 0,\n" +
                                                "                    \"stack\": false,\n" +
                                                "                    \"formatStyle\": 1,\n" +
                                                "                    \"formatDecimal\": -1,\n" +
                                                "                    \"numLevel\": 1,\n" +
                                                "                    \"numSeparators\": true,\n" +
                                                "                    \"unit\": \"\",\n" +
                                                "                    \"flash\": [],\n" +
                                                "                    \"imageData\": []\n" +
                                                "                  },\n" +
                                                "                  \"showMissingTime\": false\n" +
                                                "                }\n" +
                                                "              },\n" +
                                                "              \"repeatCal\": true,\n" +
                                                "              \"showMissingTime\": false\n" +
                                                "            }\n" +
                                                "          }\n" +
                                                "        }\n" +
                                                "      ]\n" +
                                                "    },\n" +
                                                "    \"25d83f46a75f1fb7\": {\n" +
                                                "      \"type\": 5,\n" +
                                                "      \"tableName\": \"数据连接_DEMO_CONTRACT\",\n" +
                                                "      \"timeStamp\": 1534939011039,\n" +
                                                "      \"bounds\": {\n" +
                                                "        \"height\": 261,\n" +
                                                "        \"left\": 820.4444444444445,\n" +
                                                "        \"top\": 0,\n" +
                                                "        \"width\": 615.3333333333334\n" +
                                                "      },\n" +
                                                "      \"wId\": \"25d83f46a75f1fb7\",\n" +
                                                "      \"name\": \"未命名组件1\",\n" +
                                                "      \"viewAttr\": {\n" +
                                                "        \"10000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"left\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"right\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"size\": 0\n" +
                                                "        },\n" +
                                                "        \"20000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"size\": 0\n" +
                                                "        },\n" +
                                                "        \"30000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"left\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"right\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"size\": 0\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"allowOverlap\": false,\n" +
                                                "      \"dataMining\": {\n" +
                                                "        \"algorithmName\": \"EMPTY\",\n" +
                                                "        \"uuid\": \"\",\n" +
                                                "        \"fields\": []\n" +
                                                "      },\n" +
                                                "      \"showTitle\": true,\n" +
                                                "      \"mobile\": false,\n" +
                                                "      \"view\": {\n" +
                                                "        \"10000\": [\n" +
                                                "          \"d591e0f876b40163\"\n" +
                                                "        ],\n" +
                                                "        \"20000\": [],\n" +
                                                "        \"30000\": [\n" +
                                                "          \"8df830402161c6f9\"\n" +
                                                "        ]\n" +
                                                "      },\n" +
                                                "      \"dimensions\": {\n" +
                                                "        \"d591e0f876b40163\": {\n" +
                                                "          \"name\": \"合同付款类型\",\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"d591e0f876b40163\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][4ed8][6b3e][7c7b][578b]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"group\": {\n" +
                                                "            \"type\": 11\n" +
                                                "          },\n" +
                                                "          \"calculation\": {\n" +
                                                "            \"type\": 0,\n" +
                                                "            \"value\": 0\n" +
                                                "          },\n" +
                                                "          \"settings\": {\n" +
                                                "            \"trendLine\": [],\n" +
                                                "            \"cordon\": [],\n" +
                                                "            \"categoryAxis\": {},\n" +
                                                "            \"valueAxis\": {\n" +
                                                "              \"sharedAxis\": null,\n" +
                                                "              \"reversed\": false,\n" +
                                                "              \"log\": false\n" +
                                                "            },\n" +
                                                "            \"annotate\": [],\n" +
                                                "            \"size\": 0,\n" +
                                                "            \"stack\": false,\n" +
                                                "            \"formatStyle\": 1,\n" +
                                                "            \"formatDecimal\": -1,\n" +
                                                "            \"numLevel\": 1,\n" +
                                                "            \"numSeparators\": true,\n" +
                                                "            \"unit\": \"\",\n" +
                                                "            \"dateFormat\": {},\n" +
                                                "            \"flash\": [],\n" +
                                                "            \"imageData\": []\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"counterDep\": \"TOTAL_ROWS\",\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true,\n" +
                                                "          \"drillDimensions\": {}\n" +
                                                "        },\n" +
                                                "        \"8df830402161c6f9\": {\n" +
                                                "          \"name\": \"总金额\",\n" +
                                                "          \"type\": 2,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"8df830402161c6f9\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[603b][91d1][989d]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"group\": {\n" +
                                                "            \"type\": 3\n" +
                                                "          },\n" +
                                                "          \"calculation\": {\n" +
                                                "            \"type\": 0,\n" +
                                                "            \"value\": 0\n" +
                                                "          },\n" +
                                                "          \"settings\": {\n" +
                                                "            \"trendLine\": [],\n" +
                                                "            \"cordon\": [],\n" +
                                                "            \"categoryAxis\": {},\n" +
                                                "            \"valueAxis\": {\n" +
                                                "              \"sharedAxis\": null,\n" +
                                                "              \"reversed\": false,\n" +
                                                "              \"log\": false\n" +
                                                "            },\n" +
                                                "            \"annotate\": [],\n" +
                                                "            \"size\": 0,\n" +
                                                "            \"stack\": false,\n" +
                                                "            \"formatStyle\": 1,\n" +
                                                "            \"formatDecimal\": -1,\n" +
                                                "            \"numLevel\": 1,\n" +
                                                "            \"numSeparators\": true,\n" +
                                                "            \"unit\": \"\",\n" +
                                                "            \"dateFormat\": {},\n" +
                                                "            \"flash\": [],\n" +
                                                "            \"imageData\": []\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"counterDep\": \"TOTAL_ROWS\",\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true,\n" +
                                                "          \"drillDimensions\": {}\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"page\": 0,\n" +
                                                "      \"realData\": false,\n" +
                                                "      \"allData\": false,\n" +
                                                "      \"settings\": {\n" +
                                                "        \"chartAttr\": {\n" +
                                                "          \"8df830402161c6f9\": {\n" +
                                                "            \"type\": \"interval\",\n" +
                                                "            \"dimensionId\": \"8df830402161c6f9\",\n" +
                                                "            \"color\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"gradient\": true,\n" +
                                                "              \"overlayEffect\": false,\n" +
                                                "              \"opacity\": -1,\n" +
                                                "              \"type\": \"color\"\n" +
                                                "            },\n" +
                                                "            \"size\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"intervalWidth\": -1,\n" +
                                                "              \"roundRadius\": -1,\n" +
                                                "              \"pointRadius\": -1,\n" +
                                                "              \"heatRadius\": -1,\n" +
                                                "              \"lineWidth\": -1,\n" +
                                                "              \"funnelWidth\": -1,\n" +
                                                "              \"gaugeRadius\": -1,\n" +
                                                "              \"lastSliderPosition\": 0,\n" +
                                                "              \"type\": \"size\"\n" +
                                                "            },\n" +
                                                "            \"label\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"allowOverlap\": false,\n" +
                                                "              \"hasPositionModified\": false,\n" +
                                                "              \"type\": \"label\",\n" +
                                                "              \"valid\": true\n" +
                                                "            },\n" +
                                                "            \"tooltip\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"forecastKey\": \"预测\",\n" +
                                                "              \"shared\": false,\n" +
                                                "              \"type\": \"tooltip\"\n" +
                                                "            },\n" +
                                                "            \"granularity\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"type\": \"granularity\"\n" +
                                                "            },\n" +
                                                "            \"selectedType\": \"auto\"\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"chartStyle\": {\n" +
                                                "          \"legend\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"fontStyle\": {\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"type\": 0,\n" +
                                                "              \"fontFamily\": \"Microsoft YaHei\",\n" +
                                                "              \"fontSize\": 12,\n" +
                                                "              \"fontColor\": \"\",\n" +
                                                "              \"fontBold\": false,\n" +
                                                "              \"bold\": false,\n" +
                                                "              \"italic\": false\n" +
                                                "            },\n" +
                                                "            \"borderColor\": \"transparent\",\n" +
                                                "            \"position\": \"right\"\n" +
                                                "          },\n" +
                                                "          \"axis\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"hGrid\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"vGrid\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"background\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"color\": null,\n" +
                                                "            \"image\": null,\n" +
                                                "            \"mapLayer\": null,\n" +
                                                "            \"type\": null\n" +
                                                "          },\n" +
                                                "          \"adaptive\": {\n" +
                                                "            \"type\": \"standard\"\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"tableStyle\": {\n" +
                                                "          \"form\": 1,\n" +
                                                "          \"style\": 0,\n" +
                                                "          \"themeColor\": null,\n" +
                                                "          \"showTitle\": false,\n" +
                                                "          \"freezeDim\": true,\n" +
                                                "          \"transmitLinkages\": true,\n" +
                                                "          \"expandRowHeader\": false,\n" +
                                                "          \"expandColHeader\": false,\n" +
                                                "          \"showRowSum\": true,\n" +
                                                "          \"showColSum\": true,\n" +
                                                "          \"showSequence\": false,\n" +
                                                "          \"rowHeight\": 25,\n" +
                                                "          \"rowCounts\": 20,\n" +
                                                "          \"colCounts\": 7,\n" +
                                                "          \"totalRows\": 1000,\n" +
                                                "          \"font\": {\n" +
                                                "            \"type\": 1,\n" +
                                                "            \"header\": {\n" +
                                                "              \"fontFamily\": null,\n" +
                                                "              \"fontSize\": null,\n" +
                                                "              \"bold\": null,\n" +
                                                "              \"italic\": null,\n" +
                                                "              \"underline\": null,\n" +
                                                "              \"fontAlign\": null,\n" +
                                                "              \"fontColor\": null\n" +
                                                "            },\n" +
                                                "            \"body\": {\n" +
                                                "              \"fontFamily\": null,\n" +
                                                "              \"fontSize\": null,\n" +
                                                "              \"bold\": null,\n" +
                                                "              \"italic\": null,\n" +
                                                "              \"underline\": null,\n" +
                                                "              \"dimFontAlign\": null,\n" +
                                                "              \"tarFontAlign\": null,\n" +
                                                "              \"fontColor\": null\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"metric\": {\n" +
                                                "            \"show\": true,\n" +
                                                "            \"position\": 3,\n" +
                                                "            \"type\": 1\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"tableAttr\": {\n" +
                                                "          \"equalDivideColumn\": false,\n" +
                                                "          \"color\": {\n" +
                                                "            \"all\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"color\": \"\",\n" +
                                                "              \"conditions\": []\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"shape\": {\n" +
                                                "            \"all\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"shape\": -1,\n" +
                                                "              \"value\": 0\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"filterValue\": {}\n" +
                                                "        },\n" +
                                                "        \"titleBackground\": {\n" +
                                                "          \"type\": \"color\",\n" +
                                                "          \"color\": \"\",\n" +
                                                "          \"imageId\": \"\"\n" +
                                                "        },\n" +
                                                "        \"widgetBackground\": {\n" +
                                                "          \"type\": \"color\",\n" +
                                                "          \"color\": \"\",\n" +
                                                "          \"imageId\": \"\"\n" +
                                                "        },\n" +
                                                "        \"titleHeight\": 25,\n" +
                                                "        \"nameStyleType\": 1,\n" +
                                                "        \"gisBackground\": {\n" +
                                                "          \"show\": true,\n" +
                                                "          \"layer\": null,\n" +
                                                "          \"zoomIn\": \"放大\",\n" +
                                                "          \"zoomOut\": \"缩小\"\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"linkage\": {},\n" +
                                                "      \"clicked\": {\n" +
                                                "        \"dId\": \"8df830402161c6f9\",\n" +
                                                "        \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[603b][91d1][989d]\",\n" +
                                                "        \"value\": [\n" +
                                                "          {\n" +
                                                "            \"dId\": \"d591e0f876b40163\",\n" +
                                                "            \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][4ed8][6b3e][7c7b][578b]\",\n" +
                                                "            \"text\": \"一次性付款\"\n" +
                                                "          }\n" +
                                                "        ]\n" +
                                                "      },\n" +
                                                "      \"jump\": [],\n" +
                                                "      \"openJump\": true,\n" +
                                                "      \"dimensionGroups\": {\n" +
                                                "        \"25d83f46a75f1fb7_数据连接[5f]DEMO[5f]CONTRACT_[603b][91d1][989d]_3_0\": {\n" +
                                                "          \"group\": \"25d83f46a75f1fb7_数据连接[5f]DEMO[5f]CONTRACT_[603b][91d1][989d]_3_0\",\n" +
                                                "          \"dimensionIds\": [\n" +
                                                "            \"8df830402161c6f9\"\n" +
                                                "          ]\n" +
                                                "        },\n" +
                                                "        \"25d83f46a75f1fb7_数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][4ed8][6b3e][7c7b][578b]_11\": {\n" +
                                                "          \"group\": \"25d83f46a75f1fb7_数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][4ed8][6b3e][7c7b][578b]_11\",\n" +
                                                "          \"dimensionIds\": [\n" +
                                                "            \"d591e0f876b40163\"\n" +
                                                "          ]\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"drillOrder\": [],\n" +
                                                "      \"resultFilter\": [],\n" +
                                                "      \"columnSize\": [],\n" +
                                                "      \"regionColumnSize\": [],\n" +
                                                "      \"uploadedImages\": [],\n" +
                                                "      \"measures\": [\n" +
                                                "        {\n" +
                                                "          \"name\": \"总金额\",\n" +
                                                "          \"id\": \"数据连接[5f]DEMO[5f]CONTRACT_[603b][91d1][989d]\",\n" +
                                                "          \"type\": 32,\n" +
                                                "          \"geoType\": 0,\n" +
                                                "          \"transform\": false,\n" +
                                                "          \"copied\": false,\n" +
                                                "          \"drilled\": false,\n" +
                                                "          \"group\": {\n" +
                                                "            \"summary_3\": {\n" +
                                                "              \"cal\": {\n" +
                                                "                \"cal_0\": {\n" +
                                                "                  \"repeatCal\": true,\n" +
                                                "                  \"settings\": {\n" +
                                                "                    \"trendLine\": [],\n" +
                                                "                    \"cordon\": [],\n" +
                                                "                    \"annotate\": [],\n" +
                                                "                    \"size\": 0,\n" +
                                                "                    \"stack\": false,\n" +
                                                "                    \"formatStyle\": 1,\n" +
                                                "                    \"formatDecimal\": -1,\n" +
                                                "                    \"numLevel\": 1,\n" +
                                                "                    \"numSeparators\": true,\n" +
                                                "                    \"unit\": \"\",\n" +
                                                "                    \"flash\": [],\n" +
                                                "                    \"imageData\": []\n" +
                                                "                  },\n" +
                                                "                  \"showMissingTime\": false\n" +
                                                "                }\n" +
                                                "              },\n" +
                                                "              \"repeatCal\": true,\n" +
                                                "              \"showMissingTime\": false\n" +
                                                "            }\n" +
                                                "          }\n" +
                                                "        }\n" +
                                                "      ]\n" +
                                                "    },\n" +
                                                "    \"3b93d256dcd1c030\": {\n" +
                                                "      \"type\": 1,\n" +
                                                "      \"tableName\": \"数据连接_DEMO_CONTRACT\",\n" +
                                                "      \"timeStamp\": 1534939021990,\n" +
                                                "      \"bounds\": {\n" +
                                                "        \"height\": 261,\n" +
                                                "        \"left\": 307.6666666666667,\n" +
                                                "        \"top\": 261,\n" +
                                                "        \"width\": 615.3333333333334\n" +
                                                "      },\n" +
                                                "      \"wId\": \"3b93d256dcd1c030\",\n" +
                                                "      \"name\": \"未命名组件2\",\n" +
                                                "      \"viewAttr\": {\n" +
                                                "        \"10000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"left\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"right\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"size\": 0\n" +
                                                "        },\n" +
                                                "        \"20000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"size\": 0\n" +
                                                "        },\n" +
                                                "        \"30000\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"left\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"right\": {\n" +
                                                "            \"sharedAxis\": null,\n" +
                                                "            \"reversed\": false,\n" +
                                                "            \"log\": false\n" +
                                                "          },\n" +
                                                "          \"size\": 0\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"allowOverlap\": false,\n" +
                                                "      \"dataMining\": {\n" +
                                                "        \"algorithmName\": \"EMPTY\",\n" +
                                                "        \"uuid\": \"\",\n" +
                                                "        \"fields\": []\n" +
                                                "      },\n" +
                                                "      \"showTitle\": true,\n" +
                                                "      \"mobile\": false,\n" +
                                                "      \"view\": {\n" +
                                                "        \"10000\": [\n" +
                                                "          \"935376c5ceebbc35\"\n" +
                                                "        ],\n" +
                                                "        \"20000\": [],\n" +
                                                "        \"30000\": [\n" +
                                                "          \"21fa0c0e04793a37\"\n" +
                                                "        ]\n" +
                                                "      },\n" +
                                                "      \"dimensions\": {\n" +
                                                "        \"935376c5ceebbc35\": {\n" +
                                                "          \"name\": \"注册时间\",\n" +
                                                "          \"type\": 3,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"935376c5ceebbc35\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[6ce8][518c][65f6][95f4]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"group\": {\n" +
                                                "            \"type\": 5\n" +
                                                "          },\n" +
                                                "          \"calculation\": {\n" +
                                                "            \"type\": 0,\n" +
                                                "            \"value\": 0\n" +
                                                "          },\n" +
                                                "          \"settings\": {\n" +
                                                "            \"trendLine\": [],\n" +
                                                "            \"cordon\": [],\n" +
                                                "            \"categoryAxis\": {},\n" +
                                                "            \"valueAxis\": {\n" +
                                                "              \"sharedAxis\": null,\n" +
                                                "              \"reversed\": false,\n" +
                                                "              \"log\": false\n" +
                                                "            },\n" +
                                                "            \"annotate\": [],\n" +
                                                "            \"size\": 0,\n" +
                                                "            \"stack\": false,\n" +
                                                "            \"formatStyle\": 1,\n" +
                                                "            \"formatDecimal\": -1,\n" +
                                                "            \"numLevel\": 1,\n" +
                                                "            \"numSeparators\": true,\n" +
                                                "            \"unit\": \"\",\n" +
                                                "            \"dateFormat\": {},\n" +
                                                "            \"flash\": [],\n" +
                                                "            \"imageData\": []\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"counterDep\": \"TOTAL_ROWS\",\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true,\n" +
                                                "          \"drillDimensions\": {}\n" +
                                                "        },\n" +
                                                "        \"21fa0c0e04793a37\": {\n" +
                                                "          \"name\": \"购买数量\",\n" +
                                                "          \"type\": 2,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"21fa0c0e04793a37\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"group\": {\n" +
                                                "            \"type\": 3\n" +
                                                "          },\n" +
                                                "          \"calculation\": {\n" +
                                                "            \"type\": 0,\n" +
                                                "            \"value\": 0\n" +
                                                "          },\n" +
                                                "          \"settings\": {\n" +
                                                "            \"trendLine\": [],\n" +
                                                "            \"cordon\": [],\n" +
                                                "            \"categoryAxis\": {},\n" +
                                                "            \"valueAxis\": {\n" +
                                                "              \"sharedAxis\": null,\n" +
                                                "              \"reversed\": false,\n" +
                                                "              \"log\": false\n" +
                                                "            },\n" +
                                                "            \"annotate\": [],\n" +
                                                "            \"size\": 0,\n" +
                                                "            \"stack\": false,\n" +
                                                "            \"formatStyle\": 1,\n" +
                                                "            \"formatDecimal\": -1,\n" +
                                                "            \"numLevel\": 1,\n" +
                                                "            \"numSeparators\": true,\n" +
                                                "            \"unit\": \"\",\n" +
                                                "            \"dateFormat\": {},\n" +
                                                "            \"flash\": [],\n" +
                                                "            \"imageData\": []\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"counterDep\": \"TOTAL_ROWS\",\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true,\n" +
                                                "          \"drillDimensions\": {}\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"page\": 0,\n" +
                                                "      \"realData\": false,\n" +
                                                "      \"allData\": false,\n" +
                                                "      \"settings\": {\n" +
                                                "        \"chartAttr\": {\n" +
                                                "          \"graphic\": {\n" +
                                                "            \"type\": \"square\",\n" +
                                                "            \"dimensionId\": \"\",\n" +
                                                "            \"color\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"gradient\": true,\n" +
                                                "              \"overlayEffect\": false,\n" +
                                                "              \"opacity\": -1,\n" +
                                                "              \"type\": \"color\"\n" +
                                                "            },\n" +
                                                "            \"size\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"intervalWidth\": -1,\n" +
                                                "              \"roundRadius\": -1,\n" +
                                                "              \"pointRadius\": -1,\n" +
                                                "              \"heatRadius\": -1,\n" +
                                                "              \"lineWidth\": -1,\n" +
                                                "              \"funnelWidth\": -1,\n" +
                                                "              \"gaugeRadius\": -1,\n" +
                                                "              \"lastSliderPosition\": 0,\n" +
                                                "              \"type\": \"size\"\n" +
                                                "            },\n" +
                                                "            \"label\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"allowOverlap\": false,\n" +
                                                "              \"hasPositionModified\": false,\n" +
                                                "              \"type\": \"label\",\n" +
                                                "              \"valid\": true\n" +
                                                "            },\n" +
                                                "            \"tooltip\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"forecastKey\": \"预测\",\n" +
                                                "              \"shared\": false,\n" +
                                                "              \"type\": \"tooltip\"\n" +
                                                "            },\n" +
                                                "            \"granularity\": {\n" +
                                                "              \"dimensionIds\": [],\n" +
                                                "              \"hasModified\": false,\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"type\": \"granularity\"\n" +
                                                "            },\n" +
                                                "            \"selectedType\": \"auto\"\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"chartStyle\": {\n" +
                                                "          \"legend\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"fontStyle\": {\n" +
                                                "              \"auto\": true,\n" +
                                                "              \"type\": 0,\n" +
                                                "              \"fontFamily\": \"Microsoft YaHei\",\n" +
                                                "              \"fontSize\": 12,\n" +
                                                "              \"fontColor\": \"\",\n" +
                                                "              \"fontBold\": false,\n" +
                                                "              \"bold\": false,\n" +
                                                "              \"italic\": false\n" +
                                                "            },\n" +
                                                "            \"borderColor\": \"transparent\",\n" +
                                                "            \"position\": \"right\"\n" +
                                                "          },\n" +
                                                "          \"axis\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"hGrid\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"vGrid\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"type\": \"solid\",\n" +
                                                "            \"color\": \"\",\n" +
                                                "            \"width\": 1\n" +
                                                "          },\n" +
                                                "          \"background\": {\n" +
                                                "            \"enabled\": true,\n" +
                                                "            \"color\": null,\n" +
                                                "            \"image\": null,\n" +
                                                "            \"mapLayer\": null,\n" +
                                                "            \"type\": null\n" +
                                                "          },\n" +
                                                "          \"adaptive\": {\n" +
                                                "            \"type\": \"standard\"\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"tableStyle\": {\n" +
                                                "          \"form\": 1,\n" +
                                                "          \"style\": 0,\n" +
                                                "          \"themeColor\": null,\n" +
                                                "          \"showTitle\": false,\n" +
                                                "          \"freezeDim\": true,\n" +
                                                "          \"transmitLinkages\": true,\n" +
                                                "          \"expandRowHeader\": false,\n" +
                                                "          \"expandColHeader\": false,\n" +
                                                "          \"showRowSum\": true,\n" +
                                                "          \"showColSum\": true,\n" +
                                                "          \"showSequence\": false,\n" +
                                                "          \"rowHeight\": 25,\n" +
                                                "          \"rowCounts\": 20,\n" +
                                                "          \"colCounts\": 7,\n" +
                                                "          \"totalRows\": 1000,\n" +
                                                "          \"font\": {\n" +
                                                "            \"type\": 1,\n" +
                                                "            \"header\": {\n" +
                                                "              \"fontFamily\": null,\n" +
                                                "              \"fontSize\": null,\n" +
                                                "              \"bold\": null,\n" +
                                                "              \"italic\": null,\n" +
                                                "              \"underline\": null,\n" +
                                                "              \"fontAlign\": null,\n" +
                                                "              \"fontColor\": null\n" +
                                                "            },\n" +
                                                "            \"body\": {\n" +
                                                "              \"fontFamily\": null,\n" +
                                                "              \"fontSize\": null,\n" +
                                                "              \"bold\": null,\n" +
                                                "              \"italic\": null,\n" +
                                                "              \"underline\": null,\n" +
                                                "              \"dimFontAlign\": null,\n" +
                                                "              \"tarFontAlign\": null,\n" +
                                                "              \"fontColor\": null\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"metric\": {\n" +
                                                "            \"show\": true,\n" +
                                                "            \"position\": 3,\n" +
                                                "            \"type\": 1\n" +
                                                "          }\n" +
                                                "        },\n" +
                                                "        \"tableAttr\": {\n" +
                                                "          \"equalDivideColumn\": false,\n" +
                                                "          \"color\": {\n" +
                                                "            \"all\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"color\": \"\",\n" +
                                                "              \"conditions\": []\n" +
                                                "            },\n" +
                                                "            \"21fa0c0e04793a37\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"color\": \"\",\n" +
                                                "              \"conditions\": []\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"shape\": {\n" +
                                                "            \"all\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"shape\": -1,\n" +
                                                "              \"value\": 0\n" +
                                                "            },\n" +
                                                "            \"21fa0c0e04793a37\": {\n" +
                                                "              \"dims\": [],\n" +
                                                "              \"shape\": -1,\n" +
                                                "              \"value\": 0\n" +
                                                "            }\n" +
                                                "          },\n" +
                                                "          \"filterValue\": {}\n" +
                                                "        },\n" +
                                                "        \"titleBackground\": {\n" +
                                                "          \"type\": \"color\",\n" +
                                                "          \"color\": \"\",\n" +
                                                "          \"imageId\": \"\"\n" +
                                                "        },\n" +
                                                "        \"widgetBackground\": {\n" +
                                                "          \"type\": \"color\",\n" +
                                                "          \"color\": \"\",\n" +
                                                "          \"imageId\": \"\"\n" +
                                                "        },\n" +
                                                "        \"titleHeight\": 25,\n" +
                                                "        \"nameStyleType\": 1,\n" +
                                                "        \"gisBackground\": {\n" +
                                                "          \"show\": true,\n" +
                                                "          \"layer\": null,\n" +
                                                "          \"zoomIn\": \"放大\",\n" +
                                                "          \"zoomOut\": \"缩小\"\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"linkage\": {\n" +
                                                "        \"25d83f46a75f1fb7\": {\n" +
                                                "          \"widget\": null,\n" +
                                                "          \"clicked\": null\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"jump\": [],\n" +
                                                "      \"openJump\": true,\n" +
                                                "      \"dimensionGroups\": {\n" +
                                                "        \"3b93d256dcd1c030_数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]_3_0\": {\n" +
                                                "          \"group\": \"3b93d256dcd1c030_数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]_3_0\",\n" +
                                                "          \"dimensionIds\": [\n" +
                                                "            \"21fa0c0e04793a37\"\n" +
                                                "          ]\n" +
                                                "        },\n" +
                                                "        \"3b93d256dcd1c030_数据连接[5f]DEMO[5f]CONTRACT_[6ce8][518c][65f6][95f4]_5\": {\n" +
                                                "          \"group\": \"3b93d256dcd1c030_数据连接[5f]DEMO[5f]CONTRACT_[6ce8][518c][65f6][95f4]_5\",\n" +
                                                "          \"dimensionIds\": [\n" +
                                                "            \"935376c5ceebbc35\"\n" +
                                                "          ]\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"drillOrder\": [],\n" +
                                                "      \"resultFilter\": [],\n" +
                                                "      \"columnSize\": [],\n" +
                                                "      \"regionColumnSize\": [],\n" +
                                                "      \"uploadedImages\": [],\n" +
                                                "      \"measures\": [\n" +
                                                "        {\n" +
                                                "          \"name\": \"购买数量\",\n" +
                                                "          \"id\": \"数据连接[5f]DEMO[5f]CONTRACT_[8d2d][4e70][6570][91cf]\",\n" +
                                                "          \"type\": 32,\n" +
                                                "          \"geoType\": 0,\n" +
                                                "          \"transform\": false,\n" +
                                                "          \"copied\": false,\n" +
                                                "          \"drilled\": false,\n" +
                                                "          \"group\": {\n" +
                                                "            \"summary_3\": {\n" +
                                                "              \"cal\": {\n" +
                                                "                \"cal_0\": {\n" +
                                                "                  \"repeatCal\": true,\n" +
                                                "                  \"settings\": {\n" +
                                                "                    \"trendLine\": [],\n" +
                                                "                    \"cordon\": [],\n" +
                                                "                    \"annotate\": [],\n" +
                                                "                    \"size\": 0,\n" +
                                                "                    \"stack\": false,\n" +
                                                "                    \"formatStyle\": 1,\n" +
                                                "                    \"formatDecimal\": -1,\n" +
                                                "                    \"numLevel\": 1,\n" +
                                                "                    \"numSeparators\": true,\n" +
                                                "                    \"unit\": \"\",\n" +
                                                "                    \"flash\": [],\n" +
                                                "                    \"imageData\": []\n" +
                                                "                  },\n" +
                                                "                  \"showMissingTime\": false\n" +
                                                "                }\n" +
                                                "              },\n" +
                                                "              \"repeatCal\": true,\n" +
                                                "              \"showMissingTime\": false\n" +
                                                "            }\n" +
                                                "          }\n" +
                                                "        }\n" +
                                                "      ]\n" +
                                                "    },\n" +
                                                "    \"a9212df0452c2dee\": {\n" +
                                                "      \"type\": 32,\n" +
                                                "      \"tableName\": \"数据连接_DEMO_CONTRACT\",\n" +
                                                "      \"timeStamp\": 1534939480553,\n" +
                                                "      \"bounds\": {\n" +
                                                "        \"height\": 58,\n" +
                                                "        \"left\": 1076.8333333333333,\n" +
                                                "        \"top\": 261,\n" +
                                                "        \"width\": 615.3333333333334\n" +
                                                "      },\n" +
                                                "      \"wId\": \"a9212df0452c2dee\",\n" +
                                                "      \"name\": \"文本下拉\",\n" +
                                                "      \"allowOverlap\": false,\n" +
                                                "      \"showTitle\": false,\n" +
                                                "      \"mobile\": false,\n" +
                                                "      \"view\": {\n" +
                                                "        \"10000\": [\n" +
                                                "          \"1ef4e2498009c983\"\n" +
                                                "        ]\n" +
                                                "      },\n" +
                                                "      \"dimensions\": {\n" +
                                                "        \"1ef4e2498009c983\": {\n" +
                                                "          \"name\": \"合同付款类型\",\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"notShowNull\": false,\n" +
                                                "          \"id\": \"1ef4e2498009c983\",\n" +
                                                "          \"fieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][4ed8][6b3e][7c7b][578b]\",\n" +
                                                "          \"toCountType\": 0,\n" +
                                                "          \"sort\": {\n" +
                                                "            \"type\": 6,\n" +
                                                "            \"targetFieldId\": \"数据连接[5f]DEMO[5f]CONTRACT_[5408][540c][4ed8][6b3e][7c7b][578b]\"\n" +
                                                "          },\n" +
                                                "          \"showMissingTime\": false,\n" +
                                                "          \"metric\": 0,\n" +
                                                "          \"repeatCal\": true,\n" +
                                                "          \"formatStyle\": 0,\n" +
                                                "          \"formatDecimal\": 0,\n" +
                                                "          \"numLevel\": 0,\n" +
                                                "          \"numSeparators\": false,\n" +
                                                "          \"used\": true\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"page\": 0,\n" +
                                                "      \"realData\": false,\n" +
                                                "      \"allData\": false,\n" +
                                                "      \"openJump\": true,\n" +
                                                "      \"controlRange\": {\n" +
                                                "        \"type\": 1\n" +
                                                "      },\n" +
                                                "      \"useParameter\": false,\n" +
                                                "      \"parameterValue\": [],\n" +
                                                "      \"singleSelect\": 1,\n" +
                                                "      \"sort\": \"ASC\",\n" +
                                                "      \"allowPassDefault\": false,\n" +
                                                "      \"value\": {\n" +
                                                "        \"type\": 1,\n" +
                                                "        \"value\": [\n" +
                                                "          \"一次性付款\"\n" +
                                                "        ],\n" +
                                                "        \"chooseType\": 0,\n" +
                                                "        \"assist\": [\n" +
                                                "          \"分期付款\"\n" +
                                                "        ]\n" +
                                                "      },\n" +
                                                "      \"measures\": []\n" +
                                                "    }\n" +
                                                "  },\n" +
                                                "  \"initTime\": 1534904635542,\n" +
                                                "  \"reportId\": \"518e714656e5492180028838d1633e35\",\n" +
                                                "  \"reportName\": \"新建仪表板\",\n" +
                                                "  \"templateStyle\": {\n" +
                                                "    \"predictionStyles\": [],\n" +
                                                "    \"style\": {\n" +
                                                "      \"id\": null,\n" +
                                                "      \"theme\": null,\n" +
                                                "      \"widgetGap\": null,\n" +
                                                "      \"templateBackground\": {\n" +
                                                "        \"type\": \"color\",\n" +
                                                "        \"color\": \"\",\n" +
                                                "        \"imageId\": \"\"\n" +
                                                "      },\n" +
                                                "      \"widgetBackground\": {\n" +
                                                "        \"type\": \"color\",\n" +
                                                "        \"color\": \"\",\n" +
                                                "        \"imageId\": \"\"\n" +
                                                "      },\n" +
                                                "      \"titleBackground\": {\n" +
                                                "        \"type\": \"color\",\n" +
                                                "        \"color\": \"\",\n" +
                                                "        \"imageId\": \"\"\n" +
                                                "      },\n" +
                                                "      \"titleFont\": {\n" +
                                                "        \"type\": 1,\n" +
                                                "        \"fontFamily\": null,\n" +
                                                "        \"fontSize\": null,\n" +
                                                "        \"bold\": null,\n" +
                                                "        \"italic\": null,\n" +
                                                "        \"underline\": null,\n" +
                                                "        \"fontColor\": \"\",\n" +
                                                "        \"fontAlign\": null\n" +
                                                "      },\n" +
                                                "      \"chart\": {\n" +
                                                "        \"chartStyle\": null,\n" +
                                                "        \"chartColor\": null,\n" +
                                                "        \"font\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"fontFamily\": null,\n" +
                                                "          \"fontSize\": null,\n" +
                                                "          \"bold\": null,\n" +
                                                "          \"italic\": null,\n" +
                                                "          \"underline\": null,\n" +
                                                "          \"fontColor\": \"\"\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"table\": {\n" +
                                                "        \"tableStyle\": null,\n" +
                                                "        \"themeColor\": null,\n" +
                                                "        \"font\": {\n" +
                                                "          \"type\": 1,\n" +
                                                "          \"header\": {\n" +
                                                "            \"fontFamily\": null,\n" +
                                                "            \"fontSize\": null,\n" +
                                                "            \"bold\": null,\n" +
                                                "            \"italic\": null,\n" +
                                                "            \"underline\": null,\n" +
                                                "            \"fontColor\": \"\",\n" +
                                                "            \"fontAlign\": null\n" +
                                                "          },\n" +
                                                "          \"body\": {\n" +
                                                "            \"fontFamily\": null,\n" +
                                                "            \"fontSize\": null,\n" +
                                                "            \"bold\": null,\n" +
                                                "            \"italic\": null,\n" +
                                                "            \"underline\": null,\n" +
                                                "            \"fontColor\": \"\",\n" +
                                                "            \"dimFontAlign\": null,\n" +
                                                "            \"tarFontAlign\": null\n" +
                                                "          }\n" +
                                                "        }\n" +
                                                "      },\n" +
                                                "      \"controlTheme\": \"\"\n" +
                                                "    }\n" +
                                                "  },\n" +
                                                "  \"linkageGroup\": [],\n" +
                                                "  \"createBy\": 0,\n" +
                                                "  \"filter\": null\n" +
                                                "}");
    }
}
