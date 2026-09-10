package com.apisimple._backendsimple.service;

import com.apisimple._backendsimple.model.Mascota;
import org.springframework.stereotype.Service;

import java.util.List;

public interface IMascotaService {

    public List<Mascota> getMascotas();

    public Mascota getMascota(Long id);

    public void createMascota(Mascota mascota);

    public void deleteMascota(Long id);

    public void editMascota(Long id, String raza);


}
