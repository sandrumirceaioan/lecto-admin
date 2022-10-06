import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/shared/components/dialogs/image-dialog/image-dialog.component';
import { DndDirective } from 'src/app/shared/directives/dnd.directive';
import { AdminService } from '../../admin.service';
import { CoursesService } from '../courses.service';
import { Course } from '../../../shared/models/course.model';
import { EditorModule } from '../../../shared/modules/editor.module';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-courses-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DndDirective,
    EditorModule,
  ],
  templateUrl: './courses-create.component.html',
  styleUrls: ['./courses-create.component.scss']
})
export class CoursesCreateComponent implements OnInit, OnDestroy {
  apiPath: string = environment.BACKEND_URL;
  saveTeacherSubscription: Subscription = new Subscription();
  courseForm: FormGroup;
  course: Course;
  mode: 'create' | 'edit';

  selectedFiles: {
    name: string;
    file: File;
    preview?: any;
    view?: any;
  }[] = [];

  public froalaOptions: Object = {
    height: 500,
    charCounterCount: true,
    codeBeautifier: true,
    dragInline: false,
    lineHeights: {
      Default: '',
      Single: '1',
      '0.5': '0.5',
      '1.5': '1.5',
      '2.5': '2.5',
      Double: '2'
    },
    linkAlwaysBlank: true,
    linkAlwaysNoFollow: false,
    imageCORSProxy: '',
    imageDefaultMargin: 10,
    imageUpload: true,
    imageUploadMethod: 'POST',
    imageUploadURL: `${this.apiPath}/courses/content-image-upload`,
    paragraphFormat: {
      N: 'Normal',
      H1: 'Heading 1',
      H2: 'Heading 2'
    },
    toolbarButtons: ['paragraphFormat', 'fontSize', 'fontFamily', 'textColor', 'backgroundColor', 'bold', 'italic', 'underline', 'undo', 'redo', 'align', 'indent', 'outdent', 'formatUL', 'lineHeight', 'insertLink', 'insertImage', 'html', 'fullscreen'],
    pluginsEnabled: ['paragraphFormat', 'fontSize', 'fontFamily', 'align', 'codeBeautifier', 'codeView', 'draggable', 'image', 'imageManager', 'inlineClass', 'lineBreaker', 'lineHeight', 'link', 'colors', 'fullscreen'],
    attribution: false
  };

  loading$: Observable<boolean>;

  constructor(
    private coursesService: CoursesService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.course = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].teacher : null;
    this.mode = !this.course ? 'create' : 'edit';

    this.courseForm = this.fb.group({
      titlu: new FormControl(this.course && this.course.titlu ? this.course.titlu : null, [Validators.required]),
      url: new FormControl(this.course && this.course.url ? this.course.url : null, [Validators.required]),
      descriere: new FormControl(this.course && this.course.descriere ? this.course.descriere : null, [Validators.required]),
      certificare: this.fb.group({
        anc: new FormControl(this.course && this.course.certificare && this.course.certificare.anc ? this.course.certificare.anc : (this.course && this.course.certificare && this.course.certificare.anc === false ? false : null)),
        participare: new FormControl(this.course && this.course.certificare && this.course.certificare.participare ? this.course.certificare.participare : (this.course && this.course.certificare && this.course.certificare.participare === false ? false : null)),
      }),
      pret: this.fb.group({
        anc: new FormControl({ value: this.course && this.course.pret && this.course.pret.anc ? this.course.pret.anc : null, disabled: true }),
        participare: new FormControl({ value: this.course && this.course.pret && this.course.pret.participare ? this.course.pret.participare : null, disabled: true }),
      }),
      imagine: new FormControl(this.course && this.course.imagine ? this.course.imagine : null),
      status: new FormControl(this.course && this.course.status ? this.course.status : (this.course && this.course.status === false ? false : null), [Validators.required]),
    });

    if (this.mode === 'edit') {
      if (this.course.imagine) {
        this.selectedFiles[0] = {
          name: this.course.imagine.name,
          file: this.course.imagine.file,
          preview: this.course.imagine.small,
          view: this.course.imagine.original
        }
      }

      if (this.course.pret && this.course.pret.anc) {
        this.courseForm.get('pret.anc').enable();
        this.courseForm.get('pret.anc').setValue(this.course.pret.anc);
      }
      if (this.course.pret && this.course.pret.participare) {
        this.courseForm.get('pret.participare').enable();
        this.courseForm.get('pret.participare').setValue(this.course.pret.participare);
      }
    }

    this.courseForm.get('certificare').valueChanges.subscribe(val => {
      if (val.anc) {
        this.courseForm.get('pret.anc').setValidators([Validators.required]);
        this.courseForm.get('pret.anc').enable();
      } else {
        this.courseForm.get('pret.anc').reset();
        this.courseForm.get('pret.anc').disable();
        this.courseForm.get('pret.anc').clearValidators();
      }

      if (val.participare) {
        this.courseForm.get('pret.participare').setValidators([Validators.required]);
        this.courseForm.get('pret.participare').enable();
      } else {
        this.courseForm.get('pret.participare').reset();
        this.courseForm.get('pret.participare').disable();
        this.courseForm.get('pret.participare').clearValidators();
      }

      this.courseForm.get('pret.anc').updateValueAndValidity({ emitEvent: true });
      this.courseForm.get('pret.participare').updateValueAndValidity({ emitEvent: true });
    });

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
    this.courseForm.setControl('imagine', this.fb.group({
      name: file.name,
      file: file,
      small: file.small || null,
      original: file.original || null
    }));

    this.courseForm.updateValueAndValidity();
  }

  removeImage() {
    this.courseForm.setControl('imagine', null);
    this.courseForm.updateValueAndValidity();
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

  createCourse() {
    let course = {
      ...this.courseForm.value,
      certificare: {
        anc: this.courseForm.value.certificare && this.courseForm.value.certificare.anc ? this.courseForm.value.certificare.anc : false,
        participare: this.courseForm.value.certificare && this.courseForm.value.certificare.participare ? this.courseForm.value.certificare.participare : false,
      },
      pret: {
        anc: this.courseForm.value.pret && this.courseForm.value.pret.anc ? this.courseForm.value.pret.anc : null,
        participare: this.courseForm.value.pret && this.courseForm.value.pret.participare ? this.courseForm.value.pret.participare : null,
      }
    };

    let method = this.mode === 'create' ? 'createCourse' : 'updateCourseById';
    let params = this.mode === 'create' ? [course] : [this.course._id, course];


    this.saveTeacherSubscription = this.coursesService[method](...params).subscribe(() => {
      if (this.mode === 'create') this.router.navigate(['/admin/cursuri']);
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
