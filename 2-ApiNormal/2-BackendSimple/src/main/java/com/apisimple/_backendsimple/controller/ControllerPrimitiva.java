package com.apisimple._backendsimple.controller;

import com.apisimple._backendsimple.model.Mascota;
import com.apisimple._backendsimple.model.Persona;
import com.apisimple._backendsimple.dto.PersonaMascotaDTO;
import com.apisimple._backendsimple.service.IPersonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ControllerPrimitiva {

    /* Ejemplo con @PathVariable. Tengo que especificar los atributos si o si.
    . Ejemplo de la URL: http://localhost:8080/hello/yoda
    */

    @GetMapping({"hello_ejemplo", "/hello_ejemplo/", "/hello_ejemplo/{nombre}"})
    public String sayHello(@PathVariable(required = false) String nombre) {
        return "hola " + (nombre == null ? "Ningun nombre" : nombre);
    }

    /* Ejemplo con @RequestParam. Los atributos los mando mediante la URL.
    . Ejemplo de la URL: http://localhost:8080/ciao?nombre=yo&edad=21
    */
    @GetMapping("/ciao_ejemplo")
    public String sayBye(@RequestParam int edad, @RequestParam String nombre) {
        return "Chau " + nombre + " - Edad: " + edad;
    }

    /* Ejemplo con @RequestBody y metodo HTTP Post. Los atributos los mando Postman.
     */
    @PostMapping("/ejemplo")
    public void crearPersona(@RequestBody Persona persona) {
        System.out.println("Persona creada");
        System.out.println("Nombre " + persona.getNombre());
        System.out.println("Apellido " + persona.getApellido());
    }

    /* Ejemplo con @ResponseBody y metodo HTTP Get. Recibo los atributos en forma de JSON.

    @GetMapping("/ejemplo/traerlos")
    @ResponseBody
    public List<Persona> obtenerClientes() {

        List<Persona> listaPersonas = new ArrayList<Persona>();

        listaPersonas.add(new Persona(1L, "Nombre1", "apellido1"));
        listaPersonas.add(new Persona(2L, "Nombre2", "apellido2"));
        listaPersonas.add(new Persona(3L, "Nombre3", "apellido3"));

        return listaPersonas;

    } */


    /* Ejemplo con ResponseEntity para manipular la response del back. Se puede manipular todo el response,
    no solo el mensaje.
     */
    @GetMapping("/response_ejemplo")
    ResponseEntity<String> devolverResponsePersonalizado() {
        return new ResponseEntity<>("Este es un responde personalizado", HttpStatus.ACCEPTED);
    }

    /* Ejemplo con DTOs para poder mostrar datos de diferentes objetos en uno solo.
        . Para este ejemplo, debemos simular que el id_duenio del path variable busca en una BBDD
        el id del duenio y trae la mascota que tiene.

    @GetMapping("/mascota_ejemplo/{id_duenio}")
    @ResponseBody
    public PersonaMascotaDTO obtenerMascotas(@PathVariable long id_duenio) {

        Persona persona = new Persona(1L, "duenio", "apellido");
        Mascota mascota = new Mascota(1L, "raza");

        PersonaMascotaDTO duenioMascota = new PersonaMascotaDTO();

        duenioMascota.setApellido(persona.getApellido());
        duenioMascota.setNombre(persona.getNombre());
        duenioMascota.setRaza(mascota.getRaza());

        return duenioMascota;

    } */
}
