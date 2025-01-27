import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PropaneTruckService } from 'src/app/services/poseidon-services/propane-truck.service';
import { UsuarioService } from 'src/app/services/poseidon-services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateUserComponent } from '../../usuarios/dialog-create-user/dialog-create-user.component';

@Component({
  selector: 'app-propane-truck-edit',
  templateUrl: './propane-truck-edit.component.html',
  styleUrls: ['./propane-truck-edit.component.scss']
})
export class PropaneTruckEditComponent {
  private languageSubscription!: Subscription;

  @ViewChild('plateInput') plateInput!: ElementRef;
  @ViewChild('myInput') searchInput!: ElementRef;
  @Input() propaneTruckId: any;

  updateForm: FormGroup;

  operators: any[] = [];
  propaneTruck: any[] = [];
  selectedOperator: any[] = [];
  previousSelectedOperator: any[] = [];

  operatorInput = false;
  multipleSelection = false;

  constructor(
    private route: ActivatedRoute,
    private propaneTruckService: PropaneTruckService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PropaneTruckEditComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      plate: [null, Validators.required],
      capacity: [null, Validators.required],
      operator: [null, Validators.required],
      factor: [null, Validators.required],
    });

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toPropaneTrucks();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    this.getPropaneTruck();
  }

  ngAfterViewInit() {
    this.initializeSearchFilter();
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#tableOperators tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  toggleInputOperator() {
    this.operatorInput = !this.operatorInput;
  }

  toggleMultipleSelection() {
    this.multipleSelection = !this.multipleSelection;
  }

  onPlateInputChange() {
    const inputValue = this.plateInput.nativeElement.value;
    this.plateInput.nativeElement.value = inputValue.toUpperCase();
  }

  getPropaneTruck() {
    this.propaneTruckService.getById(this.propaneTruckId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.propaneTruck = response.data;
          this.patchUpdateForm(this.propaneTruck);

        } else {
          this.toastr.warning(`Ha ocurrido un problema al consultar el Auto Tanque`, response.message);
        }
      }, (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar el Auto Tanque ${error}`);
      }
    );
  }

  patchUpdateForm(data: any) {
    this.updateForm.patchValue({
      plate: data.plate,
      capacity: data.capacity,
      operator: data.operator,
      factor: data.factor * 100
    });

    this.fetchOperators();

    if (data.operator.length > 0) {
      for (let i = 0; i < data.operator.length; i++) {
        this.operators.push(data.operator[i]);
      }
    }

    console.log(this.updateForm.value);
    this.selectedOperator = this.updateForm.value.operator.map((operator: { id: any; }) => operator.id);
    this.previousSelectedOperator = [...this.selectedOperator];
  }

  fetchOperators() {
    this.usuarioService.listOperators().subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.operators = response.data;
        } else {
          this.toastr.warning('Ha ocurrido un problema al consultar los opearios', response.message);
        }
      },
      (error) => {
        this.toastr.error(`Ha ocurrido un error al consultar los operarios ${error}`);
      }
    );
  }

  onOperatorChange(operator: any) {
    const index = this.selectedOperator.indexOf(operator.id);

    if (index === -1) {
      // Si no se encuentra en la lista, agrégalo
      this.selectedOperator.push(operator.id);
    } else {
      // Si ya está en la lista, quítalo
      this.selectedOperator.splice(index, 1);
    }

    this.updateForm.patchValue({ operator: this.selectedOperator });

    if (this.selectedOperator.length > 0) {
      this.updateForm.get('operator')?.setValidators(Validators.required);
      this.updateForm.get('operator')?.updateValueAndValidity();
    } else {
      this.updateForm.get('operator')?.clearValidators();
      this.updateForm.get('operator')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.updateForm.valid) {

      this.updateForm.patchValue({
        factor: this.updateForm.value.factor / 100
      });

      if (this.selectedOperator.length === 0) {
        this.toastr.warning('Debe seleccionar al menos un operario', 'Advertencia');
        return;
      }

      this.propaneTruckService.update(this.propaneTruckId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`El Auto Tanque ${response.data.plate} ha sido actualizado satisfactoriamente`, 'Exito!')
            this.dialogRef.close();
          } else {
            this.toastr.warning('Ha ocurrido un problema al editar el Auto Tanque', response.message);
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un problema al editar el Auto Tanque ${error}`);
        }
      );
    }
  }

  toCreateOperators() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateUserComponent, {
          width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchOperators();
        });
      }
    });
  }

  toPropaneTrucks() {
    this.router.navigate(['/poseidon/propane-trucks/list']);
  }

}
