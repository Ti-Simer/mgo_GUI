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
export class BranchOfficesService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(pageData: any): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/branch-offices/all`, pageData, { headers: this.apiKey });
  }

  getAlls(): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/branch-offices/all`, { headers: this.apiKey });
  }

  getBranchOfficeById(id: string): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/branch-offices/getById/${id}`, { headers: this.apiKey });
  }

  updateBranchOffice(id: string, branchOfficeData: any): Observable<any> {
    console.log('id', id);
var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/branch-offices/update/${id}`, branchOfficeData, { headers: this.apiKey });
  }

  create(branchOfficeData: any): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/branch-offices/create`, branchOfficeData, { headers: this.apiKey });
  }


  delete(id: string): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/branch-offices/${id}`, { headers: this.apiKey });
  }

  //////////////////////////////////////////////////////////////////////////////////

  approve(id: string): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/branch-offices/approve/${id}`, { headers: this.apiKey });
  }

  getBranchOfficesWithBills(): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/branch-offices/getWithBills`, { headers: this.apiKey });
  }

  getAllPending(): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/branch-offices/all/pending`, { headers: this.apiKey });
  }

  createForOperator(branchOfficeData: any): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/branch-offices/createForOperator`, branchOfficeData, { headers: this.apiKey });
  }

  getAvailableBranchOffices(): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/branch-offices/getAvailableBranchOffices`, { headers: this.apiKey });
  }

  updateStatus(id: string, branchOfficeData: any): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/branch-offices/updateStatus/${id}`, branchOfficeData, { headers: this.apiKey });
  }

  createMultiple(branchOfficeData: any): Observable<any> {
var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/branch-offices/createMultiple`, branchOfficeData, { headers: this.apiKey });
  }

  getByQuery(query: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/branch-offices/findbranchOfficesByQuery`, query, { headers: this.apiKey });
  }
}