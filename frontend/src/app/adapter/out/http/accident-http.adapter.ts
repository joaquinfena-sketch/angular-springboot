import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { AccidentPoint, AccidentReport, AccidentReportSearch } from '../../../core/domain/accident.model';
import { GetAccidentPointsPort, GetAccidentReportsPort } from '../../../core/port/out/accident.port';

const BASE_URL = 'https://angular-springboot-8fm6.onrender.com/api/accidents';
//const BASE_URL = 'http://localhost:8080/api/accidents';

/**
 * Adaptador de salida: HTTP (backend REST).
 * Implementa los puertos de accidentes.
 */
@Injectable()
export class AccidentHttpAdapter implements GetAccidentPointsPort, GetAccidentReportsPort {
  private readonly http = inject(HttpClient);

  getByProvinces(provinces: string[]): Observable<AccidentPoint[]> {
    return this.http.get<AccidentPoint[]>(BASE_URL, { params: { provinces } });
  }

  searchReports(params: AccidentReportSearch): Observable<AccidentReport[]> {
    return this.http.get<AccidentReport[]>(`${BASE_URL}/report`, {
      params: { province: params.province, from: params.from, to: params.to },
    });
  }
}
