package com.asa.j2v8.demo;

import com.eclipsesource.v8.V8;

/**
 * @author andrew_asa
 * @date 2018/8/16.
 */
public class HelloJ2V8 {

    public static void main(String[] args) {

        V8 runtime = V8.createV8Runtime();
        int result = runtime.executeIntegerScript(""
                                                          + "var hello = 'hello, ';\n"
                                                          + "var world = 'world!';\n"
                                                          + "hello.concat(world).length;\n");
        System.out.println(result);
        runtime.release();
    }

}
