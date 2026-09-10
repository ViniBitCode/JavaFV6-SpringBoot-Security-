package com.apisimple._backendsimple.service;

import com.apisimple._backendsimple.model.Mascota;
import com.apisimple._backendsimple.repository.IMascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MascotaService implements IMascotaService {

    @Autowired
    private IMascotaRepository mascotaRepo;

    @Override
    public List<Mascota> getMascotas() {

        return mascotaRepo.findAll();

    }

    @Override
    public Mascota getMascota(Long id) {
        return mascotaRepo.findById(id).orElse(null);
    }

    @Override
    public void createMascota(Mascota mascota) {
        mascotaRepo.save(mascota);
    }


    @Override
    public void deleteMascota(Long id) {
        mascotaRepo.deleteById(id);
    }

    @Override
    public void editMascota(Long id, String raza) {
        Mascota m = this.getMascota(id);
        m.setRaza(raza);
        this.createMascota(m);
    }
}
