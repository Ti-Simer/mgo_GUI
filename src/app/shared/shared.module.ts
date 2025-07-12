import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { CustomToastComponent } from './custom-toast/custom-toast/custom-toast.component';
import { MenuHomeComponent } from './menu-home/menu-home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationsComponent } from './notifications/notifications.component';
import { MenuAtheneaComponent } from './menu-athenea/menu-athenea.component';
import { MenuFenixComponent } from './menu-fenix/menu-fenix.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TruncatePipe } from './truncate.pipe';
import { MenuPoseidonComponent } from './menu-poseidon/menu-poseidon.component';
import { MenuHerculesComponent } from './menu-hercules/menu-hercules.component';
import { PositiveNumberPipe } from './positive-number.pipe';

import {
  LucideAngularModule,
  Bell,
  User,
  LogOut,
  Globe,
  Dot,
  Languages
} from 'lucide-angular';
import { FooterLiteComponent } from './footer-lite/footer-lite.component';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    MenuComponent,
    SidebarComponent,
    FooterComponent,
    CustomToastComponent,
    MenuHomeComponent,
    NotificationsComponent,
    MenuAtheneaComponent,
    MenuFenixComponent,
    TruncatePipe,
    MenuPoseidonComponent,
    MenuHerculesComponent,
    PositiveNumberPipe,
    FooterLiteComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    LucideAngularModule.pick({
      Bell,
      User,
      LogOut,
      Globe,
      Dot,
      Languages
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    MenuComponent,
    SidebarComponent,
    FooterComponent,
    MenuHomeComponent,
    MenuAtheneaComponent,
    MenuFenixComponent,
    TruncatePipe,
    NotificationsComponent,
    MenuPoseidonComponent,
    MenuHerculesComponent,
    PositiveNumberPipe,
    FooterLiteComponent
  ]
})
export class SharedModule { }
