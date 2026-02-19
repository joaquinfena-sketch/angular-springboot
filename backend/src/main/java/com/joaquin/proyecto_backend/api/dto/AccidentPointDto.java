package com.joaquin.proyecto_backend.api.dto;

public record AccidentPointDto(
        long id,
        String province,
        double lat,
        double lng
) {}
