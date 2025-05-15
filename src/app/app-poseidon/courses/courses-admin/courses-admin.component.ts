import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogViewOrdersComponent } from '../../orders/dialog-view-orders/dialog-view-orders.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateCoursesComponent } from '../dialog-create-courses/dialog-create-courses.component';
import { DialogEditCoursesComponent } from '../dialog-edit-courses/dialog-edit-courses.component';
import { DialogViewCoursesComponent } from '../dialog-view-courses/dialog-view-courses.component';
import { DialogReasignOrdersComponent } from '../../orders/dialog-reasign-orders/dialog-reasign-orders.component';
import { DialogListOrdersComponent } from '../../orders/dialog-list-orders/dialog-list-orders.component';

@Component({
  selector: 'app-courses-admin',
  templateUrl: './courses-admin.component.html',
  styleUrls: ['./courses-admin.component.scss']
})
export class CoursesAdminComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  branchOffices: any;
  courses: any[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });
    this.getCourses();
  }

  ngOnInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }
  }

  // Método para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });

      this.initializeSearchFilter();
    }
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  setPageSizeToTotal() {
    this.pageSize = this.courses.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.courses.sort((a: any, b: any) => {
      let valueA = a;
      let valueB = b;

      // Navega a través de las claves para obtener el valor final
      keys.forEach(key => {
        if (key.includes('[')) {
          const [arrayKey, index] = key.split(/[\[\]]/).filter(Boolean);
          valueA = valueA[arrayKey][index];
          valueB = valueB[arrayKey][index];
        } else {
          valueA = valueA[key];
          valueB = valueB[key];
        }
      });

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0; // Los valores son iguales
    });
  }

  getCourses() {
    this.isLoading = true;
    this.courseService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.courses = response.data;
        } else {
          this.toastr.info('No se han encontrado derroteros');
        }
      }, (error) => {
        console.error("Ha ocurrido un error al consultar los derroteros: ", error);
      }
    )
  }

  getCriticalityColor(criticality: string): string {
    switch (criticality) {
      case 'FINALIZADO':
        return '#2bca80';
      case 'DISPONIBLE':
        return '#0DCAF0';
      case 'EN CURSO':
        return '#e0b76f';
      default:
        return 'grey';
    }
  }

  toViewOrder(order: any) {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogViewOrdersComponent, {
          width: '460px',
          data: { orderId: order.id }
        });
      }
    });
  }

  toReasignOrders() {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogReasignOrdersComponent, {
          width: '1400px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getCourses();
        });
      }
    });
  }

  toOrders() {
    this.router.navigate(['/poseidon/orders/list']);
  }

  toCreateCourses() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateCoursesComponent, {
          width: '1400px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getCourses();
        });
      }
    });
  }

  toEditCourse(course: any) {
    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para editar');
      } else {
        const dialogRef = this.dialog.open(DialogEditCoursesComponent, {
          width: '1400px',
          data: { courseId: course.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getCourses();
        });
      }
    });
  }

  toViewCourse(course: any) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogViewCoursesComponent, {
          width: '1400px',
          data: { courseId: course.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getCourses();
        });
      }
    });
  }

  toViewOrders(course: any) {    
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        const dialogRef = this.dialog.open(DialogListOrdersComponent, {
          width: '700px',
          data: { course: course}
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getCourses();
        });
      }
    });
  }

  toHome() {
    this.router.navigate(['/poseidon/home'])
  }

  deleteCourse(id: any) {

  }

}
