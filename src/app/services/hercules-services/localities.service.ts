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

  findAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/locations/all/`);
  }
}
