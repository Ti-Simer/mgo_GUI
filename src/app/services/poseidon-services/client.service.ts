import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from '../auth.service';

//import { environment } from '../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/client/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/client/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, clientData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/client/update/${id}`, clientData, { headers: this.apiKey });
  }

  create(clientData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/client/create`, clientData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/client/${id}`, { headers: this.apiKey });
  }

  ////////////////////////////////////////////////////////////////////////////////////

  getByBranchOfficeId(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/client/getByBranchOfficeId/${id}`, { headers: this.apiKey });
  }

  createMultiple(clientData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/client/createMultiple`, clientData, { headers: this.apiKey });
  }

  getByQuery(query: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/client/findClientQuery`, query, { headers: this.apiKey });
  }

}
