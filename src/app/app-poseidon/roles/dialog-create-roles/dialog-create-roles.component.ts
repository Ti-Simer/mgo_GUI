import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  
@Component({
  selector: 'app-dialog-create-roles',
  templateUrl: './dialog-create-roles.component.html',
  styleUrls: ['./dialog-create-roles.component.scss']
})
export class DialogCreateRolesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
