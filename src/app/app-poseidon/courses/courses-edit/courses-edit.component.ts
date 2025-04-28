import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DialogService } from 'src/app/services/dialog.service';
import { forkJoin, of } from 'rxjs'; // Asegúrate de tener esta línea al inicio de tu archivo
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateOrdersComponent } from '../../orders/dialog-create-orders/dialog-create-orders.component';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';

@Component({
  selector: 'app-courses-edit',
  templateUrl: './courses-edit.component.html',
  styleUrls: ['./courses-edit.component.scss']
})
export class CoursesEditComponent {
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingSmallDialogComponent>;
  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @ViewChild('myInput2') searchInput2!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  @Input() courseId: string = '';

  courseForm: FormGroup;

  course: any;
  orders: any[] = [];

  courses: any[] = [];
  course1: any
  course2: any
  orders1: any[] = [];
  orders2: any[] = [];
  selectedCourseId1: any;
  selectedCourseId2: any;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private orderService: OrdersService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CoursesEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toCourses();
        toastr.warning('No tienes permisos para editar');
      }
    });

    this.courseForm = this.formBuilder.group({
      operator_id: [null, Validators.required],
      propane_truck: [null],
      orders: [null, Validators.required],
      last_orders: [null, Validators.required],
      fecha: [null, Validators.required],
      creator: [this.authService.getUserFromToken()],
    });
  }

  ngOnInit(): void {
    this.loadingDialogRef = this.dialogService.openLoadingDialogSmall();
    this.getCourseById();
    this.getOrders();
  }

  ngAfterViewInit() {
    this.initializeSearchFilter();
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
  
  initializeSearchFilter2() {
    if (this.searchInput2) {
      const inputElement = this.searchInput2.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable2 tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  getCourseById() {
    this.courseService.getCourseById(this.courseId).subscribe(
      (response) => {
        console.log('Response:', response);
        if (response.statusCode === 200) {
          this.course = response.data;
  
          // Convertir la fecha a un objeto Date sin desplazamientos de zona horaria
          const fecha = new Date(this.course.fecha + 'T00:00:00');
  
          this.courseForm.patchValue({
            operator_id: this.course.operator_id,
            fecha: fecha,
            propane_truck: this.course.propane_truck.plate,
            last_orders: this.course.orders.map((order: any) => String(order.folio)),
          });
  
          this.toastr.success('Derrotero consultado con éxito');
        } else {
          console.log('Ocurrió un error en la consulta del derrotero');
        }
      },
      (error) => {
        console.log('Ha ocurrido un error al consultar el derrotero', error);
      }
    );
  }

  getOrders() {
    this.orderService.getAvailableOrders().subscribe(
      response => {
        this.loadingDialogRef.close();
        if (response.statusCode === 200) {
          this.orders = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.folio); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.folio); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });
        }
      }, (error => {
        console.error('Error al obtener pedidos: ', error);
      })
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    if (!event.previousContainer.data || !event.container.data) {
      console.error('Container data is undefined:', event.container);
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  moveOrder(order: any) {    
    if (!this.orders1.includes(order)) {
      this.orders1.push(order);
      this.orders2 = this.orders2.filter(item => item !== order);
    } else {
      this.orders2.push(order);
      this.orders1 = this.orders1.filter(item => item !== order);
    }
  }

  reset() {
    this.loadingDialogRef = this.dialogService.openLoadingDialogSmall();
    this.getOrders();
    this.getCourseById();
  }

  onSubmit() {
    this.loadingDialogRef = this.dialogService.openLoadingDialogSmall();
    this.dialogService.openConfirmDialog('¿Esta seguro que desea realizar los cambios?, recuerde que esta información sera modificada y se verá reflejada cuando el operario descargue los datos nuevamente')
      .subscribe(result => {
        if (result) {
          this.courseForm.patchValue({
            operator_id: this.course.operator_id,
            orders: this.course.orders.map((order: any) => order.id),
          });

          // Obtener el valor actual del formulario
          const formValue = this.courseForm.value;

          // Transformar la fecha al formato "YYYY-MM-DD"
          if (formValue.fecha) {
            const date = new Date(formValue.fecha);
            formValue.fecha = date.toISOString().split('T')[0];
          }

          this.courseService.updateCourse(this.course.id, formValue).subscribe(
            response => {
              if (response.statusCode === 200) {
                this.toastr.success('Derrotero actualizado con éxito');
                this.dialogRef.close();
                this.loadingDialogRef.close();
              } else {
                this.toastr.error('Error al actualizar el derrotero');
                this.loadingDialogRef.close();
              }
            }, (error) => {
              console.error('Error al actualizar el derrotero: ', error);
              this.toastr.error('Error al actualizar el derrotero');
              this.loadingDialogRef.close();
            }
          );
          //return this.courseService.updateCourse(this.course.id, this.courseForm.value);
        }
        this.loadingDialogRef.close();
        return of(null); // Add this line
      });
    this.loadingDialogRef.close();
    return false;
  }

  toCreateOrders() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateOrdersComponent, {
          width: '750px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.getOrders();
        });
      }
    });
  }

  toCourses() {
    this.router.navigate(['/poseidon/courses/admin']);
  }

}
