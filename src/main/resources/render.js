var window = {canvas: Canvas, Canvas: Canvas};
echarts.setCanvasCreator(function () {
    return new Canvas(32, 32)
});
var LinearGradient = echarts.graphic.LinearGradient;
var RadialGradient = echarts.graphic.RadialGradient;

var myChart;
var option;

function initChart(canvas) {
    // 指定图表的配置项和数据
    // defineCanvasProperties(canvas)
    myChart = echarts.init(canvas);
}

function reloadChart() {
    myChart.clear();
    myChart.setOption(option)
}
