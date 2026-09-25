package com.apisimple._apiconkeycloakoaut2bbdd.torneo;

import com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto.AgregarTorneoDTO;
import com.apisimple._apiconkeycloakoaut2bbdd.torneo.dto.ListaTorneosDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("torneos")
public class TorneoController {

    @Autowired
    private TorneoServiceImp torneoServiceImp;

    @GetMapping()
    public ResponseEntity<List<ListaTorneosDTO>> listaTorneos(){
        List<ListaTorneosDTO> listaTorneos = torneoServiceImp.getInfoTorneos();
        return ResponseEntity.ok(listaTorneos);
    }

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> crearTorneo(@RequestBody AgregarTorneoDTO nuevoTorneo){
        torneoServiceImp.crearTorneo(nuevoTorneo);
        return ResponseEntity.ok("Se creo el torneo");
    }


}
