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
export class RolesService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/roles/all`, { headers: this.apiKey });
  }

  getRoleById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/roles/getById/${id}`, { headers: this.apiKey });
  }

  updateRole(id: string, roleData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/roles/update/${id}`, roleData, { headers: this.apiKey });
  }

  create(roleData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/roles/create`, roleData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/roles/${id}`, { headers: this.apiKey });
  }
}

