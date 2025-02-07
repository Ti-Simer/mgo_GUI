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
export class RequestService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(pageData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/request/all`, pageData, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/request/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/request/update/${id}`, stationaryTankData, { headers: this.apiKey });
  }

  create(stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/request/create`, stationaryTankData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/request/${id}`, { headers: this.apiKey });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  getRequestByPlate(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/request/getByPlate/${id}`, { headers: this.apiKey });
  }

  getByQuery(query: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/request/findRequestByQuery`, query, { headers: this.apiKey });
  }

}
