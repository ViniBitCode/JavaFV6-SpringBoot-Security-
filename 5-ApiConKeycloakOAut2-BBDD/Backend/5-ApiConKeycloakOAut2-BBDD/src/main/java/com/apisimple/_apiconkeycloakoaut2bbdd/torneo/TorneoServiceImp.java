package com.apisimple._apiconkeycloakoaut2bbdd.torneo;

import com.apisimple._apiconkeycloakoaut2bbdd.shared.exceptions.EntidadYaExistenteException;
import com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto.AgregarTorneoDTO;
import com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto.ListaTorneosDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TorneoServiceImp implements TorneoService {

    @Autowired
    private TorneoRepository torneoRepository;


    @Override
    public List<ListaTorneosDTO> getInfoTorneos() {

        List<TorneoEntity> listaTorneos = this.getTorneos();

        List<ListaTorneosDTO> infoTorneos = new ArrayList<>();

        for (TorneoEntity torneo : listaTorneos) {
            infoTorneos.add(new ListaTorneosDTO(
                    torneo.getNombreTorneo(),
                    torneo.getFechaComienzo(),
                    torneo.getFechaFinalizacion(),
                    torneo.getPremioGanador(),
                    torneo.getEquiposInscriptos().size()));
        }

        return infoTorneos;
    }

    @Override
    public List<TorneoEntity> getTorneos() {
        return torneoRepository.findAll();
    }

    @Override
    public void crearTorneo(AgregarTorneoDTO nuevoTorneoDTO) {

        String nombreNuevoTorneo = nuevoTorneoDTO.nombreTorneo();

        if (torneoRepository.existsByNombreTorneo(nombreNuevoTorneo)) {
            throw new EntidadYaExistenteException("Torneo", nombreNuevoTorneo);
        }

        TorneoEntity nuevoTorneo = new TorneoEntity();
        nuevoTorneo.setNombreTorneo(nombreNuevoTorneo);
        nuevoTorneo.setPremioGanador(nuevoTorneoDTO.premioGanador());
        nuevoTorneo.setPartidos(null);
        nuevoTorneo.setEquiposInscriptos(null);
        nuevoTorneo.setFechaComienzo(nuevoTorneoDTO.fechaComienzo());
        nuevoTorneo.setFechaFinalizacion(nuevoTorneoDTO.fechaFinalizacion());
        torneoRepository.save(nuevoTorneo);

    }
}
