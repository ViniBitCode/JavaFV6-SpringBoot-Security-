package com.apisimple._apiconsecurity.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    /* Aplicacion seguridad sobre endpoints */
    @Bean // Esta annotation nos indica que la funcion va a laburar como si fuera un "bean/objeto" de Spring
    // Esta funcion provee la seguridad de mis endpoints
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) {
        return httpSecurity
                // Desabilita la configuracion CSRF para poderusar un front independiente
                .csrf(csrf -> csrf.disable())
                // Establece configuraciones basicas de HTTP
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build(); // Finaliza la construccion de los filtros




                /* Esta es una manera manual de poner permisos, pero se cambia a una manera mas amigable haciendo uso de Annotations.
                    // Le indico que mis sesiones van a ser Stateless y no stateful
                    .authorizeHttpRequests(http -> {
                        // Configuracion para mis Endpoints
                        http.requestMatchers(HttpMethod.GET, "/holaNoSeg").permitAll();
                        http.requestMatchers(HttpMethod.GET, "/holaSeg").hasAuthority("READ");
                        http.anyRequest().denyAll();
                    })
                */


                /* estas funciones fueron ejemplos sin haber hecho uso de los roles y permisos.
                .requestMatchers("/holaNoSeg").permitAll()  // Se puede entrar sin necesidad de autenticar
                .anyRequest().authenticated()               // Cualquier otra solicitud pide que se deba autenticar previamente
                .formLogin(form -> form.permitAll()) // Todos pueden hacer el login
                */
    }


    /* Aplicacion de Usuarios, Roles, y Permisos */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean // Este modelo es para el proveedor de autentiacion mas basico. No se recomienda poner en Null las variables.
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean // En el momento, no se va a codificar la contrasenia, por el momento se deja la pass en texto plano.
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    /*
    @Bean // Aca vamos definiendo los usuarios, simulando desde una BBDD
    public UserDetailsService userDetailsService() {
        List<UserDetails> userDetailList = new ArrayList<>();

        userDetailList.add(User.withUsername("facuvini")
                .password("papu1234")
                .roles("ADMIN")
                // Esta funcion se puede descartar y en authorities poner: ("ROLE_ADMIN", "CREATE", "READ", "UPDATE", "DELETE")
                .authorities("CREATE", "READ", "UPDATE", "DELETE") // Los permisos pueden ser cualquiera que yo invente tmb
                .build());

        userDetailList.add(User.withUsername("prueba1") // El username siempre debe ser distinto
                .password("papu1")
                .roles("USER")
                .authorities("CREATE")
                .build());

        userDetailList.add(User.withUsername("prueba2")
                .password("papu2")
                .roles("USER")
                .authorities("READ")
                .build());

        return new InMemoryUserDetailsManager(userDetailList);
    }
    */

}
