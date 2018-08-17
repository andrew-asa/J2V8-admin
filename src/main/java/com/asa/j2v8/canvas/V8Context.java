package com.asa.j2v8.canvas;

import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.JavaVoidCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;
import com.eclipsesource.v8.V8Value;
import javafx.geometry.Bounds;
import javafx.geometry.VPos;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.effect.BlendMode;
import javafx.scene.effect.Effect;
import javafx.scene.image.Image;
import javafx.scene.paint.Color;
import javafx.scene.paint.CycleMethod;
import javafx.scene.paint.LinearGradient;
import javafx.scene.paint.Paint;
import javafx.scene.paint.Stop;
import javafx.scene.shape.ArcType;
import javafx.scene.shape.FillRule;
import javafx.scene.shape.StrokeLineCap;
import javafx.scene.shape.StrokeLineJoin;
import javafx.scene.text.Font;
import javafx.scene.text.FontSmoothingType;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import javafx.scene.transform.Affine;

import java.util.ArrayList;
import java.util.List;


public class V8Context extends V8Object {
    private GraphicsContext ctx;

    public V8Context(V8 v8, GraphicsContext cxt) {
        super(v8);
        this.ctx = cxt;
        initPrototype();
        //绑定context所有公开方法
        initSelfMethod();
        //绑定适配js context方法
        initAdapterMethod();
    }

    private void initPrototype() {
        V8Object proto = v8.executeObjectScript("var ContextPrototype = {" +
                "createLinearGradient: function (x,y,x2,y2) {" +
                "           return new echarts.graphic.LinearGradient(x,y,x2,y2);" +
                "       }," +
                "createRadialGradient: function (x,y,r,x2,y2,r2) {" +
                "           return new echarts.graphic.RadialGradient(x, y, r);" +
                "       }," +
                "_lineWidth : '',\n" +
                "set lineWidth(v) {\n" +
                "    _lineWidth = v;\n" +
                "    this.setLineWidth(v);\n" +
                "},\n" +
                "get lineWidth() {\n" +
                "    return _lineWidth;\n" +
                "    //return this.getLineWidth();\n" +
                "},\n" +
                "_lineCap : '',\n" +
                "set lineCap(v) {\n" +
                "    _lineCap = v;\n" +
                "    this.setLineCap(v);\n" +
                "},\n" +
                "get lineCap() {\n" +
                "    return _lineCap;\n" +
                "    //return this.getLineCap();\n" +
                "},\n" +
                "_lineJoin : '',\n" +
                "set lineJoin(v) {\n" +
                "    _lineJoin = v;\n" +
                "    this.setLineJoin(v);\n" +
                "},\n" +
                "get lineJoin() {\n" +
                "    return _lineJoin;\n" +
                "    //return this.getLineJoin();\n" +
                "},\n" +
                "_fillStyle : '',\n" +
                "set fillStyle(v) {\n" +
                "    _fillStyle = v;\n" +
                "    this.setFillStyle(v);\n" +
                "},\n" +
                "get fillStyle() {\n" +
                "    return _fillStyle;\n" +
                "    //return this.getFillStyle();\n" +
                "},\n" +
                "_strokeStyle : '',\n" +
                "set strokeStyle(v) {\n" +
                "    _strokeStyle = v;\n" +
                "    this.setStrokeStyle(v);\n" +
                "},\n" +
                "get strokeStyle() {\n" +
                "    return _strokeStyle;\n" +
                "    //return this.getStrokeStyle();\n" +
                "},\n" +
                "_textAlign : '',\n" +
                "set textAlign(v) {\n" +
                "    _textAlign = v;\n" +
                "    this.setTextAlign(v);\n" +
                "},\n" +
                "get textAlign() {\n" +
                "    return _textAlign;\n" +
                "    //return this.getTextAlign();\n" +
                "},\n" +
                "_textBaseline : '',\n" +
                "set textBaseline(v) {\n" +
                "    _textBaseline = v;\n" +
                "    this.setTextBaseline(v);\n" +
                "},\n" +
                "get textBaseline() {\n" +
                "    return _textBaseline;\n" +
                "    //return this.getTextBaseline();\n" +
                "},\n" +
                "_font : '',\n" +
                "set font(v) {\n" +
                "    _font = v;\n" +
                "    this.setFont(v);\n" +
                "},\n" +
                "get font() {\n" +
                "    return _font;\n" +
                "    //return this.getFont();\n" +
                "}" +
                "};" +
                "ContextPrototype;");
        setPrototype(proto);
        proto.release();
    }

