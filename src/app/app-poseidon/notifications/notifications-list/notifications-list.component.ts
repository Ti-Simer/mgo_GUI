import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/poseidon-services/notification.service';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent {
  private languageSubscription!: Subscription;

  @ViewChild('myInput') searchInput!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  notificationForm: FormGroup;
  toggleOn: string = 'assets/images/toggle-on.svg';
  toggleOff: string = 'assets/images/toggle-off.svg';

  notifications: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang(this.languageService.getLanguage());
    
    this.authService.readChecker().subscribe(flag => {      
      if (!flag) {
        this.toHome();
        toastr.warning('No tienes permisos para leer esta información');
      }
    });

    this.notificationForm = this.formbuilder.group({
      status: ['']
    })
  }

  ngOnInit(): void {
    this.fetchNotifications();
    this.initializeSearchFilter();
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        // Actualizar los datos de la tabla según la página seleccionada
      });
    }
  }

  // Método para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: any) => {
        this.onPageChange(event);
      });

      this.initializeSearchFilter();
    }
  }

  fetchNotifications() {
    this.isLoading = true;
    this.notificationService.getAll().subscribe(
      (response) => {
        this.isLoading = false;
        if (response.statusCode == 200) {
          this.notifications = response.data.sort((a: any, b: any) => {
            let dateA = new Date(a.create); // o a.update dependiendo de qué fecha quieres usar
            let dateB = new Date(b.create); // o b.update dependiendo de qué fecha quieres usar
            return dateB.getTime() - dateA.getTime(); // Ordena en orden descendente
          });
        } else {
          this.router.navigate(['/poseidon/home']);
          this.toastr.info('No se han encontrado notificaciones', 'Información');
        }
      },
      (error) => {
        console.error('Error al obtener las notificaciones:', error);
      }
    );
  }

  initializeSearchFilter() {
    if (this.searchInput) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      const value = inputElement.value.toLowerCase();
      const tableRows = document.querySelectorAll('#myTable tr');

      tableRows.forEach((row) => {
        const rowText = row.textContent!.toLowerCase();
        (row as HTMLElement).style.display = rowText.includes(value) ? 'table-row' : 'none';
      });
    }
  }

  readUnreadNotification(notification: any) {
    if (notification.status == 'LEIDO') {
      this.notificationForm.get('status')?.setValue('NO LEIDO');
    }

    if (notification.status == 'NO LEIDO') {
      this.notificationForm.get('status')?.setValue('LEIDO');
    }

    const notificationData = this.notificationForm.value;

    this.notificationService.update(notification.id, notificationData).subscribe(
      (response) => {
        this.fetchNotifications();
      },
      (error) => {
        console.error('Error al leer la notificación:', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.notifications.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.notifications.sort((a: any, b: any) => {
      let valueA = a;
      let valueB = b;

      // Navega a través de las claves para obtener el valor final
      keys.forEach(key => {
        if (key.includes('[')) {
          const [arrayKey, index] = key.split(/[\[\]]/).filter(Boolean);
          valueA = valueA[arrayKey][index];
          valueB = valueB[arrayKey][index];
        } else {
          valueA = valueA[key];
          valueB = valueB[key];
        }
      });

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0; // Los valores son iguales
    });
  }

  toViewNotification(id: any) {
    this.router.navigate(['/poseidon/notifications/view', this.authService.encryptData(id)]);
  }

  toHome() {
    this.router.navigate(['/poseidon/home']);
  }

  toReports() {
    this.router.navigate(['/poseidon/reports/list']);
  }
}
