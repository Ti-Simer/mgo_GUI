import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationaryTankService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/stationary-tank/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/stationary-tank/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/stationary-tank/update/${id}`, stationaryTankData, { headers: this.apiKey });
  }

  create(stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/stationary-tank/create`, stationaryTankData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/stationary-tank/${id}`, { headers: this.apiKey });
  }

  ////////////////////////////////////////////////////////////////////////////////

  getAllAvailable(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/stationary-tank/allAvailable`, { headers: this.apiKey });
  }

  createMultiple(stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/stationary-tank/createMultiple`, stationaryTankData, { headers: this.apiKey });
  }

  updateMultiple(ids: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/stationary-tank/updateMultiple/`, ids, { headers: this.apiKey });
  }
}
