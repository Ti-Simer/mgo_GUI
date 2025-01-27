import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = environment.apiHerculesMontagas;
  
  constructor(private http: HttpClient) { }
  
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cities/create`, userData);
  }
  
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cities/update/${id}`, userData,);
  }
  
  findUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cities/getById/${id}`);
  }
  
  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cities/all/`);
  }
}
