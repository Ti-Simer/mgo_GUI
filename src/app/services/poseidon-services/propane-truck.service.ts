import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

//import { environment } from '../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PropaneTruckService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/propane-truck/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/propane-truck/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, propaneTruckData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/propane-truck/update/${id}`, propaneTruckData, { headers: this.apiKey });
  }

  create(propaneTruckData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/propane-truck/create`, propaneTruckData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/propane-truck/${id}`, { headers: this.apiKey });
  }

  /////////////////////////////////////////////////////////////////////////////////////////

  activate(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/propane-truck/activate/${id}`, { headers: this.apiKey });
  }

  getByOperatorId(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/propane-truck/getByOperator/${id}`, { headers: this.apiKey });
  }

  updateStatus(id: string, propaneTruckData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/propane-truck/updateStatus/${id}`, propaneTruckData, { headers: this.apiKey });
  }

}
