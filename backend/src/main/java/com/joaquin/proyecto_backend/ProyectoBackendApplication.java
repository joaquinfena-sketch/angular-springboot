package com.joaquin.proyecto_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration;

/**
 * Sin Hibernate: el mapa usa datos aleatorios (RandomAccidentPointsAdapter).
 * Si en el futuro usas BD real, quita el exclude y configura el perfil.
 */
@SpringBootApplication(exclude = HibernateJpaAutoConfiguration.class)
public class ProyectoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoBackendApplication.class, args);
    }
}
