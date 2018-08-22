BICst = BICst || {};
BICst.CURSOR = "-webkit-grabbing";

BICst.TABLE_THEME_COLOR = "#04b1c2";
// tab切换 empty-content
BICst.TAB = {
    EMPTY: 1,
    CONTENT: 2
};

BICst.REQUEST_STATUS = {
    LOADING: 0,
    SUCCESS: 1,
    FAIL: 2,
    WARNING: 3
};

BICst.PREVIEW_TABLE_STATUS = {
    LOADING: 0,
    TABLE: 1,
    ERROR: 2
};

BICst.AGG_FUNC = ["SUM_AGG", "AVG_AGG", "MEDIAN_AGG", "MAX_AGG", "MIN_AGG", "STDEV_AGG", "VAR_AGG", "COUNT_AGG", "COUNTD_AGG"];

BICst.SELECT_DATA_SEGMENT = {
    SECTION_ALL: 0x1,
    SECTION_PACKAGE: 0x10,
    SECTION_FIELD: 0x100,
    SECTION_TABLE: 0x1000
};

BICst.BACKGROUND_TYPE = {
    COLOR: "color",
    IMAGE: "image",
    MAP: "map"
};

BICst.STRING_CONTROL = {
    SINGLE: 0,
    MULTI: 1,
    TEXT: 2,
    NO_BAR: 3
};

BICst.THEME_NAME = {
    DEFAULT: "DEFAULT",
    DARK: "DARK",
    STYLE1: "STYLE1",
    STYLE2: "STYLE2",
    STYLE3: "STYLE3",
    STYLE4: "STYLE4"
};

BICst.WIDGET_GAP = {
    GAP: 1,
    NO_GAP: 2
};

BICst.CHART_STYLE = {
    NORMAL: 1,
    GRADIENT: 2
};

BICst.TABLE_STYLE = {
    STYLE1: 1,
    STYLE2: 2,
    STYLE3: 3
};

BICst.LIST_LABEL_TYPE = {
    ALL: "_*_"
};

BICst.WIDGET_OPERATOR = {
    DELETE: "DELETE",
    DETAIL: "DETAIL",
    ASC: "ASC",
    DES: "DES",
    CLEAR: "CLEAR",
    RENAME: "RENAME",
    COPY: "COPY",
    ALLOW_OVERLAP: "ALLOW_OVERLAP",
    DEFAULT_CONTROL: "DEFAULT_CONTROL",
    CUSTOMIZE_CONTROL: "CUSTOMIZE_CONTROL",
    PASS_DEFAULT: "PASS_DEFAULT",
    FROM: "FROM",
    DESC: "DESC",
    CUSTOM_SORT: "CUSTOM_SORT",
    FILTER: "FILTER"
};

BICst.DIMENSION_COMBO = {
    ASCEND: 1,
    DESCEND: 2,
    CUSTOM_SORT: 3,
    DELETE: 4,
    STRING_SAME_VALUE_GROUP: 5,
    STRING_CUSTOM_GROUP: 6,
    NUMBER_SAME_VALUE_GROUP: 7,
    NUMBER_CUSTOM_GROUP_TYPE: {
        AUTO: 8,
        CUSTOM: 9
    },
    NUMBER_CUSTOM_GROUP: 10,
    DATE: {
        YMD: 11,
        YW: 12,
        YM: 13,
        YQ: 14,
        YEAR: 15,
        QUARTER: 16,
        MORE: 17,
        MONTH: 18,
        WEEK: 19,
        WEEKDAY: 20,
        DAY: 21,
        HOUR: 22,
        MINUTE: 23,
        SECOND: 24,
        YMDH: 25,
        YMDHM: 26,
        YMDHMS: 27
    },
    FILTER: 28,
    DETAIL_FILTER: 29,
    NUMBER_FORMAT: 30,
    DATE_FORMAT: 31,
    DATE_FORMAT_SPLIT: 32,
    DATE_FORMAT_CHINESE: 33,
    COPY: 34,
    SHOW_MISSING_TIME: 35,
    CATEGORY_AXIS_SETTING: 37,
    SUMMARY_TYPE: 38,
    RAPID_CALCULATION: 39,
    TARGET_FILTER: 40,
    SPECIAL_DISPLAY: 41,
    ANALYSIS_HELPER_SETTING: 42,
    VALUE_AXIS_SETTING: 43,
    TURN_ON_ACCUMULATION: 44,
    REPEAT_CAL: 45,
    COUNTER_DEPENDENCE: 46,
    DRILL_ORDER: 47,
    EDIT_CLUSTER: 48,
    SET_NAME: 49
};

