import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ImageData {
  name: string;
  url: string;
}

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImageData>,
  ) { }

  ngOnInit(): void {
  }

}
