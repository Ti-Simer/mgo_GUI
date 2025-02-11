import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TabletService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/tablet/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/tablet/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, propaneTruckData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/tablet/update/${id}`, propaneTruckData, { headers: this.apiKey });
  }

  create(propaneTruckData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/tablet/create`, propaneTruckData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/tablet/${id}`, { headers: this.apiKey });
  }
}
