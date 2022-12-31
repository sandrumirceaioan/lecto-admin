import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Teacher } from '../../../shared/models/teacher.model';
import { Observable, Subscription } from 'rxjs';
import { TeachersService } from '../teachers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/shared/components/dialogs/image-dialog/image-dialog.component';
import { DndDirective } from 'src/app/shared/directives/dnd.directive';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-teachers-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DndDirective,
  ],
  templateUrl: './teachers-create.component.html',
  styleUrls: ['./teachers-create.component.scss']
})
export class TeachersCreateComponent implements OnInit, OnDestroy {
  saveTeacherSubscription: Subscription = new Subscription();
  teacherForm: FormGroup;
  teacher: Teacher;
  mode: 'create' | 'edit';

  selectedFiles: {
    name: string;
    file: File;
    preview?: any;
    view?: any;
  }[] = [];

  loading$: Observable<boolean>;

  constructor(
    private teachersService: TeachersService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.teacher = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].teacher : null;
    this.mode = !this.teacher ? 'create' : 'edit';

    this.teacherForm = this.fb.group({
      nume: new FormControl(this.teacher && this.teacher.nume ? this.teacher.nume : null, [Validators.required]),
      experienta: new FormControl(this.teacher && this.teacher.experienta ? this.teacher.experienta : null, [Validators.required]),
      descriere: new FormControl(this.teacher && this.teacher.descriere ? this.teacher.descriere : null, [Validators.required]),
      imagine: new FormControl(this.teacher && this.teacher.imagine ? this.teacher.imagine : null),
      telefon: new FormControl(this.teacher && this.teacher.telefon ? this.teacher.telefon : null),
      email: new FormControl(this.teacher && this.teacher.email ? this.teacher.email : null, [Validators.required, Validators.email])
    });

    if (this.mode === 'edit') {
      if (this.teacher.imagine) {
        this.selectedFiles[0] = {
          name: this.teacher.imagine.name,
          file: this.teacher.imagine.file,
          preview: this.teacher.imagine.small,
          view: this.teacher.imagine.original
        }
      }
    }
  }

  // on new files selected
  async onFileSelected(event) {
    let files = event.target.files;
    if (!files || !files.length) return;
    await this.setSelectedFiles(files);
  }

  // on new files dropped
  async onDroppedFiles(files) {
    if (!files || !files.length) return;
    await this.setSelectedFiles(files);
  }

  // on file remove
  onFileRemoved() {
    this.selectedFiles.splice(0, 1);
    this.removeImage();
  }

  // set selected files to preview and form
  async setSelectedFiles(files: File[]) {
    for (let i = 0, l = files.length; i < l; i++) {
      let file = files[i];

      if (this.validImage(file)) {
        this.addImage(file);
        let filePreview = await this.preview(file);
        this.selectedFiles[0] = {
          name: file.name,
          file: file,
          preview: filePreview,
          view: filePreview
        };
      }

    }
  }


  addImage(file) {
    this.teacherForm.setControl('imagine', this.fb.group({
      name: file.name,
      file: file,
      small: file.small || null,
      original: file.original || null
    }));

    this.teacherForm.updateValueAndValidity();
  }

  removeImage() {
    this.teacherForm.setControl('imagine', null);
    this.teacherForm.updateValueAndValidity();
  }

  // view image
  openDialog(selected: any): void {
    this.dialog.open(ImageDialogComponent, {
      data: {
        url: selected.view,
        name: selected.name
      },
      height: 'auto',
      maxHeight: '90vh',
      width: 'auto',
      maxWidth: '90%',
      autoFocus: false
    });
  }

  createTeacher() {
    let method = this.mode === 'create' ? 'createTeacher' : 'updateTeacherById';
    let params = this.mode === 'create' ? [this.teacherForm.value] : [this.teacher._id, this.teacherForm.value];


    this.saveTeacherSubscription = this.teachersService[method](...params).subscribe(() => {
      if (this.mode === 'create') this.router.navigate(['/admin/profesori']);
    });
  }

  ngOnDestroy(): void {
    this.saveTeacherSubscription.unsubscribe();
  }

  // HELPERS
  preview(file) {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        resolve(reader.result);
      }
    })
  }

  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  validImage(file) {
    return file.name.match(/\.(jpg|jpeg|png|ico|webp)$/) ? true : false;
  }

}
