import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';

//import { environment } from '../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LogReportService {

  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey


  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }

  // Obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Obtener el usuario completo desde el token
  getTokenData(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode.default(token);
        return decodedToken;

      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  getAll(): Observable<any> {
    const token = this.getTokenData();
    var apiUrl: any;

    switch (token.key) {
      case 'poseidon-645C0*.9010':
        apiUrl = environment.apiPoseidonGasco;
        break;

      case 'poseidon-645N31V4+.8020':
        apiUrl = environment.apiPoseidonGasneiva;
        break;

      case 'poseidon-D1645PR0*.7030':
        apiUrl = environment.apiPoseidonDigaspro;
        break;

      case 'poseidon-M0NT4645+.6040':
        apiUrl = environment.apiPoseidonMontagas;
        break;

      case 'poseidon-3654*.5050':
        apiUrl = environment.apiPoseidonEgsa;
        break;

      default:
        this.toastr.warning('Usuario no autorizado', 'Error');
        break;
    }

    return this.http.get(`${apiUrl}/log-report/all`, { headers: this.apiKey });
  }

  getById(id: string): Observable<any> {
    const token = this.getTokenData();
    var apiUrl: any;

    switch (token.key) {
      case 'poseidon-645C0*.9010':
        apiUrl = environment.apiPoseidonGasco;
        break;

      case 'poseidon-645N31V4+.8020':
        apiUrl = environment.apiPoseidonGasneiva;
        break;

      case 'poseidon-D1645PR0*.7030':
        apiUrl = environment.apiPoseidonDigaspro;
        break;

      case 'poseidon-M0NT4645+.6040':
        apiUrl = environment.apiPoseidonMontagas;
        break;

      case 'poseidon-3654*.5050':
        apiUrl = environment.apiPoseidonEgsa;
        break;

      default:
        this.toastr.warning('Usuario no autorizado', 'Error');
        break;
    }

    return this.http.get(`${apiUrl}/log-report/getById/${id}`, { headers: this.apiKey });
  }

  update(id: string, stationaryTankData: any): Observable<any> {
    const token = this.getTokenData();
    var apiUrl: any;

    switch (token.key) {
      case 'poseidon-645C0*.9010':
        apiUrl = environment.apiPoseidonGasco;
        break;

      case 'poseidon-645N31V4+.8020':
        apiUrl = environment.apiPoseidonGasneiva;
        break;

      case 'poseidon-D1645PR0*.7030':
        apiUrl = environment.apiPoseidonDigaspro;
        break;

      case 'poseidon-M0NT4645+.6040':
        apiUrl = environment.apiPoseidonMontagas;
        break;

      case 'poseidon-3654*.5050':
        apiUrl = environment.apiPoseidonEgsa;
        break;

      default:
        this.toastr.warning('Usuario no autorizado', 'Error');
        break;
    }

    return this.http.put(`${apiUrl}/log-report/update/${id}`, stationaryTankData, { headers: this.apiKey });
  }

  create(stationaryTankData: any): Observable<any> {
    const token = this.getTokenData();
    var apiUrl: any;

    switch (token.key) {
      case 'poseidon-645C0*.9010':
        apiUrl = environment.apiPoseidonGasco;
        break;

      case 'poseidon-645N31V4+.8020':
        apiUrl = environment.apiPoseidonGasneiva;
        break;

      case 'poseidon-D1645PR0*.7030':
        apiUrl = environment.apiPoseidonDigaspro;
        break;

      case 'poseidon-M0NT4645+.6040':
        apiUrl = environment.apiPoseidonMontagas;
        break;

      case 'poseidon-3654*.5050':
        apiUrl = environment.apiPoseidonEgsa;
        break;

      default:
        this.toastr.warning('Usuario no autorizado', 'Error');
        break;
    }

    return this.http.post(`${apiUrl}/log-report/create`, stationaryTankData, { headers: this.apiKey });
  }

  delete(id: string): Observable<any> {
    const token = this.getTokenData();
    var apiUrl: any;

    switch (token.key) {
      case 'poseidon-645C0*.9010':
        apiUrl = environment.apiPoseidonGasco;
        break;

      case 'poseidon-645N31V4+.8020':
        apiUrl = environment.apiPoseidonGasneiva;
        break;

      case 'poseidon-D1645PR0*.7030':
        apiUrl = environment.apiPoseidonDigaspro;
        break;

      case 'poseidon-M0NT4645+.6040':
        apiUrl = environment.apiPoseidonMontagas;
        break;

      case 'poseidon-3654*.5050':
        apiUrl = environment.apiPoseidonEgsa;
        break;

      default:
        this.toastr.warning('Usuario no autorizado', 'Error');
        break;
    }

    return this.http.delete(`${apiUrl}/log-report/delete/${id}`, { headers: this.apiKey });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  findByDay(): Observable<any> {
    const token = this.getTokenData();
    var apiUrl: any;

    switch (token.key) {
      case 'poseidon-645C0*.9010':
        apiUrl = environment.apiPoseidonGasco;
        break;

      case 'poseidon-645N31V4+.8020':
        apiUrl = environment.apiPoseidonGasneiva;
        break;

      case 'poseidon-D1645PR0*.7030':
        apiUrl = environment.apiPoseidonDigaspro;
        break;

      case 'poseidon-M0NT4645+.6040':
        apiUrl = environment.apiPoseidonMontagas;
        break;

      case 'poseidon-3654*.5050':
        apiUrl = environment.apiPoseidonEgsa;
        break;

      default:
        this.toastr.warning('Usuario no autorizado', 'Error');
        break;
    }

    return this.http.get(`${apiUrl}/log-report/findByDay`, { headers: this.apiKey });
  }


}
