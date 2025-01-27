import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-courses',
  templateUrl: './dialog-create-courses.component.html',
  styleUrls: ['./dialog-create-courses.component.scss']
})
export class DialogCreateCoursesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateCoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
