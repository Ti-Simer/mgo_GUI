import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

//import { environment } from '../../environments/environment';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/permissions/all`, { headers: this.apiKey });
  }

  getPermissionById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/permissions/getById/${id}`, { headers: this.apiKey });
  }

  updatePermission(id: string, permissionData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/permissions/update/${id}`, permissionData, { headers: this.apiKey });
  }

  create(permissionData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/permissions/create`, permissionData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/permissions/${id}`, { headers: this.apiKey });
  }
}