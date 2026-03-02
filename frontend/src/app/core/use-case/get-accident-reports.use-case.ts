import { Injectable, inject } from '@angular/core';
import { GetAccidentReportsPort } from '../port/out/accident.port';
import type { AccidentReport, AccidentReportSearch } from '../domain/accident.model';
import { Observable } from 'rxjs';

/**
 * Caso de uso: buscar accidentes por provincia y rango de fechas (informes).
 * Depende del puerto de salida (adaptador HTTP en runtime).
 */
@Injectable({ providedIn: 'root' })
export class GetAccidentReportsUseCase {
  private readonly port = inject(GetAccidentReportsPort);

  searchReports(params: AccidentReportSearch): Observable<AccidentReport[]> {
    return this.port.searchReports(params);
  }
}
