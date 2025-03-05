import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { BillService } from 'src/app/services/poseidon-services/bill.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private languageSubscription!: Subscription;

  zoom: any = 14;

  markers: any[] = [];
  mapCenter: google.maps.LatLngLiteral = { lat: 1.264773397887801, lng: -77.2786796092987 };

  // Define una matriz de modos de transporte para cada marcador
  travelModes: google.maps.TravelMode[] = [];
  @ViewChild('map') map: any; // Esta es la referencia al mapa

  userId: any;
  user: any;
  nameText: any;
  roleText: any;
  massData: any;
  orders: any;
  courses: any;
  operators: any;
  notifications: any = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
    private billService: BillService,
    private ordersService: OrdersService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.userId = this.authService.getUserFromToken();
    this.getUserById();
  }

  ngOnInit(): void {
    // Verifica si el usuario tiene un token válido
    if (!this.usuarioService.isLoggedIn()) {
      // Si no está autenticado, redirige a la página de inicio de sesión
      this.router.navigate(['/landing-page']);
    }
    
    this.fetchDataMass();
    this.fetchOrdersLength();
    this.fetchCourses();
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  keyVerify() {
    const token = this.authService.getTokenData();
    if (token.key == 'poseidon-M0NT4645+.6040') {
    } else {
      this.router.navigate(['/']);
      this.toastr.warning('No tienes permisos para acceder a esta sección', 'Acceso denegado');
    }
  }

  fetchDataMass() {
    this.billService.getGlpByToday().subscribe(
      response => {
        if(response.statusCode == 200) {
          this.massData = response.data;
        }
      }, error => {
        console.error('Error al obtener las facturas:', error);
      }
    );
  }

  fetchOrdersLength() {
    this.ordersService.getOrdersByToday().subscribe(
      response => {
        this.orders = response.data;
      }, error => {
        console.error('Error al obtener las pedidos:', error);
      }
    );
  }

  fetchCourses() {
    this.courseService.findForHome().subscribe(
      response => {
        if (response.statusCode === 200) {
          console.log(response);
          this.courses = response.data;
        }
      }
    );
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      response => {
        this.operators = response.data;
      }, error => {
        console.error('Error al obtener los operarios:', error);
      }
    );
  }
  
  getUserById() {
    this.usuarioService.getUserById(this.userId).subscribe(
      (response) => {
        this.user = response.data;
        this.nameText = response.data.firstName + " " + response.data.lastName;
        this.roleText = response.data.role.name;
      },
      (error) => {
        console.error('Error al obtener el permiso por ID:', error);
      }
    );
  }

  refreshData() {
    this.fetchDataMass();
    this.fetchOrdersLength();
  }

  toOrders() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/orders/list']);
      }
    });
  }

  toReports() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/reports/list']);
      }
    });
  }

  toRequest() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/request/list']);
      }
    });
  }

  toNotifications() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/notifications/list']);
      }
    });
  }

  toUsers() {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.router.navigate(['/poseidon/usuarios/list']);
      }
    });
  }

  toCourses(role: string) {
    switch (role) {
      case 'Operario': {
        this.router.navigate(['/poseidon/courses/operator']);
        break;
      }
      default: {
        this.authService.readChecker().subscribe(flag => {
          if (!flag) {
            this.toastr.warning('No tienes permisos para leer esta información');
          } else {
            this.router.navigate(['/poseidon/courses/admin']);
          }
        });
        break;
      }
    }
  }

}

