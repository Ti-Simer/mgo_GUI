import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiFenixLocal;

  constructor(private http: HttpClient) { }

  generateCsvByMonth(billData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data/generateCsvbyDate`, billData);
  }

  verifyData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nif/validator`);
  }

}
