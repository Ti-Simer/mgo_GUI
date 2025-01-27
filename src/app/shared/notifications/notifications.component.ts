import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  private subscription!: Subscription;
  private languageSubscription!: Subscription;

  notifications: any;
  flag: boolean = false;
  
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.authService.readChecker().subscribe(flag => {
      this.flag = flag;
      if (!this.flag) {
        this.toastr.warning('No tienes permisos para leer esta información');
      } else {
        this.fetchNotifications();
      }
    });
  }

  ngOnInit() {    
  }

  async fetchNotifications() {
    const polling$ = interval(500);

    this.subscription = polling$
      .pipe(switchMap(() => this.notificationService.getUnread()))
      .subscribe(
        response => {          
          this.notifications = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.create); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.create); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });
        },
        error => {
          console.error('Error al obtener las notificaciones:', error);
        }
      );
  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toViewNotification(id: any) {
    this.router.navigate(['/poseidon/notifications/view', this.authService.encryptData(id)]);
  }

  toNotifications() {
    this.router.navigate(['/poseidon/notifications/list']);
  }

}
