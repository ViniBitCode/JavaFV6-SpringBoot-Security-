package com.apisimple._apiconsecurity.controller.basicos;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Random;

@RestController
public class CalificationsController {

    public static int[] notas = new int[8];

    @GetMapping("/califications")
    public String devolverCalificaciones() {
        Random r = new Random();
        for (int i = 0; i < notas.length; i++) {
            notas[i] = r.nextInt(1, 11);
        }
        
        return Arrays.toString(notas);
    }

    @GetMapping("/califications/average")
    public String promedioCalificaciones() {
        float promedio = (float) Arrays.stream(notas).sum() / notas.length;

        return "El promedio de las notas es: " + promedio;
    }

}




