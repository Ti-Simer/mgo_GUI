import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-stationary-tank',
  templateUrl: './dialog-create-stationary-tank.component.html',
  styleUrls: ['./dialog-create-stationary-tank.component.scss']
})
export class DialogCreateStationaryTankComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateStationaryTankComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
