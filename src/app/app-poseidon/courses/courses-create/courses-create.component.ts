import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/poseidon-services/course.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { PropaneTruckService } from 'src/app/services/poseidon-services/propane-truck.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreatePropaneTruckComponent } from '../../propane-truck/dialog-create-propane-truck/dialog-create-propane-truck.component';
import { DialogCreateOrdersComponent } from '../../orders/dialog-create-orders/dialog-create-orders.component';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-courses-create',
  templateUrl: './courses-create.component.html',
  styleUrls: ['./courses-create.component.scss']
})
export class CoursesCreateComponent {
  @ViewChild('myInput') searchInput!: ElementRef;
  @ViewChild('myInput2') searchInput2!: ElementRef;
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingSmallDialogComponent>;

  courseForm: FormGroup;
  visualForm: FormGroup;
  operators: any[] = [];
  branchOffices: any;
  selectedOrder: any[] = [];
  selectedOrderName: any[] = [];
  propaneTrucks: any[] = [];
  filteredpropaneTrucks!: Observable<any[]>;
  locations: any;
  orders: any;
  propaneTruck: any;
  flag = false;

  selectedStart: any;
  selectedEnd: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private courseService: CourseService,
    private orderService: OrdersService,
    private propaneTruckService: PropaneTruckService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<CoursesCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.courseForm = this.formBuilder.group({
      operator_id: [null, Validators.required],
      propane_truck: [null],
      orders: [null, Validators.required],
      fecha: [null, Validators.required],
      creator: [this.authService.getUserFromToken()],
    });

    this.visualForm = this.formBuilder.group({
      operator: [null],
      propane_truck: [null],
      orders: [null],
      fecha: [null],
    });

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toCourses();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    this.fetchPropaneTrucks();
    this.getOrders();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.propaneTrucks.filter(propaneTruck => {
      const plateMatch = propaneTruck.plate.toLowerCase().includes(filterValue);
      const firstNameMatch = propaneTruck.operator[0].firstName.toLowerCase().includes(filterValue);
      const lastNameMatch = propaneTruck.operator[0].lastName.toLowerCase().includes(filterValue);
      return plateMatch || firstNameMatch || lastNameMatch;
    });
  }

  displayFn(propaneTruck: any): string {
    return propaneTruck && propaneTruck.plate ? `${propaneTruck.plate} || ${propaneTruck.operator[0].firstName} ${propaneTruck.operator[0].lastName}` : '';
  }

  getOrders() {
    this.orderService.getAvailableOrders().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.orders = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.folio); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.folio); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });

        } else {
          this.toastr.info('No hay pedidos disponibles  <a href="/poseidon/orders/list">Asignar</a>', 'Información', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: true,
            enableHtml: true
          });
          this.toCourses();
        }
      }, (error => {
        console.error('Error al obtener pedidos: ', error);
      })
    );
  }

  onPropaneTruckSelected(event: any): void {
    const selectedPropaneTruck = event.option.value;
    if (selectedPropaneTruck) {
      if (selectedPropaneTruck.operator.length <= 1) {
        this.operators = [];
        this.courseForm.patchValue({
          propane_truck: selectedPropaneTruck.plate,
          operator_id: selectedPropaneTruck.operator[0].idNumber,
        });

        this.visualForm.patchValue({
          propane_truck: selectedPropaneTruck.plate,
          operator: selectedPropaneTruck.operator[0].firstName + ' ' + selectedPropaneTruck.operator[0].lastName,
        });
      } else {
        this.courseForm.patchValue({
          propane_truck: selectedPropaneTruck.plate,
          operator_id: null,
        });

        this.visualForm.patchValue({
          operator: null,
        });

        this.operators = selectedPropaneTruck.operator;

        this.visualForm.patchValue({
          propane_truck: selectedPropaneTruck.plate,
        });
      }

    }
  }

  onOperatorSelectionChange(event: any): void {
    const selectedOperatorId = event.target.value;
    const selectedOperator = this.operators.find(operator => operator.idNumber === selectedOperatorId);
    if (selectedOperator) {
      this.courseForm.patchValue({
        operator_id: selectedOperator.idNumber,
      });

      this.visualForm.patchValue({
        operator: selectedOperator.firstName + ' ' + selectedOperator.lastName,
      });
    }
  }

  onOrderChange(order: any) {
    const index = this.selectedOrder.indexOf(order.id);
    const indexName = this.selectedOrderName.indexOf(order.branch_office.name);

    if (index === -1) {
      // Si no se encuentra en la lista, agrégalo
      this.selectedOrder.push(order.id);
      this.selectedOrderName.push(order.branch_office.name);
    } else {
      // Si ya está en la lista, quítalo
      this.selectedOrder.splice(index, 1);
      this.selectedOrderName.splice(indexName, 1);
    }

    // Actualizar el valor del campo 'locations' en el formulario
    this.courseForm.patchValue({ orders: this.selectedOrder });
    this.visualForm.patchValue({ orders: this.selectedOrderName });

    // Marcar el formulario como válido si se han seleccionado locations
    if (this.selectedOrder.length > 0) {
      this.courseForm.get('orders')?.setValidators(Validators.required);
      this.courseForm.get('orders')?.updateValueAndValidity();
    } else {
      this.courseForm.get('orders')?.clearValidators();
      this.courseForm.get('orders')?.updateValueAndValidity();
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

  fetchPropaneTrucks() {
    this.propaneTruckService.getAll().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.propaneTrucks = response.data;
          this.filteredpropaneTrucks = this.courseForm.get('propane_truck')!.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        } else {
          this.toastr.info('No hay auto tanques disponibles');
        }
      },
      error => {
        console.error('Error al obtener auto tanques:', error);
      }
    );
  }

  updatePropaneTruck(id: any) {
    const status = {
      status: 'EN CURSO'
    }
    this.propaneTruckService.updateStatus(id, status).subscribe(
      response => {
        console.log('response', response);

        if (response.statusCode === 200) {
        } else {
          this.toastr.warning('Ocurrió un error al actualizar el auto tanque');
        }
      },
      error => {
        this.toastr.error('Ha ocurrido un error al actualizar el auto tanque', error);
      }
    );
  }

  onSubmit() {
    this.loadingDialogRef = this.dialogService.openLoadingDialogSmall();
    // Obtener el valor actual del formulario
    const formValue = this.courseForm.value;

    // Transformar la fecha al formato "YYYY-MM-DD"
    if (formValue.fecha) {
      const date = new Date(formValue.fecha);
      formValue.fecha = date.toISOString().split('T')[0];
    }

    if (this.courseForm.valid) {
      this.courseService.create(formValue).subscribe(
        response => {          
          if (response.statusCode === 201) {
            this.toastr.success('Derrotero creado exitosamente', 'Información');
            this.dialogRef.close();
            this.loadingDialogRef.close(); 
          } else {
            this.toastr.warning('Ocurrió un error al crear el derrotero');
          }
        },
        error => {
          this.toastr.error('Ha ocurrido un error al crear el derrotero', error);
          this.loadingDialogRef.close(); 
        }
      );
    } else {
      this.toastr.warning('Por favor, complete los campos requeridos');
      this.loadingDialogRef.close(); 
    }
  }

  toCreatePropaneTrucks() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreatePropaneTruckComponent, {
          width: '750px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchPropaneTrucks();
        });
      }
    });
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

  toCreateUser() {

  }

  toCourses() {
    this.router.navigate(['/poseidon/courses/admin']);
  }

}
