package com.joaquin.proyecto_backend.adapter.in.web.dto;

/**
 * DTO de salida para punto de accidente (API REST).
 * name: localidad o nombre del punto.
 */
public record AccidentPointDto(
        long id,
        String province,
        double lat,
        double lng,
        String name
) {}
