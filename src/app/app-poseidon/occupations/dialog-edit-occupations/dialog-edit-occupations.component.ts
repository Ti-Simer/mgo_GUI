import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-occupations',
  templateUrl: './dialog-edit-occupations.component.html',
  styleUrls: ['./dialog-edit-occupations.component.scss']
})
export class DialogEditOccupationsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditOccupationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
