import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { GoogleMapsModule } from '@angular/google-maps';
import { Loader } from "@googlemaps/js-api-loader";
import { NgChartsModule } from 'ng2-charts';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LandingPageLegalWarningComponent } from './landing-page/landing-page-legal-warning/landing-page-legal-warning.component';
import { LandingPageUsComponent } from './landing-page/landing-page-us/landing-page-us.component';
import { LandingPageContactComponent } from './landing-page/landing-page-contact/landing-page-contact.component';
import { LandingPageContactFormComponent } from './landing-page/landing-page-contact-form/landing-page-contact-form.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PlataformsComponent } from './plataforms/plataforms.component';
import { PoseidonInfoComponent } from './plataforms/poseidon-info/poseidon-info.component';
import { AtheneaInfoComponent } from './plataforms/athenea-info/athenea-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InfoDialogComponent } from './dialog/info-dialog/info-dialog.component';
import { InfoConfirmDialogComponent } from './dialog/info-confirm-dialog/info-confirm-dialog.component';
import { LoadingDialogComponent } from './dialog/loading-dialog/loading-dialog.component';
import { LoadingSmallDialogComponent } from './dialog/loading-small-dialog/loading-small-dialog.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

import {
  LucideAngularModule,
  Send,
  Map,
  MapPinned,
  Mail,
  Smartphone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  NotebookPen,
  Tags,
  BetweenHorizontalStart,
  PieChart,
  Cpu,
  Eye,
  ListTodo,
  HelpCircle,
  Download,
  ArrowBigLeftDash,
  FileDown,
  ChevronDown,
  Home,
  LucideArrowRightCircle,
  LogOut,
  User,
  Bell,
  ChevronRight,
  Dot,
  LucideGanttSquare,
  CircleUserRound,
  Factory,
  HeartHandshake,
  SendIcon,
  Bolt,
  MessageSquareWarning
} from 'lucide-angular';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const loader = new Loader({
  apiKey: "AIzaSyB__EOk3UXcZgFa6cZ6DKBS_kx5ipBkJck",
  version: "weekly",
});

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ConfirmDialogComponent,
    LandingPageLegalWarningComponent,
    LandingPageUsComponent,
    LandingPageContactComponent,
    LandingPageContactFormComponent,
    PlataformsComponent,
    PoseidonInfoComponent,
    AtheneaInfoComponent,
    InfoDialogComponent,
    InfoConfirmDialogComponent,
    LoadingDialogComponent,
    LoadingSmallDialogComponent,
  ],
  imports: [
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-top-right',
      newestOnTop: false,
    }),
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    NgxBootstrapIconsModule,
    GoogleMapsModule,
    NgChartsModule,
    MatPaginatorModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    NgxMaterialTimepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatNativeDateModule,
    LucideAngularModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTreeModule,
    SharedModule,
    LucideAngularModule.pick({
      Send,
      Map,
      MapPinned,
      Mail,
      Smartphone,
      Facebook,
      Twitter,
      Linkedin,
      Instagram,
      NotebookPen,
      Tags,
      BetweenHorizontalStart,
      PieChart,
      Cpu,
      Eye,
      ListTodo,
      HelpCircle,
      Download,
      ArrowBigLeftDash,
      FileDown,
      ChevronDown,
      Home,
      LucideArrowRightCircle,
      LogOut,
      User,
      Bell,
      ChevronRight,
      Dot,
      LucideGanttSquare,
      CircleUserRound,
      Factory,
      HeartHandshake,
      SendIcon,
      Bolt,
      MessageSquareWarning
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    provideAnimations(),
    provideToastr(),
    {
      provide: 'googleMapsApiKey',
      useValue: 'AIzaSyB__EOk3UXcZgFa6cZ6DKBS_kx5ipBkJck',
    },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
