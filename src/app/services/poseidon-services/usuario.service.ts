import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';

//import { environment } from '../../environments/environment';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private authTokenKey = 'authToken';
  private apiKey = environment.apiKey

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
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

  create(userData: any): Observable<any> {
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

    return this.http.post(`${apiUrl}/usuarios/create`, userData, { headers: this.apiKey });
  }

  list(): Observable<any> {
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

    return this.http.get(`${apiUrl}/usuarios/all`, { headers: this.apiKey });
  }

  listOperators(): Observable<any> {
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

    return this.http.get(`${apiUrl}/usuarios/all/operators`, { headers: this.apiKey });
  }

  listAvailableOperators(): Observable<any> {
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

    return this.http.get(`${apiUrl}/usuarios/all/available/operators`, { headers: this.apiKey });
  }

  getUserById(id: string): Observable<any> {
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

    return this.http.get(`${apiUrl}/usuarios/getById/${id}`, { headers: this.apiKey });
  }

  updateUser(id: string, userData: any): Observable<any> {
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

    return this.http.put(`${apiUrl}/usuarios/update/${id}`, userData, { headers: this.apiKey });
  }

  deleteUser(id: string): Observable<any> {
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

    return this.http.delete(`${apiUrl}/usuarios/delete/${id}`, { headers: this.apiKey });
  }

  activateUser(id: string): Observable<any> {
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

    return this.http.delete(`${apiUrl}/usuarios/activate/${id}`, { headers: this.apiKey });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken'); // Obtén el token del localStorage
    return !!token; // Devuelve true si el token existe
  }

  login(loginData: { server: string, email: string; password: string }): Observable<any> {
    var apiUrl: any;

    switch (loginData.server) {
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
        this.toastr.warning('Ingrese un servidor válido', 'Servidor no válido');
        break;
    }

    return this.http.post(`${apiUrl}/usuarios/login`, loginData, { headers: this.apiKey });

  }
}

