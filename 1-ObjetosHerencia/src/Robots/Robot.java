package Robots;

import Ataques.Ataque;

import java.util.Arrays;

public abstract class Robot {

    private int vida;
    private int mana;
    private Ataque[] ataques = new Ataque[4];
    private String nombre;

    public Robot(int vida, Ataque[] ataques, int mana, String nombre) {
        this.vida = vida;
        this.ataques = ataques;
        this.mana = mana;
        this.nombre = nombre;
    }

    public int vida() {
        return vida;
    }

    public void setVida(int vida) {
        this.vida = vida;
    }

    public Ataque[] ataques() {
        return ataques;
    }

    public void setAtaques(Ataque[] ataques) {
        this.ataques = ataques;
    }

    public int mana() {
        return mana;
    }

    public void setMana(int mana) {
        this.mana = mana;
    }

    public String nombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return "Robot " + nombre + " (vida: " + vida + ", mana: " + mana + ")";
    }
}
