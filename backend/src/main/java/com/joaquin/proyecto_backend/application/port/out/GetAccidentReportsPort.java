package com.joaquin.proyecto_backend.application.port.out;

import com.joaquin.proyecto_backend.domain.AccidentReport;

import java.time.LocalDate;
import java.util.List;

/**
 * Puerto de salida: obtención de accidentes por provincia y rango de fechas.
 * Implementado por el adaptador de persistencia.
 */
public interface GetAccidentReportsPort {

    List<AccidentReport> findByProvinceAndDateRange(String province, LocalDate from, LocalDate to);
}
