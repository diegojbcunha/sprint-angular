import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3001';
  private readonly STORAGE_KEY = 'isLoggedIn';
  private readonly USER_KEY = 'usuario';

  constructor(private readonly http: HttpClient) {}

  login(usuario: Pick<Usuario, 'nome' | 'senha'>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/login`, usuario).pipe(
      tap((response) => {
        this.setUserSession(response);
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  getCurrentUser(): Usuario | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    this.clearUserSession();
  }

  private setUserSession(user: Usuario): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearUserSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem(this.USER_KEY);
  }
}
