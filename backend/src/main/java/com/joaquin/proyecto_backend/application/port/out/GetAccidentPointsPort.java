package com.joaquin.proyecto_backend.application.port.out;

import com.joaquin.proyecto_backend.domain.AccidentPoint;

import java.util.List;

/**
 * Puerto de salida: obtención de puntos de accidentes por provincias.
 * Implementado por el adaptador de persistencia.
 */
public interface GetAccidentPointsPort {

    List<AccidentPoint> findByProvinces(List<String> provinces);
}
