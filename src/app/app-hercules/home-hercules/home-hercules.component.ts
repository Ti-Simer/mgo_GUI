import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/hercules-services/data.service';

@Component({
  selector: 'app-home-hercules',
  templateUrl: './home-hercules.component.html',
  styleUrls: ['./home-hercules.component.scss'],
})
export class HomeHerculesComponent implements OnInit {

  data: any[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.findLatestData();
  }

  findLatestData() {
    this.dataService.findLatestData().subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.data = response.data;
      }
    });
  }

}
