import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-localities',
  templateUrl: './dialog-edit-localities.component.html',
  styleUrls: ['./dialog-edit-localities.component.scss']
})
export class DialogEditLocalitiesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditLocalitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
