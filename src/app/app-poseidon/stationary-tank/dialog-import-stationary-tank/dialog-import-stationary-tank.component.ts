import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-import-stationary-tank',
  templateUrl: './dialog-import-stationary-tank.component.html',
  styleUrls: ['./dialog-import-stationary-tank.component.scss']
})

export class DialogImportStationaryTankComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogImportStationaryTankComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
