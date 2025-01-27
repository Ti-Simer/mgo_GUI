import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ResDataService {
  private apiUrl = environment.apiHerculesMontagas;

  constructor(private http: HttpClient) { }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/res-data/create`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/res-data/update/${id}`, userData,);
  }

  findUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/res-data/getById/${id}`);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/res-data/all/`);
  }

  ///////////////////////////////////////////////////////////////////////////////////

  findByDevice(id_device: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/res-data/findByDevice/${id_device}`);
  }

  findBySensor(sensorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/res-data/findBySensor`, sensorData);
  }
}