    private void initSelfMethod() {
        registerJavaMethod(ctx, "save", "save", new Class[]{});
        registerJavaMethod(ctx, "fill", "fill", new Class[]{});
        registerJavaMethod(ctx, "rotate", "rotate", new Class[]{double.class});
        registerJavaMethod(ctx, "scale", "scale", new Class[]{double.class, double.class});
        registerJavaMethod(ctx, "getCanvas", "getCanvas", new Class[]{});
        registerJavaMethod(ctx, "restore", "restore", new Class[]{});
        registerJavaMethod(ctx, "translate", "translate", new Class[]{double.class, double.class});
        registerJavaMethod(ctx, "setTransform", "setTransform", new Class[]{Affine.class});
        registerJavaMethod(ctx, "setTransform", "setTransform", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "getTransform", "getTransform", new Class[]{Affine.class});
        registerJavaMethod(ctx, "getTransform", "getTransform", new Class[]{});
        registerJavaMethod(ctx, "setGlobalAlpha", "setGlobalAlpha", new Class[]{double.class});
        registerJavaMethod(ctx, "getGlobalAlpha", "getGlobalAlpha", new Class[]{});
        registerJavaMethod(ctx, "setGlobalBlendMode", "setGlobalBlendMode", new Class[]{BlendMode.class});
        registerJavaMethod(ctx, "getGlobalBlendMode", "getGlobalBlendMode", new Class[]{});
        registerJavaMethod(ctx, "setFill", "setFill", new Class[]{Paint.class});
        registerJavaMethod(ctx, "getFill", "getFill", new Class[]{});
        registerJavaMethod(ctx, "setStroke", "setStroke", new Class[]{Paint.class});
        registerJavaMethod(ctx, "getStroke", "getStroke", new Class[]{});
        registerJavaMethod(ctx, "setLineWidth", "setLineWidth", new Class[]{double.class});
        registerJavaMethod(ctx, "getLineWidth", "getLineWidth", new Class[]{});
        registerJavaMethod(ctx, "setLineCap", "setLineCap", new Class[]{StrokeLineCap.class});
        registerJavaMethod(ctx, "getLineCap", "getLineCap", new Class[]{});
        registerJavaMethod(ctx, "setLineJoin", "setLineJoin", new Class[]{StrokeLineJoin.class});
        registerJavaMethod(ctx, "getLineJoin", "getLineJoin", new Class[]{});
        registerJavaMethod(ctx, "setMiterLimit", "setMiterLimit", new Class[]{double.class});
        registerJavaMethod(ctx, "getMiterLimit", "getMiterLimit", new Class[]{});
        registerJavaMethod(ctx, "setLineDashes", "setLineDashes", new Class[]{double[].class});
        registerJavaMethod(ctx, "getLineDashes", "getLineDashes", new Class[]{});
        registerJavaMethod(ctx, "setLineDashOffset", "setLineDashOffset", new Class[]{double.class});
        registerJavaMethod(ctx, "getLineDashOffset", "getLineDashOffset", new Class[]{});
        registerJavaMethod(ctx, "setFont", "setFont", new Class[]{Font.class});
        registerJavaMethod(ctx, "getFont", "getFont", new Class[]{});
        registerJavaMethod(ctx, "setFontSmoothingType", "setFontSmoothingType", new Class[]{FontSmoothingType.class});
        registerJavaMethod(ctx, "getFontSmoothingType", "getFontSmoothingType", new Class[]{});
        registerJavaMethod(ctx, "setTextAlign", "setTextAlign", new Class[]{TextAlignment.class});
        registerJavaMethod(ctx, "getTextAlign", "getTextAlign", new Class[]{});
        registerJavaMethod(ctx, "setTextBaseline", "setTextBaseline", new Class[]{VPos.class});
        registerJavaMethod(ctx, "getTextBaseline", "getTextBaseline", new Class[]{});
        registerJavaMethod(ctx, "fillText", "fillText", new Class[]{String.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "fillText", "fillText", new Class[]{String.class, double.class, double.class});
        registerJavaMethod(ctx, "strokeText", "strokeText", new Class[]{String.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "strokeText", "strokeText", new Class[]{String.class, double.class, double.class});
        registerJavaMethod(ctx, "setFillRule", "setFillRule", new Class[]{FillRule.class});
        registerJavaMethod(ctx, "getFillRule", "getFillRule", new Class[]{});
        registerJavaMethod(ctx, "beginPath", "beginPath", new Class[]{});
        registerJavaMethod(ctx, "moveTo", "moveTo", new Class[]{double.class, double.class});
        registerJavaMethod(ctx, "lineTo", "lineTo", new Class[]{double.class, double.class});
        registerJavaMethod(ctx, "quadraticCurveTo", "quadraticCurveTo", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "bezierCurveTo", "bezierCurveTo", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "arcTo", "arcTo", new Class[]{double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "arc", "arc", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "rect", "rect", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "appendSVGPath", "appendSVGPath", new Class[]{String.class});
        registerJavaMethod(ctx, "closePath", "closePath", new Class[]{});
        registerJavaMethod(ctx, "stroke", "stroke", new Class[]{});
        registerJavaMethod(ctx, "clip", "clip", new Class[]{});
        registerJavaMethod(ctx, "isPointInPath", "isPointInPath", new Class[]{double.class, double.class});
        registerJavaMethod(ctx, "clearRect", "clearRect", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "fillRect", "fillRect", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "strokeRect", "strokeRect", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "fillOval", "fillOval", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "strokeOval", "strokeOval", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "fillArc", "fillArc", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class, ArcType.class});
        registerJavaMethod(ctx, "strokeArc", "strokeArc", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class, ArcType.class});
        registerJavaMethod(ctx, "fillRoundRect", "fillRoundRect", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "strokeRoundRect", "strokeRoundRect", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "strokeLine", "strokeLine", new Class[]{double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "fillPolygon", "fillPolygon", new Class[]{double[].class, double[].class, int.class});
        registerJavaMethod(ctx, "strokePolygon", "strokePolygon", new Class[]{double[].class, double[].class, int.class});
        registerJavaMethod(ctx, "strokePolyline", "strokePolyline", new Class[]{double[].class, double[].class, int.class});
        registerJavaMethod(ctx, "drawImage", "drawImage", new Class[]{Image.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "drawImage", "drawImage", new Class[]{Image.class, double.class, double.class, double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "drawImage", "drawImage", new Class[]{Image.class, double.class, double.class});
        registerJavaMethod(ctx, "getPixelWriter", "getPixelWriter", new Class[]{});
        registerJavaMethod(ctx, "setEffect", "setEffect", new Class[]{Effect.class});
        registerJavaMethod(ctx, "getEffect", "getEffect", new Class[]{Effect.class});
        registerJavaMethod(ctx, "applyEffect", "applyEffect", new Class[]{Effect.class});
        registerJavaMethod(ctx, "transform", "transform", new Class[]{double.class, double.class, double.class, double.class, double.class, double.class});
        registerJavaMethod(ctx, "transform", "transform", new Class[]{Affine.class});
    }

    private void initAdapterMethod() {
        registerJavaMethod(new JavaCallback() {
            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {
//                String font = receiver.getString("font");
                V8Object dimen = new V8Object(v8);
                String str = parameters.getString(0);
                final Text text = new Text(str);
                text.setFont(ctx.getFont());

                Bounds bounds = text.getLayoutBounds();
                dimen.add("width", bounds.getWidth());
                dimen.add("height", bounds.getHeight());
                return dimen;
            }
        }, "measureText");

        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
//                if (parameters.length() == 6) {
                double cx = parameters.getDouble(0);
                double cy = parameters.getDouble(1);
                double r = parameters.getDouble(2);
                double startAngle = parameters.getDouble(3);
                double endAngle = parameters.getDouble(4);
                //可能是undefined或不传,都认为false
                boolean anticlockwise = false;//true 逆时针 false 顺时针
                if (parameters.length() > 5) {
                    int type = parameters.getType(5);
                    if (type == V8Value.BOOLEAN) {
                        anticlockwise = parameters.getBoolean(5);
                    }
                }

                //transform to javafx format, javax都是逆时针,角度制,h5圆角是弧度制
                startAngle = (360 - Math.toDegrees(startAngle)) % 360;
                endAngle = (360 - Math.toDegrees(endAngle)) % 360;


                double length;
                if (anticlockwise) {
                    length = (360 - startAngle + endAngle) % 360;
                } else {
                    length = (endAngle - startAngle - 360) % 360;
                }
                if (length == 0) {
                    length = 360;
                }
                System.out.println("arc cx=" + cx + " cy=" + cy + " r=" + r
                        + " startAngle=" + startAngle + " endAngle=" + endAngle + " length=" + length
                        + " anticlockwise=" + anticlockwise);
                ctx.arc(cx, cy, r, r, startAngle, length);
            }
        }, "arc");

        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                ctx.setFont(FontUtils.parseFont(parameters.getString(0)));
            }
        }, "setFont");

        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                String lineCap = parameters.getString(0);
                System.out.println("setLineCap " + lineCap);
                if ("butt".equalsIgnoreCase(lineCap)) {
                    ctx.setLineCap(StrokeLineCap.BUTT);
                } else if ("square".equals(lineCap)) {
                    ctx.setLineCap(StrokeLineCap.SQUARE);
                } else if ("round".equals(lineCap)) {
                    ctx.setLineCap(StrokeLineCap.ROUND);
                }

            }
        }, "setLineCap");

        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                try {
                    int type = parameters.getType(0);
                    if (type == V8Value.STRING) {
                        //颜色
                        String fillStyle = parameters.getString(0);
                        System.out.println("setFillStyle " + fillStyle);
                        if (fillStyle == null || "none".equals(fillStyle)) {
                            ctx.setFill(Color.BLACK);
                            return;
                        }
                        ctx.setFill(Color.web(fillStyle));
                    } else if (type == V8Value.V8_OBJECT) {
                        V8Object gradientObj = parameters.getObject(0);
                        //todo 渐变色,好像没有效果
                        if ("linear".equals(gradientObj.getString("type"))) {
                            double x = gradientObj.getInteger("x");
                            double y = gradientObj.getInteger("y");
                            double x2 = gradientObj.getInteger("x2");
                            double y2 = gradientObj.getInteger("y2");
                            V8Array colorStops = gradientObj.getArray("colorStops");
                            List<Stop> list = new ArrayList<>();
                            for (int i = 0; i < colorStops.length(); i++) {
                                V8Object colorStop = colorStops.getObject(i);
                                String color = colorStop.getString("color");
                                int offset = colorStop.getInteger("offset");
                                list.add(new Stop(offset, Color.web(color)));
//                                System.out.println("stop offset " + offset + " color " + color);
                                colorStop.release();
                            }
                            colorStops.release();
                            LinearGradient gradient = new LinearGradient(x, y, x2, y2, true, CycleMethod.NO_CYCLE, list);
                            ctx.setFill(gradient);
                            System.out.println("setFillStyle LinearGradient x=" + x + " y=" + y + " x2= " + x2 + " y2=" + y2);
                        } else {
                            System.out.println("unknown fillStyle");
                        }
                        gradientObj.release();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        }, "setFillStyle");

        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                String strokeStyle = parameters.getString(0);
                System.out.println("setStrokeStyle " + strokeStyle);
                if (strokeStyle == null || "none".equals(strokeStyle)) {
                    ctx.setStroke(Color.BLACK);
                    return;
                }
                try {
                    ctx.setStroke(Color.web(strokeStyle));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, "setStrokeStyle");
        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                String lineJoin = parameters.getString(0);
                System.out.println("setLineJoin " + lineJoin);
                if ("miter".equals(lineJoin)) {
                    ctx.setLineJoin(StrokeLineJoin.MITER);
                } else if ("bevel".equals(lineJoin)) {
                    ctx.setLineJoin(StrokeLineJoin.BEVEL);
                } else if ("round".equals(lineJoin)) {
                    ctx.setLineJoin(StrokeLineJoin.ROUND);
                }
            }
        }, "setLineJoin");
        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                String textAlign = parameters.getString(0);
                System.out.println("setTextAlign " + textAlign);
                switch (textAlign) {
                    case "center":
                        ctx.setTextAlign(TextAlignment.CENTER);
                        break;
                    case "right":
                        ctx.setTextAlign(TextAlignment.RIGHT);
                        break;
                    case "justify":
                        ctx.setTextAlign(TextAlignment.JUSTIFY);
                        break;
                    default:
                        ctx.setTextAlign(TextAlignment.LEFT);

                }
            }
        }, "setTextAlign");
        registerJavaMethod(new JavaVoidCallback() {
            @Override
            public void invoke(V8Object receiver, V8Array parameters) {
                String textBaseline = parameters.getString(0);
                System.out.println("setTextBaseline " + textBaseline);
                switch (textBaseline) {
                    case "middle":
                        ctx.setTextBaseline(VPos.CENTER);
                        break;
                }
            }
        }, "setTextBaseline");
    }
}
