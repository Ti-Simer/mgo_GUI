import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-graphs-propane-trucks',
  templateUrl: './reports-graphs-propane-trucks.component.html',
  styleUrls: ['./reports-graphs-propane-trucks.component.scss']
})
export class ReportsGraphsPropaneTrucksComponent {
  private languageSubscription!: Subscription;

  graphsForm: FormGroup
  graphs: any = []

  propaneTruckId: any;

  collapsed = true;
  private menuSub!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.graphsForm = this.formBuilder.group({
      graph: ['default', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.propaneTruckId = authService.decryptData(params['id'])
    }
    );
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguageObservable().subscribe(newLanguage => {
      this.translate.use(newLanguage);
      this.translate.setDefaultLang(newLanguage);

      this.menuSub = this.authService.menuExpanded$.subscribe(expanded => {
        this.collapsed = expanded; // O usa collapsed = !expanded si collapsed significa "colapsado"
      });

      switch (this.languageService.getLanguage()) {
        case 'es':
          this.graphs = [
            {
              name: "Reporte de Rutas",
              subItems: [
                { name: "Informe de cargues" },
              ]
            },
            {
              name: "Menú",
              subItems: [
                { name: "Pedidos" },
                { name: "Servicios" },
                { name: "Derroteros" },
                { name: "Volver" },

              ]
            }
          ]
          break;

        case 'en':
          this.graphs = [
            {
              name: "Routes Report",
              subItems: [
                { name: "Load report" },
              ]
            },
            {
              name: "Menu",
              subItems: [
                { name: "Orders" },
                { name: "Services" },
                { name: "Courses" },
                { name: "Back" },
              ]
            }
          ]
          break;

        case 'pt':
          this.graphs = [
            {
              name: "Relatório de Rotas",
              subItems: [
                { name: "Relatório de carga" },
              ]
            },
            {
              name: "Cardápio",
              subItems: [
                { name: "Pedidos" },
                { name: "Serviços" },
                { name: "Cursos" },
                { name: "Voltar" },
              ]
            }
          ]
          break;

        default:
          break;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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

    this.graphsForm.patchValue({
      graph: item
    });
  }

}
