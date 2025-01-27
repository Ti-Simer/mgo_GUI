import { Component, OnInit } from '@angular/core';
import { CityService } from 'src/app/services/hercules-services/city.service';
import { ZoneService } from 'src/app/services/hercules-services/zone.service';
import { BranchOfficeService } from 'src/app/services/hercules-services/branch-office.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DeviceService } from 'src/app/services/hercules-services/device.service';
import { ToastrService } from 'ngx-toastr';
import { ResDataService } from 'src/app/services/hercules-services/res-data.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'; // Importar el operador map
import { SensorService } from 'src/app/services/hercules-services/sensor.service';
import { DialogResumeDataComponent } from './dialog-resume-data/dialog-resume-data.component';
import { MatDialog } from '@angular/material/dialog';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
  path?: string;
  color?: string;
}

interface MenuNode {
  name: string;
  icon?: string;
  path?: string;
  children?: MenuNode[];
  color?: string;
}

interface City {
  id_ciudad: number;
  ciudad: string;
  created: string;
  estado: number;
  observacion: string;
  updated: string;
}

interface Zone {
  id_zona: number;
  zona: string;
  id_ciudad: number;
  created: string;
  estado: number;
  observacion: string;
  updated: string;
}

interface BranchOffice {
  id_sucursal: number;
  sucursal: string;
  id_zona: number;
  direccion: string;
  telefono: string;
  created: string;
  estado: number;
  observacion: string;
  updated: string;
}

@Component({
  selector: 'app-home-hercules',
  templateUrl: './home-hercules.component.html',
  styleUrls: ['./home-hercules.component.scss'],
})
export class HomeHerculesComponent implements OnInit {
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      path: node.path,
      color: node.color,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<MenuNode, ExampleFlatNode, ExampleFlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  cities: City[] = [];
  zones: Zone[] = [];
  branchOffices: BranchOffice[] = [];
  devices: any[] = [];
  sensors: any[] = [];

  constructor(
    private cityService: CityService,
    private zoneService: ZoneService,
    private branchOfficeService: BranchOfficeService,
    private deviceService: DeviceService,
    private resDataService: ResDataService,
    private sensorService: SensorService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.treeBuilder();
  }

  treeBuilder() {
    forkJoin([
      this.cityService.findAll(),
      this.zoneService.findAll(),
      this.branchOfficeService.findAll()
    ]).subscribe(([citiesResponse, zonesResponse, branchOfficesResponse]) => {
      if (citiesResponse.statusCode === 200) {
        this.cities = citiesResponse.data;
      }
      if (zonesResponse.statusCode === 200) {
        this.zones = zonesResponse.data;
      }
      if (branchOfficesResponse.statusCode === 200) {
        this.branchOffices = branchOfficesResponse.data;
      }
      this.buildTree();
    });
  }

  buildTree() {
    const treeData: MenuNode[] = this.cities.map(city => {
      const cityZones = this.zones.filter(zone => zone.id_ciudad === city.id_ciudad);
      const cityChildren = cityZones.map(zone => {
        const zoneBranchOffices = this.branchOffices.filter(branchOffice => branchOffice.id_zona === zone.id_zona);
        const zoneChildren = zoneBranchOffices.map(branchOffice => ({
          name: branchOffice.sucursal,
          path: `${branchOffice.id_sucursal}`,
          icon: 'building2',
          color: '#5e5e5e'
        }));
        return {
          name: zone.zona,
          children: zoneChildren,
          icon: 'map',
          color: '#5e5e5e'
        };
      });
      return {
        name: city.ciudad,
        children: cityChildren,
        icon: 'map-pin',
        color: '#5e5e5e'
      };
    });

    this.dataSource.data = treeData;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  fetchCities() {
    this.cityService.findAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.cities = response.data;
          console.log(this.cities);
        }
      }
    );
  }

  fetchZones() {
    this.zoneService.findAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.zones = response.data;
          console.log(this.zones);
        }
      }
    );
  }

  fetchBranchOffices() {
    this.branchOfficeService.findAll().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.branchOffices = response.data;
          console.log(this.branchOffices);
        }
      }
    );
  }

  navigate(node: any) {
    this.deviceService.findByBranchOffice(node.path).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.devices = response.data;
        } else {
          this.toastr.warning('No se encontraron dispositivos', 'Advertencia');
        }
      }
    );
  }

  toResumeData(sensor: any) {
    const dialogRef = this.dialog.open(DialogResumeDataComponent, {
      width: '1400px',
      data: { 
        id_device: sensor.id_device, 
        sensor: sensor.sensor 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchCities();
    });
  }
}
