package com.apisimple._apiconkeycloakoaut2bbdd.torneo;

import com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto.AgregarTorneoDTO;
import com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto.ListaTorneosDTO;

import java.util.List;
import java.util.Set;

public interface TorneoService {

    public List<ListaTorneosDTO> getInfoTorneos();

    public List<TorneoEntity> getTorneos();

    public void crearTorneo(AgregarTorneoDTO nuevoTorneo);

}
