import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-localities',
  templateUrl: './dialog-create-localities.component.html',
  styleUrls: ['./dialog-create-localities.component.scss']
})
export class DialogCreateLocalitiesComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogCreateLocalitiesComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    
    onClose(): void {
      this.dialogRef.close();
    }
}
