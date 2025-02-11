import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  generateCsv(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/graphs/generateCsv/${id}`, { headers: this.apiKey });
  }

  getDailyPurchase(dailyPurchaseData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/graphs/daily-purchase`, dailyPurchaseData, { headers: this.apiKey });
  }

  deleteImage(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/graphs/delete/${id}`, { headers: this.apiKey });
  }

  remove(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/graphs/remove/${id}`, { headers: this.apiKey });
  }

  removeAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/graphs/remove-all`, { headers: this.apiKey });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  generateCsvByBranchOffice(id: string, billData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/graphs/generateCsvbyBranchOffice/${id}`, billData, { headers: this.apiKey });
  }

  generateCsvByPropaneTruck(id: string, billData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/graphs/generateCsvbyPropaneTruck/${id}`, billData, { headers: this.apiKey });
  }

}
