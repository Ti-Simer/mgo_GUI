import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-department',
  templateUrl: './dialog-edit-department.component.html',
  styleUrls: ['./dialog-edit-department.component.scss']
})
export class DialogEditDepartmentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
