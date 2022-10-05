import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-create.component.html',
  styleUrls: ['./courses-create.component.scss']
})
export class CoursesCreateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
