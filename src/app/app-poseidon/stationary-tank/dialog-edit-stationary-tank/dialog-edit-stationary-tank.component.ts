import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-stationary-tank',
  templateUrl: './dialog-edit-stationary-tank.component.html',
  styleUrls: ['./dialog-edit-stationary-tank.component.scss']
})
export class DialogEditStationaryTankComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditStationaryTankComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
