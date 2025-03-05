import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  getAll(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/courses/all`, { headers: this.apiKey });
  }

  getCourseById(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/courses/getById/${id}`, { headers: this.apiKey });
  }

  getCourseByOperatorId(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/courses/getByOperatorId/${id}`, { headers: this.apiKey });
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.put(`${apiUrl}/courses/update/${id}`, courseData, { headers: this.apiKey });
  }

  create(courseData: any): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.post(`${apiUrl}/courses/create`, courseData, { headers: this.apiKey });
  }

  remove(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/courses/${id}`, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/courses/delete/${id}`, { headers: this.apiKey });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  deleteOnReasign(id: string): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.delete(`${apiUrl}/courses/delete-on-reasign/${id}`, { headers: this.apiKey });
  }

  findForHome(): Observable<any> {
    var apiUrl = this.authService.getApiUrl();
    return this.http.get(`${apiUrl}/courses/findForHome`, { headers: this.apiKey });
  }

}
