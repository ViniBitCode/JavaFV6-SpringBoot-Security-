package Ataques;

public abstract class Ataque {

    private int manaConsumida;
    private int puntosDanio;
    private int usosRestantes;
    private String nombreAtaque;

    public Ataque(int manaConsumida, int puntosDanio, int usosRestantes, String nombreAtaque) {
        this.manaConsumida = manaConsumida;
        this.puntosDanio = puntosDanio;
        this.usosRestantes = usosRestantes;
        this.nombreAtaque = nombreAtaque;

    }

    public int getManaConsumida() {
        return manaConsumida;
    }

    public void setManaConsumida(int manaConsumida) {
        this.manaConsumida = manaConsumida;
    }

    public int puntosDanio() {
        return puntosDanio;
    }

    public void setPuntosDanio(int puntosDanio) {
        this.puntosDanio = puntosDanio;
    }

    public String nombreAtaque() {
        return nombreAtaque;
    }

    public void setNombreAtaque(String nombreAtaque) {
        this.nombreAtaque = nombreAtaque;
    }

    public int usosRestantes() {
        return usosRestantes;
    }

    public void setUsosRestantes(int usosRestantes) {
        this.usosRestantes = usosRestantes;
    }

    public abstract void efectoAtaque();

    @Override
    public String toString() {
        return nombreAtaque + " (Danio: " + puntosDanio + " - Mana: " + manaConsumida + " - Usos: " + usosRestantes + ")";
    }
}
