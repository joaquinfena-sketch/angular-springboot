package com.joaquin.proyecto_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration;

@SpringBootApplication

public class ProyectoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoBackendApplication.class, args);
    }
}
