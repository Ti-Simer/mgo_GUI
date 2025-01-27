import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiFenixLocal;

  constructor(private http: HttpClient) { }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/update/${id}`, userData,);
  }

  loginFenix(loginData: { credentials: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, loginData);
  }

  findUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/getById/${id}`);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/all/`);
  }

}
