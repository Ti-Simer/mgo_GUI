import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-roles',
  templateUrl: './dialog-edit-roles.component.html',
  styleUrls: ['./dialog-edit-roles.component.scss']
})
export class DialogEditRolesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