BICst.DETAIL_DIMENSION_COMBO = {
    FILER: 1,
    DATE: {
        YMD: 11,
        YW: 12,
        YM: 13,
        YQ: 14,
        YEAR: 15,
        QUARTER: 16,
        MORE: 17,
        MONTH: 18,
        WEEK: 19,
        WEEKDAY: 20,
        DAY: 21,
        HOUR: 22,
        MINUTE: 23,
        SECOND: 24,
        YMDH: 25,
        YMDHM: 26,
        YMDHMS: 27
    },
    DELETE: 2
};

BICst.DETAIL_CALC_TARGET_COMBO = {};

BICst.REUSE_PANE = {
    WIDGET: 2,
    TEMPLATE: 1,
    FOLDER: 0
};

BICst.ADMIN_USER_ID = "-999";

BICst.ALL_VALUE = {
    NOT_IN_GROUP: 99,
    IN_GROUP: 100
};

BICst.SHOW_TIME = {
    SHOW: 1,
    NOT_SHOW: 2
};

BICst.DEFAULT_CHART_COLOR = ["#b25657", "#e18169", "#f1c15f", "#f4ab98", "#c82d31", "#fa706d"];

BICst.WORDS = {
    ENTIRE: "entire",
    GRAPHIC: "graphic",
    MULTI: "multi",
    AUTO: "auto",
    FACET: "facet",
    H_MEASURES_OVERLAPPED: "hMeasureOverlapped",
    V_MEASURES_OVERLAPPED: "vMeasureOverlapped",
    MEASURES_TO_GEOMS: "measuresToGeoms",

    H_CUSTOM_UNIT: "hCustomUnit",
    V_CUSTOM_UNIT: "vCustomUnit",
    H_UNIT: "hUnit",
    V_UNIT: "vUnit",

    H_CUSTOM_SIZE: "hCustomSize",
    V_CUSTOM_SIZE: "vCustomSize",
    H_SIZE: "hSize",
    V_SIZE: "vSize",

    HEAT: "heat",

    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    RIGHT: "right",

    WORLD: "world",

    SEMI_SELECTED: "semiSelected",

    UN_SELECTED: "unSelected",

    AREA_SUFFIX: "-area.json",
    POINT_SUFFIX: "-point.json"
};

BICst.PREFIX = {
    TIME_START: "_start",
    TIME_END: "_end"
};

BICst.FONT_FAMILY_COMBO = [{
    text: BI.i18nText("BI-Basic_Microsoft_YaHei"),
    value: "Microsoft YaHei"
}, {
    text: BI.i18nText("BI-Basic_Sim_Hei"),
    value: "SimHei"
}, {
    text: BI.i18nText("BI-Basic_You_Yuan"),
    value: "YouYuan"
}, {
    text: BI.i18nText("BI-Basic_Sim_Sun"),
    value: "SimSun"
}, {
    text: BI.i18nText("BI-Basic_Kai_Ti"),
    value: "KaiTi"
}, {
    text: BI.i18nText("BI-Basic_ST_Xihei"),
    value: "STXihei"
}, {
    text: BI.i18nText("BI-Basic_ST_Heiti"),
    value: "STHeiti"
}, {
    text: BI.i18nText("BI-Basic_ST_Kaiti"),
    value: "STKaiti"
}, {
    text: BI.i18nText("BI-Basic_ST_Song"),
    value: "STSong"
}, {
    text: BI.i18nText("BI-Basic_Hiragino_Sans_GB_W3"),
    value: "Hiragino Sans GB W3"
}, {
    text: "Arial",
    value: "Arial"
}, {
    text: "Microsoft Tai Le",
    value: "Microsoft Tai Le"
}, {
    text: "Tahoma",
    value: "Tahoma"
}, {
    text: "Helvetica",
    value: "Helvetica"
}, {
    text: "Verdana",
    value: "Verdana"
}, {
    text: "Times New Roman",
    value: "Times New Roman"
}];

