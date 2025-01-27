import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-tablets',
  templateUrl: './dialog-create-tablets.component.html',
  styleUrls: ['./dialog-create-tablets.component.scss']
})
export class DialogCreateTabletsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateTabletsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }
}
