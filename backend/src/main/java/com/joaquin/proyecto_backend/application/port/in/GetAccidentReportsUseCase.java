package com.joaquin.proyecto_backend.application.port.in;

import com.joaquin.proyecto_backend.domain.AccidentReport;

import java.time.LocalDate;
import java.util.List;

/**
 * Puerto de entrada (caso de uso): listar accidentes por provincia y rango de fechas.
 */
public interface GetAccidentReportsUseCase {

    List<AccidentReport> getByProvinceAndDateRange(String province, LocalDate from, LocalDate to);
}
