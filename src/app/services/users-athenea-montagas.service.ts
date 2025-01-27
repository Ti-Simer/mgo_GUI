import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsersAtheneaMontagasService {
  private apiUrlMontagas = environment.apiAtheneaMontagas;

  constructor(private http: HttpClient) { }

  create(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrlMontagas}/usuarios/create`, userData);
  }

  list(): Observable<any> {
    return this.http.get(`${this.apiUrlMontagas}/usuarios/all`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrlMontagas}/usuarios/getById/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrlMontagas}/usuarios/update/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlMontagas}/usuarios/delete/${id}`);
  }

  activateUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlMontagas}/usuarios/activate/${id}`);
  }

  loginMontagas(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrlMontagas}/users/login`, loginData);
  }

  ///////////////////////////////////////////////////////////////////////////////////

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken'); // Obtén el token del localStorage
    return !!token; // Devuelve true si el token existe
  }
}
