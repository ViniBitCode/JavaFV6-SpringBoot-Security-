import jdk.swing.interop.SwingInterOpUtils;

import java.util.Random;
import java.util.Scanner;

public class Main {

    static Scanner s = new Scanner(System.in);
    static int dinero = 100;
    static final int PRECIO_ASIENTO = 50;

    static char[][] asientos = new char[6][20];

    private record Posicion(int fila, int columna) { }

    public static void main(String[] args) {
        inicializarAsientos();
        boolean flag = true;

        while (flag) {
            int opc = elegirOpciones();
            switch (opc) {
                case 1 -> verAsientosOcupados();
                case 2 -> ocuparAsiento();
                case 3 -> liberarAsiento();
                case 4 -> verInformacion();
                case 5 -> recargarDinero();
                case 6 -> comprarComida();
                default -> flag = false;
            }
        }
    }

    private static void inicializarAsientos() {
        Random r = new Random();
        for (int filas = 0; filas < asientos.length; filas++) {
            for (int columnas = 0; columnas < asientos[filas].length; columnas++) {
                boolean asientoOcupado = r.nextBoolean();
                asientos[filas][columnas] = asientoOcupado ? 'X' : ' ';

            }
        }
    }

    private static int elegirOpciones() {
        System.out.println(" ==================== BIENVENIDO AL PAPUA CINE ==================== ");
        System.out.println("1) Ver todos los asientos ocupados");
        System.out.println("2) comprar ticket y ocupar asiento");
        System.out.println("3) abandonar la funcion y liberar el asiento");
        System.out.println("4) Ver que asientos compre y mi dinero actual");
        System.out.println("5) meter platita de quien sabe donde");
        System.out.println("6) Comprar comida para el cine");
        System.out.print("Otro Numero hara que se termine el programa: ");
        return s.nextInt();

    }

    private static void verAsientosOcupados() {
        System.out.print(" ==================== DISTRIBUCION DE LOS ASIENTOS ==================== ");
        for (int filas = 0; filas < asientos.length; filas++) {
            System.out.println();
            for (int columnas = 0; columnas < asientos[filas].length; columnas++) {
                System.out.print("[" + asientos[filas][columnas] + "]");
            }
        }
        System.out.println("\n");
    }

    private static void ocuparAsiento() {
        Posicion posicion = leerPosicion("ocupar");
        System.out.println(intentarOcupar(posicion.fila(), posicion.columna()) + "\n");
    }

    private static String intentarOcupar(int fila, int columna) {
        if (!verificarAsientoExistente(fila, columna)) {
            return "El asiento no existe.";
        }

        if (asientos[fila][columna] == 'X') {
            return "El asiento ya se encuentra ocupado.";
        }
        if (dinero < PRECIO_ASIENTO) {
            return "No hay suficiente dinero para comprar el asiento.";
        }
        dinero -= PRECIO_ASIENTO;
        asientos[columna][fila] = 'X';
        return "El asiento [" + columna + "][" + fila + "] se ha ocupado";
    }

    private static boolean verificarAsientoExistente(int fila, int columna) {
        return (fila < asientos.length && fila >= 0 && columna < asientos[fila].length && columna >= 0);
    }

    private static void liberarAsiento() {
        Posicion posicion = leerPosicion("liberar");
        System.out.println(intentarLiberar(posicion.fila(), posicion.columna()) + "\n");
    }

    private static Posicion leerPosicion(String accion) {
        int fila = 0, columna = 0;
        System.out.print("Ingrese fila del asiento a " + accion + ": ");
        fila = s.nextInt() - 1;
        System.out.print("Ingrese Columna del asiento a " + accion + ": ");
        columna = s.nextInt() - 1;
        return new Posicion(fila, columna);
    }

    private static String intentarLiberar(int fila, int columna) {
        if (!verificarAsientoExistente(fila, columna)) {
            return "El asiento no existe.";
        }

        if (asientos[fila][columna] == ' ') {
            return "El asiento ya se encuentra desocupado.";
        }

        dinero += PRECIO_ASIENTO;
        asientos[columna][fila] = ' ';
        return "El asiento [" + columna + "][" + fila + "] se ha desocupado y se sumaron " + PRECIO_ASIENTO + " pesimios";
    }

    private static void verInformacion() {
        System.out.println("La plata que tenes: " + dinero);
        System.out.println("Cantidad de asientos ocupados: " + cantAsientosOcupados());

    }

    private static int cantAsientosOcupados() {
        int cantAsientosOcupados = 0;
        for (char[] fila : asientos) {
            for (char asiento : fila) {
                if(asiento == 'X') cantAsientosOcupados++;
            }
        }
        return cantAsientosOcupados;
    }


    private static void recargarDinero() {
        System.out.println("Chiteaste y sumaste 100 pesimios. ");
        dinero += 100;
    }

    private static void comprarComida() {
        System.out.println("Compraste unas burgas bien chuddys.");
        dinero -= 10;

    }


}