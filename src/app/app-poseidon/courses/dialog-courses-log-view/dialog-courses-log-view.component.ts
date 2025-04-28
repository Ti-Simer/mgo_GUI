import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-courses-log-view',
  templateUrl: './dialog-courses-log-view.component.html',
  styleUrls: ['./dialog-courses-log-view.component.scss']
})
export class DialogCoursesLogViewComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCoursesLogViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
