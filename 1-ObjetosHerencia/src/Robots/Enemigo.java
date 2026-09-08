package Robots;

import Ataques.Ataque;

public class Enemigo extends Robot {
    public Enemigo(Ataque[] ataques) {
        super(100, ataques, 100, "Enemigo");
    }
}
