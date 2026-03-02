import { Observable } from 'rxjs';
import type { AccidentPoint, AccidentReport, AccidentReportSearch } from '../../domain/accident.model';

/**
 * Puerto de salida: obtención de puntos de accidentes (mapa).
 * El adaptador HTTP implementa este contrato.
 */
export abstract class GetAccidentPointsPort {
  abstract getByProvinces(provinces: string[]): Observable<AccidentPoint[]>;
}

/**
 * Puerto de salida: búsqueda de accidentes para informes.
 * El adaptador HTTP implementa este contrato.
 */
export abstract class GetAccidentReportsPort {
  abstract searchReports(params: AccidentReportSearch): Observable<AccidentReport[]>;
}
