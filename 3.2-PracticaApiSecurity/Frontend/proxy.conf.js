/**
 * Proxy del dev server de Angular.
 *
 * Problema que resuelve: el front corre en un puerto y el backend en otro.
 * Para el navegador son dos orígenes distintos, así que bloquearía las
 * peticiones por CORS salvo que Spring las autorice explícitamente.
 * Con este proxy el navegador le habla SIEMPRE a localhost:4300 (mismo
 * origen) y es el dev server, desde Node, quien reenvía al backend.
 * Node no aplica CORS -> el problema desaparece en desarrollo.
 *
 * Flujo:
 *   navegador  ->  GET http://localhost:4300/api/rol/verlos
 *   dev server ->  GET http://localhost:8080/rol/verlos      (pathRewrite saca /api)
 */

// Puerto donde levanta Spring Boot.
// OJO: hoy tu application.properties NO define server.port, así que Spring
// arranca en 8080. Si de verdad lo pasás a 4200 (agregando server.port=4200),
// cambiá este valor; el dev server de Angular ya lo moví al 4300 para que no
// choquen los dos en el mismo puerto.
const BACKEND = 'http://localhost:8080';

module.exports = {
  '/api': {
    target: BACKEND,
    // Reescribe el prefijo: /api/rol/verlos -> /rol/verlos
    pathRewrite: { '^/api': '' },
    // Manda el header Host del backend en vez del de Angular.
    changeOrigin: true,
    // Poné true si alguna vez el backend usa https con certificado propio.
    secure: false,
    // Loguea en la consola de `ng serve` cada petición proxeada. Muy útil
    // para ver si el request salió y con qué status volvió.
    logLevel: 'debug',
  },
};
