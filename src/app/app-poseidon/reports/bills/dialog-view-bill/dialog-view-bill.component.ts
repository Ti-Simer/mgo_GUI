import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-bill',
  templateUrl: './dialog-view-bill.component.html',
  styleUrls: ['./dialog-view-bill.component.scss']
})
export class DialogViewBillComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogViewBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
