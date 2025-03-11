import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LocalitiesService {
  private apiUrl = environment.apiHerculesMontagas;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  create(locationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/locations/create`, locationData);
  }

  update(id: string, locationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/locations/update/${id}`, locationData);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/locations/all/`);
  }
}
