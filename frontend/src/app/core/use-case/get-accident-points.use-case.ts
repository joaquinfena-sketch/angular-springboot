import { Injectable, inject } from '@angular/core';
import { GetAccidentPointsPort } from '../port/out/accident.port';
import type { AccidentPoint } from '../domain/accident.model';
import { Observable } from 'rxjs';

/**
 * Caso de uso: obtener puntos de accidentes por provincias.
 * Depende del puerto de salida (adaptador HTTP en runtime).
 */
@Injectable({ providedIn: 'root' })
export class GetAccidentPointsUseCase {
  private readonly port = inject(GetAccidentPointsPort);

  getByProvinces(provinces: string[]): Observable<AccidentPoint[]> {
    return this.port.getByProvinces(provinces);
  }
}
