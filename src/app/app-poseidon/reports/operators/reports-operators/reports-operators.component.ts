import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-operators',
  templateUrl: './reports-operators.component.html',
  styleUrls: ['./reports-operators.component.scss']
})
export class ReportsOperatorsComponent {
  private languageSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  operators: any[] = [];
  panelOpenState: boolean = false;


  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private courseSerice: CourseService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
  }

  ngOnInit(): void {
    
    this.fetchOperators();
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
    }
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.operators = response.data;
        } else {
          this.toastr.info('No se han encontrado operadores');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un problema al consultar los operarios ${error}`);
      }
    );
  }

  getPanelText(): string {
    return this.panelOpenState ? this.translate.instant('Menos') : this.translate.instant('Más');
  }

  toViewPerformance(id: any) {
    this.router.navigate(['/poseidon/reports/performance', id]);
  }

  toCourses(id: any) {
    this.courseSerice.getCourseByOperatorId(id).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.router.navigate(['/poseidon/courses/view/', this.authService.encryptData(response.data.id)]);
        } else {
          this.toastr.info('El operario no tiene derroteros');
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el derrotero ${error}`);
      }
    );
  }
}
