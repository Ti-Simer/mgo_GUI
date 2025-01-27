import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NifService {
  private apiUrl = environment.apiFenixLocal;

  constructor(private http: HttpClient) { }

  createMultiple(nifData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/nif/createMultiple`, nifData);
  }

  findOne(nifData: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/nif/getById/${nifData}`);
  }

  update(id: string, nifData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/nif/update/${id}`, nifData);
  }



}
