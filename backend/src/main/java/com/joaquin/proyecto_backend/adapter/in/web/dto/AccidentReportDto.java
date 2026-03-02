package com.joaquin.proyecto_backend.adapter.in.web.dto;

import java.time.LocalDate;

/**
 * DTO de salida para accidente con fecha (API REST).
 */
public record AccidentReportDto(
        long id,
        String province,
        double lat,
        double lng,
        LocalDate date
) {}
