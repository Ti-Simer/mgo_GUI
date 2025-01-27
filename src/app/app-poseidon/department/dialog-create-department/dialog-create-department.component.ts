import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-department',
  templateUrl: './dialog-create-department.component.html',
  styleUrls: ['./dialog-create-department.component.scss']
})
export class DialogCreateDepartmentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  onClose(): void {
    this.dialogRef.close();
  }

}
