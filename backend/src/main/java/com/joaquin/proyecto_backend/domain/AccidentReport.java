package com.joaquin.proyecto_backend.domain;

import java.time.LocalDate;

/**
 * Modelo de dominio: accidente con fecha (para informes).
 * Sin dependencias de frameworks.
 */
public record AccidentReport(
        long id,
        String province,
        double lat,
        double lng,
        LocalDate date
) {}
