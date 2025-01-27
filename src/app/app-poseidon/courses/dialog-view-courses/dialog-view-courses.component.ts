import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-courses',
  templateUrl: './dialog-view-courses.component.html',
  styleUrls: ['./dialog-view-courses.component.scss']
})
export class DialogViewCoursesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogViewCoursesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