BICst.TABLE_STYLE = {
    STYLE1: 1,      // 普通风格
    STYLE2: 2,        // 蓝色表头的
    STYLE3: 3     // 内容间隔色
};

BICst.IMAGE_SIZE = {
    ORIGINAL: "ORIGINAL",
    EQUAL: "EQUAL",
    WIDGET_SIZE: "WIDGET_SIZE"
};

BICst.TABLE_CHART_SETTING = {
    ATTRIBUTE: 1,
    STYLE: 2
};

BICst.TABLE_AGG_METHOD_SHOW = {
    ROW: 1,
    COLUMN: 2,
    ROW_COLUMN: 3
};

BICst.AUTO_CUSTOM = {
    AUTO: 1,
    CUSTOM: 2
};

BICst.TABLE_TYPE = {
    MULTI_COLUMN: 1,
    TREE: 2
};

BICst.FONT_STYLE = {
    BOLD: 1,
    ITALIC: 2,
    UNDERLINE: 3
};

BICst.FONT_ALIGN = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3
};

BICst.FORMULA_WIDGET_FIELD_TYPE = -1;

BICst.EXPAND_TYPE = {
    CELL: 1,
    HEADER: 2,
    CROSS_CELL: 3,
    CROSS_HEADER: 4
};

BICst.FIELD_COMBO = {
    COPY: 1,
    DELETE: 2,
    RENAME: 3,
    FILTER: 4
};

BICst.TABLE_STYLE_EXPANDER = {
    TABLE_FONT: "tableFont",
    TITLE: "title",
    TITLE_BACKGROUND: "titleBackground",
    WIDGET_BACKGROUND: "widgetBackground",
    DETAIL_ATTR: "detailAttr",
    DETAIL_FORMAT: "detailFormat",
    DETAIL_TABLE_STYLE: "detailTableStyle",
    GROUP_ATTR: "groupAttr",
    GROUP_FORMAT: "groupFormat",
    METRIC: "metric",
    GROUP_STYLE: "groupStyle"
};

BICst.DRILL_ORDER = {
    FIXED: "fixed",
    UNFIXED: "unfixed"
};


BICst.CHART_ATTR_NAMES = {
    COLOR: "color",
    HEAT_COLOR: "heatColor",
    SIZE: "size",
    SYMBOL: "symbol",
    LABEL: "label",
    TOOLTIP: "tooltip",
    GRANULARITY: "granularity",
    LINE_CONNECTION: "lineConnect",
    PIE_RADIUS: "pieRadius",
    PIE_ANGLE: "pieAngle",
    TEXT: "text",
    GAUGE_POINTER: "gaugePointNumber",
    GAUGE_MAX_VALUE: "gaugeMaxValue"
};

BICst.MIN_GRADIENT_NUM = 2;

BICst.UNDO_STEP = 10;

// tooltip、label、text的富文本的类型
BICst.CHART_RICH_TEXT = {
    DEFAULT: "default",     // 未做改动
    MODIFIED: "modified",   // 已被用户修改
    MULTI_CONTENT: "multiContent",   // “多个内容”
    SAME_CONTENT: "sameContent"     // 多个指标的内容都相同
};

// 存放在富文本中参数中的一些key
BICst.RICH_TEXT_INFO = {
    DATA_ID: "data-id",
    DATA_NAME: "data-name",
    DATA_FULL_NAME: "data-full-name",
    DATA_ORIGIN_ID: "data-origin-id",
    DATA_ORIGIN_NAME: "data-origin-name",
    DATA_ORIGIN_FULL_NAME: "data-origin-full-name",
    DATA_IS_INSERT_PARAM: "data-is-insert-param",
    DATA_IS_MISSING_FIELD: "data-is-missing-field",
    ALT: "alt",
    SRC: "src"
};

