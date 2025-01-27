import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { ClientService } from 'src/app/services/poseidon-services/client.service';
import { OccupationService } from 'src/app/services/poseidon-services/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogCreateOcupationsComponent } from '../../occupations/dialog-create-ocupations/dialog-create-ocupations.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clients-edit',
  templateUrl: './clients-edit.component.html',
  styleUrls: ['./clients-edit.component.scss']
})
export class ClientsEditComponent {
  private languageSubscription!: Subscription;
  @Input() clientId: any;

  updateForm: FormGroup;
  branchOffices: any;
  occupations: any;
  client: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private branchOfficesService: BranchOfficesService,
    private clientService: ClientService,
    private occupationService: OccupationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.updateForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      occupation: [null, Validators.required],
      cc: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
    });

    this.authService.editChecker().subscribe(flag => {
      if (!flag) {
        this.toClients();
        toastr.warning('No tienes permisos para editar');
      }
    });
  }

  ngOnInit(): void {
    
    this.fetchOccupations();
    this.getClient();
  }

  fetchOccupations() {
    this.occupationService.getAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.occupations = response.data;
        } else {
          this.toastr.info('No se han creado cargos, por favor crea cargos para poder crear clientes');
          this.router.navigate(['/poseidon/occupation/create']);
        }
      }, (error) => {
        console.log("Ha ocurrido un error al consultar las ocupaciones: ", error);
      }

    );
  }

  getClient() {
    this.clientService.getById(this.clientId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.client = response.data

          this.updateForm.patchValue({
            firstName: this.client.firstName,
            lastName: this.client.lastName,
            occupation: this.client.occupation[0].id,
            cc: this.client.cc,
            email: this.client.email,
            phone: this.client.phone,
          })
        } else {
          this.toastr.warning(response.message, 'Ha ocurrido un problema al obtener la ciudad')
        }
      }, (error) => {
        console.error('Ha ocurrido un problema al obtener la ciudad: ', error);
      }
    );
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.clientService.update(this.clientId, this.updateForm.value).subscribe(
        response => {
          if (response.statusCode == 200) {
            this.toastr.success(`Cliente ${response.data.firstName} ${response.data.lastName} se actualizo satisfactoriamente`);
            this.toClients();
          } else {
            this.toastr.warning('Ha ocurrido un problema al actualizar el Cliente', response.message);
          }
        }, (error) => {
          console.log("Ha ocurrido un error al actualizar el Cliente", error);
        }
      );
    }
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

  toClients() {
    this.router.navigate(['/poseidon/client/list']);
  }

}
