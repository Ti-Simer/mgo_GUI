import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiKey = environment.apiKey;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/bill/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/bill/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, billData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/bill/update/${id}`, billData, { headers: this.apiKey });
  }

  create(billData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/bill/create`, billData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/bill/${id}`, { headers: this.apiKey });
  }

  /////////////////////////////////////////////////////////////////////////

  getByBranchOfficeCode(code: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/bill/getByBranchOfficeCode/${code}`, { headers: this.apiKey });
  }

  getByOperatorId(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/bill/getByOperatorId/${id}`, { headers: this.apiKey });
  }

  getBillsByMonth(id: string, billData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/bill/getByDate/${id}`, billData, { headers: this.apiKey });
  }

  findByFolio(billData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/bill/findByFolio`, billData, { headers: this.apiKey });
  }

  getGlpByToday(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/bill/getGlpByToday`, { headers: this.apiKey });
  }

  getPlatesByBillDay(data: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/bill/getPlatesByBillDay`, data, { headers: this.apiKey });
  }

}