BICst.GIS_MAP_TYPE = {
    // fixme: 暂时先用null来代替
    AUTO: null
};

BICst.DIMENSION_STATE = {
    NORMAL: 0,
    FIELD_MISS: 1,
    FIELD_TYPE_ERROR: 2,
    AGG_IN_DETAIL: 3,
    GROUP_TYPE_ERROR: 4
};

BICst.FORMULA_STATE = {
    VALID: "valid",
    INVALID: "invalid",
    AGG_INVALID: "aggInvalid",
    FIELD_MISS: "field_miss",
    NOT_SUPPORT_STRING_OR_DATE: "no_string_or_date",
    DETAIL_FILTER_NOT_SUPPORT: "detail filter not support"
};

BICst.FIELD_STATE = {
    NORMAL: 0,
    FIELD_MISS: 1,
    FIELD_TYPE_ERROR: 2,
    // 明细表聚合计算指标
    AGG_IN_DETAIL: 3,
    WRONG_FORMULA: 4,
    NO_AUTH: 5
};

BICst.ROOT_FOLDER = -1;

BICst.MAX_SHOWN_SIZE = 1000;

BICst.COOKIE = {
    PATH: "/",
    TOKEN: "fine_auth_token"
};

BICst.DEC_ERROR_CODE = {
    JWT_EXPIRED: "21300018"
};

BICst.ENTRY_TYPE = {
    EDIT: 0,
    VIEW: 1,
    SHARE: 2,
    JUMP: 3,
    MOUNT: 4,
    HOME: 5,
    SHARE_TO_ME: 6
};

BICst.HISTORY_HASH = {
    OPEN_DETAIL: "open_detail"
};

BICst.DEFAULT_CHART_COLOR_LIST = [{
    text: "默认",
    value: "默认",
    colors: [
        "#ffbf53",
        "#04b1c2",
        "#f07474",
        "#c55784",
        "#9a5fb3",
        "#cf62d7",
        "#5e78ea",
        "#51b3f0",
        "#69d4dc",
        "#49b788",
        "#9ccc66",
        "#ffdb03",
        "#c18c00",
        "#363636",
        "#426fb3",
        "#66bf7f",
        "#f9cd76",
        "#392884",
        "#00ae71",
        "#93aad6",
        "#490761",
        "#faf14b",
        "#955305",
        "#016241",
        "#7388c1",
        "#8f1e20",
        "#f9cd76",
        "#d69b01",
        "#b7b7b7",
        "#511f90",
        "#99d0b9",
        "#c7c300"
    ]
}];

BICst.REGULAR_STRING = {
    HTML_STYLE_TAG: "<font[\\s\\S]*?>|</font>|<span[\\s\\S]*?>|</span>|<b[\\s\\S]*?>|</b>|<u[\\s\\S]*?>|</u>|<i\\s+(.*?)>|<i>|</i>|<div[\\s\\S]*?>|</div>|<p[\\s\\S]*?>|</p>|<strong[\\s\\S]*?>|</strong>|<em[\\s\\S]*?>|</em>|<br>",
    HTML_ONLY_STYLE_TAG: "<font[\\s\\S]*?>|</font>|<span[\\s\\S]*?>|</span>|<b\\s+(.*?)>|<b>|</b>|<u[\\s\\S]*?>|</u>|<i\\s+(.*?)>|<i>|</i>|<strong[\\s\\S]*?>|</strong>|<em[\\s\\S]*?>|</em>|<div[\\s\\S]style(.*?)>|</div>|<p[\\s\\S]style(.*?)>|</p>",
    PLACE_HOLDER: "\\$[\\{][^\\}]*[\\}]",
    IMAGE: "<img.*?[^!]>"
};


BICst.TEMPLATE_BACKGROUND = ["template/background_style3.png", "template/background_style6.png"];
