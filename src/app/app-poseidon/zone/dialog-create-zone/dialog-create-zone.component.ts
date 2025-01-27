import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-zone',
  templateUrl: './dialog-create-zone.component.html',
  styleUrls: ['./dialog-create-zone.component.scss']
})
export class DialogCreateZoneComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateZoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
