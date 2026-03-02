/**
 * Modelos de dominio: accidentes.
 * Sin dependencias de HTTP o UI; reflejan el núcleo del negocio.
 */

export interface AccidentPoint {
  id: number;
  province: string;
  lat: number;
  lng: number;
  name: string; // localidad (ej. "Níjar", "Carboneras")
}

export interface AccidentReport {
  id: number;
  province: string;
  lat: number;
  lng: number;
  date: string; // YYYY-MM-DD
}

export interface AccidentReportSearch {
  province: string;
  from: string;
  to: string;
}
