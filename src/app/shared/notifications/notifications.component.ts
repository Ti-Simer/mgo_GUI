import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { DialogDetailsNotificationComponent } from 'src/app/app-poseidon/notifications/dialog-details-notification/dialog-details-notification.component';
import { MatDialog } from '@angular/material/dialog';

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
    private languageService: LanguageService,
    private dialog: MatDialog,
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
    const polling$ = timer(0, 10000); // Emite inmediatamente (0ms) y luego cada 10 segundos

    this.subscription = polling$
      .pipe(switchMap(() => this.notificationService.getUnread()))
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.notifications = response.data.sort((a: any, b: any) => {
              let dateA = new Date(a.create);
              let dateB = new Date(b.create);
              return dateB.getTime() - dateA.getTime();
            });
          }
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

  toViewNotification(notification: any) {
    this.authService.readChecker().subscribe(flag => {
      if (!flag) {
        this.toastr.warning('No tienes permisos para leer');
      } else {
        const dialogRef = this.dialog.open(DialogDetailsNotificationComponent, {
          width: '750px',
          data: { notificationId: notification.id }
        });
      }
    });
  }

  toNotifications() {
    this.router.navigate(['/poseidon/notifications/list']);
  }

}
