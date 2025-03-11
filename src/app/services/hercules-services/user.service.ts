import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiHerculesMontagas;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  create(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/create`, userData, { headers: this.apiKey });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/update/${id}`, userData, { headers: this.apiKey });
  }

  loginHercules(loginData: { credentials: string; password: string }): Observable<any> {    
    return this.http.post(`${this.apiUrl}/usuarios/login`, loginData, { headers: this.apiKey });
  }

  findUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/getById/${id}`, { headers: this.apiKey });
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/all/`, { headers: this.apiKey });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/delete/${id}`, { headers: this.apiKey });
  }

  activateUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/activate/${id}`, { headers: this.apiKey });
  }
}
