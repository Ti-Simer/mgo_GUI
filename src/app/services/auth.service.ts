import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsuarioService } from './poseidon-services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  private authTokenKey = 'authToken';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private usuariosService: UsuarioService,
    private toastr: ToastrService
  ) { }

  // ============================= ** Métodos de autenticación ** ============================= //

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.authTokenKey); // Obtén el token del localStorage
    return !!token; // Devuelve true si el token existe
  }

  // Iniciar sesión y guardar token en el localStorage con duración
  login(token: string, expiresIn: number): void {
    // Calcula la fecha de expiración sumando el tiempo actual en milisegundos
    // con la duración en segundos
    const expirationDate = new Date().getTime() + expiresIn * 1000;

    // Crea un objeto que contiene el token y la fecha de expiración
    const tokenData = {
      token: token,
      expirationDate: expirationDate,
    };

    // Guarda el objeto en el localStorage
    localStorage.setItem(this.authTokenKey, JSON.stringify(tokenData));
    this.loggedIn.next(true); // Emitir el nuevo estado de autenticación
  }

  // Cerrar sesión y eliminar token del localStorage
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this.loggedIn.next(false); // Emitir el nuevo estado de autenticación
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const tokenData = localStorage.getItem(this.authTokenKey);
    if (tokenData) {
      const parsedTokenData = JSON.parse(tokenData);
      return parsedTokenData.expirationDate > new Date().getTime();
    }
    return false;
  }

  // Obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Obtener el usuario completo desde el token
  getUserFromToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode.default(token);
        return decodedToken.userId;

      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
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

  // ----------------------------- ** Métodos de encriptación y desencriptación ** ----------------------------- //

  encryptData(data: string) {
    const ciphertext = CryptoJS.AES.encrypt(data.toString(), 'S1m3r9010').toString();
    return ciphertext;
  }

  decryptData(data: string) {
    const bytes  = CryptoJS.AES.decrypt(data, 'S1m3r9010');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  // ----------------------------- ** Métodos de verificación de roles ** ----------------------------- //

  rolChecker() {
    const userId = this.getUserFromToken();
    var user = null;

    this.usuariosService.getUserById(userId).subscribe(
      response => {
        user = response.data;
        if (user.role.name === 'Operario') {
          this.router.navigate(['/home']);
        }
      }
    );
  }

  writeChecker(): Observable<boolean> {
    const userId = this.getUserFromToken();
    return this.usuariosService.getUserById(userId).pipe(
      map(response => {
        const permissions = response.data.role.permissions;
        return permissions.some((permission: { name: string }) => permission.name === 'Escritura');
      })
    );
  }

  editChecker(): Observable<boolean> {
    const userId = this.getUserFromToken();
    return this.usuariosService.getUserById(userId).pipe(
      map(response => {
        const permissions = response.data.role.permissions;
        return permissions.some((permission: { name: string }) => permission.name === 'Edición');
      })
    );
  }

  deleteChecker(): Observable<boolean> {
    const userId = this.getUserFromToken();
    return this.usuariosService.getUserById(userId).pipe(
      map(response => {
        const permissions = response.data.role.permissions;
        return permissions.some((permission: { name: string }) => permission.name === 'Eliminación');
      })
    );
  }

  readChecker(): Observable<boolean> {
    const userId = this.getUserFromToken();
    return this.usuariosService.getUserById(userId).pipe(
      map(response => {
        const permissions = response.data.role.permissions;
        return permissions.some((permission: { name: string }) => permission.name === 'Lectura');
      })
    );
  }

  AtheneaKeyVerify () {
    const token = this.getTokenData();
    console.log(token);
    
    if (token.key == 'athenea-montagas.9010') {
    } else {
      this.router.navigate(['/']);
      this.toastr.warning('No tienes permisos para acceder a esta página', 'Acceso denegado');
    }
  }

  PoseidonKeyVerify () {
    const token = this.getTokenData();
    console.log(token);
    
    if (token.key == 'poseidon-645C0*.9010') {
    } else {
      this.router.navigate(['/']);
      this.toastr.warning('No tienes permisos para acceder a esta página', 'Acceso denegado');
    }
  }

  FenixKeyVerify () {
    const token = this.getTokenData();    
    if (token.key == 'fenix-montagas.9010') {
    } else {
      this.router.navigate(['/']);
      this.toastr.warning('No tienes permisos para acceder a esta página', 'Acceso denegado');
    }
  }

}
