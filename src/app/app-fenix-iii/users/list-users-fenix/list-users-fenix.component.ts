import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/fenix-services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-users-fenix',
  templateUrl: './list-users-fenix.component.html',
  styleUrls: ['./list-users-fenix.component.scss']
})
export class ListUsersFenixComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [25, 50, 100]; // Opciones de tamaño de página
  pageSize: number = 25; // Tamaño de página predeterminado
  pageIndex: number = 0; // Página actual

  @ViewChild('myInput') searchInput!: ElementRef; // Obtiene una referencia al elemento de entrada de búsqueda
  users: any[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
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

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.findAll().subscribe(
      (response) => {
        this.isLoading = false;
        this.users = response.data; // Asigna la respuesta a la variable de usuarios        
      },
      (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  setPageSizeToTotal() {
    this.pageSize = this.users.length;
  }

  sortData(data: string) {
    const keys = data.split('.'); // Divide la cadena en partes
    this.users.sort((a: any, b: any) => {
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

  toViewUser(id: string) { }

  deleteUser(id: string) { }

  toEditUser(id: string) { 
    this.router.navigate(['fenix/users/edit-user-fenix/', this.authService.encryptData(id)]);
  }

  toHome() {
    this.router.navigate(['/fenix']);
  }

  toCreateUser(){
    this.router.navigate(['fenix/users/create-user-fenix']);
  }
}
