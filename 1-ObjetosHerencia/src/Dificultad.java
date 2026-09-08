public enum Dificultad {

    FACIL(200, 200),
    MEDIO(100, 100),
    DIFICIL(50, 50);

    private final int vidaAliado;
    private final int manaAliado;

    Dificultad(int vidaAliado, int manaAliado) {
        this.vidaAliado = vidaAliado;
        this.manaAliado = manaAliado;
    }

    public int vidaAliado() {
        return vidaAliado;
    }

    public int manaAliado() {
        return manaAliado;
    }
}
