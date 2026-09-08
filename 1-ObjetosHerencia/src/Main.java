import Ataques.*;
import Robots.Aliado;
import Robots.Enemigo;
import Robots.Robot;

import java.util.Random;
import java.util.Scanner;

public class Main {

    static Robot miRobot, enemigoRobot;
    static Scanner s = new Scanner(System.in);
    static Random r = new Random();

    public static void main(String[] args) {
        System.out.println("=========================== BATALLA DE ROBOTS ===========================");
        Dificultad dificultad = dificultadBatalla();
        iniciarPersonajes(dificultad);
        iniciarBatalla();

    }

    private static Dificultad dificultadBatalla() {
        while (true) {
            int opc = elegirOpcion();
            switch (opc) {
                case 1:
                    return Dificultad.FACIL;
                case 2:
                    return Dificultad.MEDIO;
                case 3:
                    return Dificultad.DIFICIL;
                default:
                    System.out.println("Lastimosamente vas a tener que elegir una dificultad...");
            }
        }

    }

    private static int elegirOpcion() {
        System.out.println("1) Facil");
        System.out.println("2) Medio");
        System.out.println("3) Dificil");
        System.out.print("Primero elija la dificultad: ");
        return s.nextInt();

    }

    private static void iniciarPersonajes(Dificultad dificultad) {
        final Ataque[] ataques = {new Esquivar(), new Golpe(), new Patada(), new UltraGolpe()};
        miRobot = new Aliado(dificultad.vidaAliado(), ataques, dificultad.manaAliado());
        enemigoRobot = new Enemigo(ataques);
    }

    private static void iniciarBatalla() {
        System.out.println("=========================== COMIENZA LA BATALLA ===========================");
        boolean empiezaAliado = r.nextBoolean();
        if (empiezaAliado) {
            arrancaAliado();
        } else {
            arrancaEnemigo();
        }

    }


    private static void arrancaAliado() {
        boolean ambosVivos = true;
        while (ambosVivos) {
            atacaAliado();
            if (enemigoRobot.vida() <= 0) {
                System.out.println("=========================== GANO EL ALIADO! ===========================");
                ambosVivos = false;
            } else {
                atacaEnemigo();
                if (miRobot.vida() <= 0) {
                    System.out.println("=========================== GANO EL ENEMIGO! ===========================");
                    ambosVivos = false;
                }
            }
        }
    }

    private static void arrancaEnemigo() {
        boolean ambosVivos = true;
        while (ambosVivos) {
            atacaEnemigo();
            if (miRobot.vida() <= 0) {
                System.out.println("=========================== GANO EL ENEMIGO! ===========================");
                ambosVivos = false;
            } else {
                atacaAliado();
                if (enemigoRobot.vida() <= 0) {
                    System.out.println("=========================== GANO EL ALIADO! ===========================");
                    ambosVivos = false;
                }
            }
        }


    }

    private static void atacaAliado() {
        System.out.println("Es turno de: " + miRobot.toString());
        Ataque ataqueAliado = elegirAtaque(miRobot, false);
        atacarRival(enemigoRobot, ataqueAliado);
    }

    private static void atacaEnemigo() {
        System.out.println("Es turno de: " + enemigoRobot.toString());
        Ataque ataqueEnemigo = elegirAtaque(enemigoRobot, true);
        atacarRival(miRobot, ataqueEnemigo);
    }


    private static void atacarRival(Robot robotAtacado, Ataque ataque) {
        int vidaActual = robotAtacado.vida();
        robotAtacado.setVida(vidaActual -= ataque.puntosDanio());
        System.out.println("El robot [" + robotAtacado.nombre() + "] perdio [" + ataque.puntosDanio() + "] - Vida actual: " + robotAtacado.vida() + "\n");

    }

    private static Ataque elegirAtaque(Robot robot, boolean esBot) {

        int opc;
        for (int i = 0; i < robot.ataques().length; i++) {
            System.out.println("[" + (i + 1) + "]: " + robot.ataques()[i].toString());
        }
        if (esBot) {
            opc = r.nextInt(1, 5);
        } else {
            System.out.print("Selecciona el ataque: ");
            opc = s.nextInt();
        }

        Ataque ataqueElegido = robot.ataques()[opc - 1];
        System.out.println("El robot [" + robot.nombre() + "] eligio el ataque: " + ataqueElegido.nombreAtaque());

        int usosActualesAtaque = ataqueElegido.usosRestantes();
        ataqueElegido.setUsosRestantes(usosActualesAtaque--);

        int manaActual = robot.mana();
        robot.setMana(manaActual -= ataqueElegido.getManaConsumida());

        return ataqueElegido;
    }
}