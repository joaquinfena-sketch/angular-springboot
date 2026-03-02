package com.joaquin.proyecto_backend.application.port.in;

import com.joaquin.proyecto_backend.domain.AccidentPoint;

import java.util.List;

/**
 * Puerto de entrada (caso de uso): listar puntos de accidentes por provincias.
 */
public interface GetAccidentPointsUseCase {

    List<AccidentPoint> getByProvinces(List<String> provinces);
}
