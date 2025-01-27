import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { PropaneTruckService } from 'src/app/services/poseidon-services/propane-truck.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogViewCoursesComponent } from 'src/app/app-poseidon/courses/dialog-view-courses/dialog-view-courses.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reports-propane-trucks',
  templateUrl: './reports-propane-trucks.component.html',
  styleUrls: ['./reports-propane-trucks.component.scss']
})
export class ReportsPropaneTrucksComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  propane_trucks: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private propaneTruckService: PropaneTruckService,
    private courseSerice: CourseService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  ngOnInit(): void {

    this.fetchPropaneTrucks();
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

  fetchPropaneTrucks() {
    this.isLoading = true;
    this.propaneTruckService.getAll().subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.propane_trucks = response.data;
        } else {
          this.toastr.info('No se han encontrado auto-tanques');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un problema al consultar los auto-tanques ${error}`);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.propane_trucks.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.propane_trucks.sort((a: any, b: any) => {
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

  toViewPerformance(id: any) {
    console.log(id);
    this.router.navigate(['/poseidon/reports/propane-truck/graphs', this.authService.encryptData(id)]);
  }

  toCourses(id: any) {
    this.courseSerice.getCourseByOperatorId(id).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.authService.readChecker().subscribe(flag => {
            if (!flag) {
              this.toastr.warning('No tienes permisos para leer esta información');
            } else {
              const dialogRef = this.dialog.open(DialogViewCoursesComponent, {
                width: '1400px',
                data: { courseId: response.data.id }
              });

              dialogRef.afterClosed().subscribe(result => {
                this.fetchPropaneTrucks();
              });
            }
          });
        } else {
          this.toastr.info('El operario no tiene derroteros');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el derrotero ${error}`);
      }
    );

  }

}
