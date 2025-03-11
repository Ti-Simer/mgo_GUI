import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiHerculesMontagas;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  findLatestData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data/findLatestData/`, { headers: this.apiKey });
  }

  findDataByImei(imei: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/data/findDataByImei/${imei}`);
  }

  findDataByLocality(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/data/findDataByLocality/${id}`);
  }
}
