import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { ClientService } from 'src/app/services/poseidon-services/client.service';
import { OccupationService } from 'src/app/services/poseidon-services/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCreateOcupationsComponent } from '../../occupations/dialog-create-ocupations/dialog-create-ocupations.component';

@Component({
  selector: 'app-clients-create',
  templateUrl: './clients-create.component.html',
  styleUrls: ['./clients-create.component.scss']
})
export class ClientsCreateComponent {
  private languageSubscription!: Subscription;

  clientForm: FormGroup;
  branchOffices: any;
  occupations: any[] = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private branchOfficeService: BranchOfficesService,
    private clientService: ClientService,
    private occupationService: OccupationService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ClientsCreateComponent>
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.clientForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      occupation: [null, Validators.required],
      cc: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
    });

    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toClients();
        toastr.warning('No tienes permisos para crear');
      }
    });
  }

  ngOnInit(): void {
    this.fetchOccupations();
  }

  fetchOccupations() {
    this.occupationService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.occupations = response.data;
        }
      }, (error) => {
        console.log("Ha ocurrido un error al consultar las ocupaciones: ", error);
      }

    );
  }

  onSubmit() {
    console.log(this.clientForm.value);
    if (this.clientForm.valid) {
      this.clientService.create(this.clientForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`El cliente ${response.data.firstName} ${response.data.lastName} ha sido creado exitosamente`);
            this.dialogRef.close();
          }
        }, (error) => {
          this.toastr.error(`Ha ocurrido un error al crear el usuario ${error}`);
        }
      );
    }
  }

  toClients() {
    this.router.navigate(['/poseidon/client/list']);
  }

  toCreateOccupations() {
    this.authService.writeChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para crear');
      } else {
        const dialogRef = this.dialog.open(DialogCreateOcupationsComponent, {
          width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
          this.fetchOccupations();
        });
      }
    });
  }

}
