import { Component, ElementRef, ViewChild } from '@angular/core';
import { LogReportService } from 'src/app/services/poseidon-services/log-report.service';

@Component({
  selector: 'app-log-report-all',
  templateUrl: './log-report-all.component.html',
  styleUrls: ['./log-report-all.component.scss']
})
export class LogReportAllComponent {
  items: any[] = [];
  paginatedItems: any[] = [];

  pageIndex: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 100];

  @ViewChild('searchInput') searchInput!: ElementRef;

  public Math = Math;
  criticalityCounts: any;
  criticalityLow: any;
  criticalityMedium: any;
  criticalityHigh: any;
  viewMode: 'grid' | 'list' = 'grid';
  selectedCriticality: number | null = null;

  constructor(private logReportService: LogReportService) { }

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    const pageData = {
      pageData: {
        page: 1,
        limit: 1000
      }
    };

    this.logReportService.getAll(pageData).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.items = response.data.logReports;
          this.updatePaginatedItems();
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error al obtener reportes:', error);
      }
    );
  }
  
  updatePaginatedItems(): void {
    let filtered = this.items;

    // Filtrado por criticidad
    if (this.selectedCriticality !== null) {
      filtered = filtered.filter(
        item => item.route_event.criticality === this.selectedCriticality
      );
    }

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedItems = filtered.slice(start, end);
  }

  get totalPages(): number {
    let filtered = this.items;

    if (this.selectedCriticality !== null) {
      filtered = filtered.filter(
        item => item.route_event.criticality === this.selectedCriticality
      );
    }

    return Math.ceil(filtered.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 0) page = 0;
    if (page >= this.totalPages) page = this.totalPages - 1;
    this.pageIndex = page;
    this.updatePaginatedItems();
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.updatePaginatedItems();
  }

  setPageSizeToTotal(): void {
    this.pageSize = this.items.length;
    this.pageIndex = 0;
    this.updatePaginatedItems();
  }

  initializeSearchFilter(): void {
    const value = this.searchInput?.nativeElement.value.toLowerCase() || '';
    let filtered = this.items;

    // Filtrar por criticidad si aplica
    if (this.selectedCriticality !== null) {
      filtered = filtered.filter(
        item => item.route_event.criticality === this.selectedCriticality
      );
    }

    // Filtrar por texto
    filtered = filtered.filter(item =>
      (item.name?.toLowerCase().includes(value) ||
        item.email?.toLowerCase().includes(value) ||
        item.status?.toLowerCase().includes(value))
    );

    this.paginatedItems = filtered.slice(0, this.pageSize);
    this.pageIndex = 0;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  filterByCriticality(level: number) {
    if (this.selectedCriticality === level) {
      // Si se vuelve a hacer clic en el mismo, desactiva el filtro
      this.selectedCriticality = null;
    } else {
      this.selectedCriticality = level;
    }
    this.pageIndex = 0;
    this.updatePaginatedItems();
  }

  DownloadExcel() {
    // Lógica de descarga
  }

  editItem(item: any): void {
    console.log('Editar item:', item);
  }

  deactivateItem(item: any): void {
    console.log('Desactivar item:', item);
  }

  someImport(): void {
    console.log('Importar datos');
  }

  toCreateItem(): void {
    console.log('Crear nuevo ítem');
  }

  makeQuerySearch() {
    // Búsqueda avanzada
  }

  fetchOrders() {
    // Restablecer filtros
  }

  infoFilter() {
    // Otros filtros
  }

  // FUNCIÓN PARA CONTAR EVENTOS POR CRITICIDAD
  getCriticalityCount(level: number): number {
    return this.items.filter(item => item.route_event.criticality === level).length;
  }
}
