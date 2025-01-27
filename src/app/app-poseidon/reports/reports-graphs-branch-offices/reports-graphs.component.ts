import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BranchOfficesService } from 'src/app/services/poseidon-services/branch-offices.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-graphs',
  templateUrl: './reports-graphs.component.html',
  styleUrls: ['./reports-graphs.component.scss']
})
export class ReportsGraphsComponent {
  private languageSubscription!: Subscription;

  graphsForm: FormGroup
  graphs: any = [];

  branchOfficeCode: any;
  branchOffice: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private branchofficeService: BranchOfficesService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.graphsForm = this.formBuilder.group({
      graph: ['default', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.branchOfficeCode = authService.decryptData(params['id'])
    });

  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);

      switch (this.languageService.getLanguage()) {
        case 'es':
          this.graphs = [
            {
              name: "Ventas Cliente",
              subItems: [
                { name: "Informe de cargues" },
              ]
            },
            {
              name: "Rotación de tanque",
              subItems: [
                { name: "Cantidad de tanques" },
                { name: "Capacidad del tanque" }
              ]
            },
            {
              name: "Novedades de cargue",
              subItems: [
                { name: "Estado de cargues" },
              ]
            },
            {
              name: "Menú",
              subItems: [
                { name: "Pedidos" },
                { name: "Servicios" },
                { name: "Derroteros" },
                { name: "Ver detalles" },
                { name: "Volver" },
  
              ]
            }
          ]
          break;
  
        case 'en':
          this.graphs = [
            {
              name: "Client Sales",
              subItems: [
                { name: "Load report" },
              ]
            },
            {
              name: "Tank rotation",
              subItems: [
                { name: "Number of tanks" },
                { name: "Tank capacity" }
              ]
            },
            {
              name: "Load news",
              subItems: [
                { name: "Load status" },
              ]
            },
            {
              name: "Menu",
              subItems: [
                { name: "Orders" },
                { name: "Services" },
                { name: "Courses" },
                { name: "View details" },
                { name: "Back" },
  
              ]
            }
          ]
          break;
  
        case 'pt':
          this.graphs = [
            {
              name: "Vendas do cliente",
              subItems: [
                { name: "Relatório de carga" },
              ]
            },
            {
              name: "Rotação do tanque",
              subItems: [
                { name: "Número de tanques" },
                { name: "Capacidade do tanque" }
              ]
            },
            {
              name: "Novidades de carga",
              subItems: [
                { name: "Estado de carga" },
              ]
            },
            {
              name: "Cardápio",
              subItems: [
                { name: "Pedidos" },
                { name: "Serviços" },
                { name: "Cursos" },
                { name: "Ver detalhes" },
                { name: "Voltar" },
  
              ]
            }
          ]
          break;
  
        default:
          break;
      }
    });
    this.fetchBranchOffice();
  }

  fetchBranchOffice() {
    this.branchofficeService.getBranchOfficeById(this.branchOfficeCode).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.branchOffice = response.data;
        } else {
          console.log(response.message);
        }
      }, error => {
        console.error(error);
      }
    )
  }

  changeGraph(item: any) {
    if (item == "Pedidos" || item == "Orders" || item == "Pedidos") {
      this.router.navigate(['/poseidon/orders/list']);
      return;
    }
    if (item == "Servicios" || item == "Services" || item == "Serviços") {
      this.router.navigate(['/poseidon/request/list']);
      return;
    }
    if (item == "Derroteros" || item == "Courses" || item == "Cursos") {
      this.router.navigate(['/poseidon/courses/admin']);
      return;
    }
    if (item == "Volver" || item == "Back" || item == "Voltar") {
      this.router.navigate(['/poseidon/reports/list']);
      return;
    }

    if (item == "Ver detalles" || item == "View details" || item == "Ver detalhes") {
      this.router.navigate(['/poseidon/reports/bills/', this.authService.encryptData(this.branchOfficeCode)])
      return;
    }

    this.graphsForm.patchValue({
      graph: item
    });
  }

}
