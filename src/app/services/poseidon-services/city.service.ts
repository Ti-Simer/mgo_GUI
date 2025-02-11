import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/city/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/city/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, permissionData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/city/update/${id}`, permissionData, { headers: this.apiKey });
  }

  create(permissionData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/city/create`, permissionData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/city/${id}`, { headers: this.apiKey });
  }

  activate(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/city/activate/${id}`, { headers: this.apiKey });
  }
}
