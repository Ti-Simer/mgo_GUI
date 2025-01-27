import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-zone',
  templateUrl: './dialog-edit-zone.component.html',
  styleUrls: ['./dialog-edit-zone.component.scss']
})
export class DialogEditZoneComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditZoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
