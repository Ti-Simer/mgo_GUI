import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { DialogViewBillComponent } from '../../reports/bills/dialog-view-bill/dialog-view-bill.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications-details',
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.scss']
})
export class NotificationsDetailsComponent {
  private languageSubscription!: Subscription;

  updateForm: FormGroup;

  notification: any;
  notificationId: any;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());

    this.updateForm = this.formBuilder.group({
      status: ['']
    });

    this.route.params.subscribe(params => {
      this.notificationId = authService.decryptData(params['id']);
      this.fetchNotification();
    });

  }

  ngOnInit(): void {

    this.updateStatusNotification();
  }

  fetchNotification() {
    this.notificationService.getById(this.notificationId).subscribe(
      (response) => {
        this.notification = response.data;
      },
      (error) => {
        console.error('Error al obtener la notificación:', error);
      }
    );
  }

  updateStatusNotification() {
    this.updateForm.patchValue({
      status: 'LEIDO'
    });

    const updateData = this.updateForm.value;
    this.notificationService.update(this.notificationId, updateData).subscribe(
      (response) => {
        this.fetchNotification();
      },
      (error) => {
        console.error('Error al actualizar la notificación:', error);
      }
    );
  }

  delete(notification: any) {
    this.dialogService.openConfirmDialog(`¿Estás seguro de eliminar la notificación de ${notification.title} ?`)
      .subscribe(result => {
        if (result) {
          this.notificationService.delete(notification.id).subscribe(
            (response) => {
              if (response.statusCode === 200) {
                this.toastr.success(`Notificación ${notification.title} eliminada exitosamente`, 'Éxito');
                this.toNotifications();
              } else {
                this.toastr.error('Error al eliminar Notificación', response.message);
              }
            },
            (error) => {
              this.toastr.error('Error al eliminar Notificación', 'Error');
            }
          );
        }
      });
  }

  goToReview() {
    switch (this.notification.type) {
      case 'TABLET':
        this.router.navigate(['/poseidon/tablets/view/', this.authService.encryptData(this.notification.intercourse)]);
        break;

      case 'CARGUE':
        this.authService.readChecker().subscribe(flag => {
          if (!flag) {
            this.toastr.warning('No tienes permisos para leer esta información');
          } else {
            const dialogRef = this.dialog.open(DialogViewBillComponent, {
              width: '750px',
              data: { billId: this.notification.intercourse }
            });
          }
        });

        break;
    }
  }

  toNotifications() {
    this.router.navigate(['/poseidon/notifications/list']);
  }



}
