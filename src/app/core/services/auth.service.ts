import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(payload: { email: string; password: string }) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((res) => {
          // IMPORTANT: store token
          // localStorage.setItem('auth_token', res.token);
          localStorage.setItem('auth_token', res.token);
          // console.log('User logged in, token stored'+res.token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
  }
}
