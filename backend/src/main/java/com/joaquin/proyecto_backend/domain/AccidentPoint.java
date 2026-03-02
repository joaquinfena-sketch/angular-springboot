package com.joaquin.proyecto_backend.domain;

/**
 * Modelo de dominio: punto de accidente (para mapa).
 * name: localidad o nombre del punto (ej. "Níjar", "Carboneras").
 */
public record AccidentPoint(
        long id,
        String province,
        double lat,
        double lng,
        String name
) {}
