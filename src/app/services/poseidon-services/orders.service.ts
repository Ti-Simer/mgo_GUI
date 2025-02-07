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
export class OrdersService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(pageData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/orders/all`, pageData, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/orders/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/orders/update/${id}`, stationaryTankData, { headers: this.apiKey });
  }

  create(stationaryTankData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/orders/create`, stationaryTankData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/orders/${id}`, { headers: this.apiKey });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  getAvailableOrders(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/orders/getAvailableOrders`, { headers: this.apiKey });
  }

  getByQuery(query: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/orders/findOrderByQuery`, query, { headers: this.apiKey });
  }
}
