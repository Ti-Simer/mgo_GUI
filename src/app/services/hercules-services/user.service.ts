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

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/create`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/update/${id}`, userData,);
  }

  loginHercules(loginData: { credentials: string; password: string }): Observable<any> {    
    return this.http.post(`${this.apiUrl}/usuarios/login`, loginData, { headers: this.apiKey });
  }

  findUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/getById/${id}`);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/all/`);
  }
}
