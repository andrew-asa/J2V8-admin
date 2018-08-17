package com.asa.j2v8.canvas;

import javafx.scene.text.Font;
import javafx.scene.text.FontPosture;
import javafx.scene.text.FontWeight;


public class FontUtils {
    public static Font parseFont(String f) {
        // todo css 字体的weight和style和JavaFX不一定一致,比如weight包含bolder
        System.out.println("font = " + f);
        String[] info = f.split(" ");
        if (info.length == 4) {
            //完整信息
            String style = info[0];
            String weight = info[1];
            Double size = parseSize(info[2]);
            String family = info[3];
            FontPosture posture = FontPosture.findByName(style);
            if (posture == null) {
                posture = FontPosture.REGULAR;
            }
            return Font.font(family,parseWeight(weight),posture,size);
        } else if (info.length == 2) {
            //只包含size/family
            Double size = parseSize(info[0]);
            String family = info[1];
            return Font.font(family,size);
        } else if (info.length == 3) {
            System.out.println("未知 font = " + f);
            //todo 可能缺少style 或weight,先认为是weight
            String weight = info[0];
            Double size = parseSize(info[1]);
            String family = info[2];
            return Font.font(family,parseWeight(weight),size);
        }
        return null;
    }

    private static FontWeight parseWeight(String weight) {
        if ("bolder".equals(weight)) {
            return FontWeight.EXTRA_BOLD;
        }
        return FontWeight.findByName(weight);
    }
    private static Double parseSize(String size) {
        return Double.valueOf(size.replace("px",""));
    }
}
