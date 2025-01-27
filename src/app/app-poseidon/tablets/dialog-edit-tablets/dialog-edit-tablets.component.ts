import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-tablets',
  templateUrl: './dialog-edit-tablets.component.html',
  styleUrls: ['./dialog-edit-tablets.component.scss']
})
export class DialogEditTabletsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditTabletsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
