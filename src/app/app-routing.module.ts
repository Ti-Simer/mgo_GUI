import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingPageLegalWarningComponent } from './landing-page/landing-page-legal-warning/landing-page-legal-warning.component';
import { LandingPageUsComponent } from './landing-page/landing-page-us/landing-page-us.component';
import { LandingPageContactComponent } from './landing-page/landing-page-contact/landing-page-contact.component';
import { LandingPageContactFormComponent } from './landing-page/landing-page-contact-form/landing-page-contact-form.component';
import { PlataformsComponent } from './plataforms/plataforms.component';
import { PoseidonInfoComponent } from './plataforms/poseidon-info/poseidon-info.component';
import { AtheneaInfoComponent } from './plataforms/athenea-info/athenea-info.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'fenix', loadChildren: () => import('./app-fenix-iii/app-fenix-iii.module').then(m => m.AppFenixIIIModule) },
  { path: 'poseidon', loadChildren: () => import('./app-poseidon/app-poseidon.module').then(m => m.AppPoseidonModule) },
  { path: 'athenea', loadChildren: () => import('./app-athenea/app-athenea.module').then(m => m.AppAtheneaModule) },
  { path: 'hercules', loadChildren: () => import('./app-hercules/app-hercules.module').then(m => m.AppHerculesModule) },

  { path: 'legal-warning', component: LandingPageLegalWarningComponent },
  { path: 'us', component: LandingPageUsComponent },
  { path: 'contact', component: LandingPageContactComponent },
  { path: 'contact/form', component: LandingPageContactFormComponent },
  { path: 'plataforms', component: PlataformsComponent },
  { path: 'plataforms/poseidon-info', component: PoseidonInfoComponent },
  { path: 'plataforms/athenea-info', component: AtheneaInfoComponent },
];

@NgModule({
  //imports: [RouterModule.forRoot(routes, { useHash: true })], // Este import se usa para distribución
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
