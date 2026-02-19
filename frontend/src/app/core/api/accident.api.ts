import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccidentDto {
  id: number;
  province: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccidentApi {

  private http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:8080/api/accidents';

  getByProvinces(provinces: string[]): Observable<AccidentDto[]> {
    return this.http.get<AccidentDto[]>(this.baseUrl, {
      params: { provinces }
    });
  }
}
