import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private apiUrl = environment.apiHerculesMontagas;

  constructor(private http: HttpClient) { }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sensors/create`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/sensors/update/${id}`, userData,);
  }

  findUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sensors/getById/${id}`);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sensors/all/`);
  }

  ///////////////////////////////////////////////////////////////////////////////////

  findByDevice(id_device: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sensors/findByDevice/${id_device}`);
  }
}
