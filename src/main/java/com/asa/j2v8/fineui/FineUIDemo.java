package com.asa.j2v8.fineui;

import com.eclipsesource.v8.JavaCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;
import javafx.application.Application;
import javafx.embed.swing.SwingFXUtils;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.SnapshotParameters;
import javafx.scene.canvas.Canvas;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TextArea;
import javafx.scene.image.WritableImage;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Text;
import javafx.stage.Stage;

import javax.imageio.ImageIO;
import java.io.File;

/**
 * @author andrew_asa
 * @date 2018/10/23.
 */
public class FineUIDemo extends Application {

    private FineUICanvasRuntime fineui;

    public static void main(String[] args) {

        Application.launch(FineUIDemo.class, args);
    }

    @Override
    public void start(Stage stage) throws Exception {

        stage.setTitle("Hello World!");
        FlowPane root = new FlowPane();
        Canvas canvas = new Canvas(800.0, 500.0);
        fineui = new FineUICanvasRuntime(canvas);
        //fineui.initCanvas(canvas);

        Button snapshotBtn = new Button("截图");
        snapshotBtn.setOnAction(new EventHandler<ActionEvent>() {

            @Override
            public void handle(ActionEvent event) {

                System.out.println("截图");
                WritableImage image = root.snapshot(new SnapshotParameters(), null);
                try {
                    File file = new File("out.png");
                    System.out.println("导出到图片 " + file.getAbsolutePath());
                    ImageIO.write(SwingFXUtils.fromFXImage(image, null), "png", file);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        Text msg = new Text("耗时");

        TextArea input = new TextArea();
        input.resize(800, 100);
        Button runBtn = new Button("运行");
        runBtn.setOnAction(new EventHandler<ActionEvent>() {

            @Override
            public void handle(ActionEvent event) {

                System.out.println("运行");
                try {
                    long begin = System.currentTimeMillis();
                    fineui.createWidget(input.getText());
                    msg.setText("运行耗时 " + (System.currentTimeMillis() - begin));
                } catch (Exception e) {
                    e.printStackTrace();
                    Alert alert = new Alert(Alert.AlertType.INFORMATION);
                    alert.setTitle("运行错误");
                    alert.setContentText(e.getLocalizedMessage());
                    alert.show();
                }
            }
        });

        root.getChildren().addAll(input, runBtn, snapshotBtn, msg);
        root.getChildren().add(canvas);
        stage.setScene(new Scene(root, 800.0, 700.0));
        stage.show();


        V8 v8 = fineui.getV8();
        v8.executeVoidScript("var app = {\n" +
                                     "                set title(t) {\n" +
                                     "                   setFxAppTitle(t);\n" +
                                     "                }\n" +
                                     "            }");

        v8.registerJavaMethod(new JavaCallback() {

            @Override
            public Object invoke(V8Object receiver, V8Array parameters) {

                String title = parameters.getString(0);
                stage.setTitle(title);
                return null;
            }
        }, "setFxAppTitle");

    }

    @Override
    public void stop() throws Exception {

        super.stop();
        System.out.println("clear v8");
    }
}
