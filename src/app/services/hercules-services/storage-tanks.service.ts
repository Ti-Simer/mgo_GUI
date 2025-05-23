import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StorageTanksService {
  private apiUrl = environment.apiHerculesMontagas;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  create(storageTankData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/storage-tanks/create`, storageTankData);
  }

  update(id: string, storageTankData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/storage-tanks/update/${id}`, storageTankData);
  }
}
