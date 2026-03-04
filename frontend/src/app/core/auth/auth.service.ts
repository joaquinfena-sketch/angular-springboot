import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';

const TOKEN_KEY = 'auth.token';
const API_AUTH = 'https://angular-springboot-8fm6.onrender.com/api/auth';
//const API_AUTH = 'http://localhost:8080/api/auth';

export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(this.getStoredToken());

  readonly token = this._token.asReadonly();
  readonly loggedIn = computed(() => !!this._token());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${API_AUTH}/login`, { username, password })
      .pipe(
        tap((res) => {
          this.setToken(res.token);
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.setToken(null);
  }

  /** Para el interceptor: devuelve el token actual si existe. */
  getToken(): string | null {
    return this._token();
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  private setToken(value: string | null): void {
    this._token.set(value);
    if (value != null) {
      sessionStorage.setItem(TOKEN_KEY, value);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }
}
