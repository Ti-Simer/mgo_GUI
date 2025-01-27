import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-courses',
  templateUrl: './dialog-edit-courses.component.html',
  styleUrls: ['./dialog-edit-courses.component.scss']
})
export class DialogEditCoursesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditCoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
