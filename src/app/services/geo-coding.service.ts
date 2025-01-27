import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiKey = 'AIzaSyB__EOk3UXcZgFa6cZ6DKBS_kx5ipBkJck';
  private geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) { }

  getCoordinatesFromPlusCode(plusCode: string): Observable<any> {
    const url = `${this.geocodeUrl}?address=${encodeURIComponent(plusCode)}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}

