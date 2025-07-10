import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateBranchOfficeComponent } from '../../branch-offices/dialog-create-branch-office/dialog-create-branch-office.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingSmallDialogComponent } from 'src/app/dialog/loading-small-dialog/loading-small-dialog.component';

@Component({
  selector: 'app-orders-create',
  templateUrl: './orders-create.component.html',
  styleUrls: ['./orders-create.component.scss']
})
export class OrdersCreateComponent {
  private languageSubscription!: Subscription;
  private loadingDialogRef!: MatDialogRef<LoadingSmallDialogComponent>;
  selectedTab: 'listado' | 'manual' = 'listado';

  orderForm: FormGroup;
  selectedPayment: any;
  branch_office: any;
  branch_offices: any[] = [];
  filteredBranchOffices!: Observable<any[]>;
  branchOfficeInput = true;

  payment_type: any = [
    { name: "EFECTIVO" },
    { name: "CREDITO" },
    { name: "DEBITO" },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private branchOfficeService: BranchOfficesService,
    private orderService: OrdersService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toOrders();
        toastr.warning('No tienes permisos para crear');
      }
    });

    this.orderForm = this.formBuilder.group({
      payment_type: ['', Validators.required],
      branch_office_code: ['', Validators.required],
      validate_geofence: [true, Validators.required],
      validate_token: [true, Validators.required],
    });

  }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      payment_type: ['', Validators.required],
      branch_office_code: ['', Validators.required],
      validate_geofence: [true, Validators.required],
      validate_token: [true, Validators.required],
    });

    this.fetchBranchOffices();
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(lang => {
      this.translate.use(lang);
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.branch_offices.filter(branch_office => branch_office.name.toLowerCase().includes(filterValue));
  }

  displayFn(branch_office: any): string {
    return branch_office && branch_office.name ? `${branch_office.name} - ${branch_office.nit}` : '';
  }

  toggleInputClient() {
    this.branchOfficeInput = !this.branchOfficeInput;
  }

  getBranchOfficeById() {
    if (typeof this.orderForm.value.branch_office_code === 'object' && this.orderForm.value.branch_office_code !== null) {
      this.orderForm.value.branch_office_code = this.orderForm.value.branch_office_code.branch_office_code;
    }

    this.branchOfficeService.getBranchOfficeById(this.orderForm.value.branch_office_code).subscribe(
      (response) => {
        this.branch_office = response.data;
      },
      (error) => {
        console.error('Error al obtener el establecimiento por ID:', error);
      }
    );
  }

  fetchBranchOffices() {
    this.loadingDialogRef = this.dialogService.openLoadingDialogSmall();
    this.branchOfficeService.getAlls().subscribe(
      (response) => {
        this.branch_offices = response.data;
        this.filteredBranchOffices = this.orderForm.get('branch_office_code')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.loadingDialogRef.close(); 
      },
      (error) => {
        console.error('Error al obtener los establecimientos:', error);
        this.loadingDialogRef.close(); 
      }
    );
  }

  resetForm() {
    this.orderForm.reset();
    this.selectedPayment = null;
    this.branch_office = null;
    this.branch_offices = [];
    this.filteredBranchOffices = new Observable<any[]>();
    this.branchOfficeInput = true;
    this.fetchBranchOffices(); // Volver a cargar las branch_offices

    this.orderForm = this.formBuilder.group({
      payment_type: ['', Validators.required],
      branch_office_code: ['', Validators.required],
      validate_geofence: [true, Validators.required],
      validate_token: [true, Validators.required],
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
        if (typeof this.orderForm.value.branch_office_code === 'object' && this.orderForm.value.branch_office_code !== null) {
           this.orderForm.value.branch_office_code = this.orderForm.value.branch_office_code.branch_office_code;
        }
      this.orderService.create(this.orderForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Pedido ${response.data.folio} en ${this.branch_office.name} ha sido creado satisfactoriamente`, `Exito!`);
            this.resetForm();
          } else {
            console.log('Error al crear el Pedido:', response.message);
            this.toastr.warning(response.message, 'Ha ocurrido un problema al crear el Pedido');
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al crear el Pedido: ${error}`);
        }
      );
    }
  }

  toCreateBranchOffices() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateBranchOfficeComponent, {
          width: '1000px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchBranchOffices();
        });
      }
    });
  }

  toOrders() {
    this.router.navigate(['/poseidon/orders/list']);
  }

}
