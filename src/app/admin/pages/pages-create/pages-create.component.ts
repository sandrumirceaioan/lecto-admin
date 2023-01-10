import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/shared/components/dialogs/image-dialog/image-dialog.component';
import { DndDirective } from 'src/app/shared/directives/dnd.directive';
import { AdminService } from '../../admin.service';
import { PagesService } from '../pages.service';
import { Page } from '../../../shared/models/page.model';
import { EditorModule } from '../../../shared/modules/editor.module';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-pages-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DndDirective,
    EditorModule,
  ],
  templateUrl: './pages-create.component.html',
  styleUrls: ['./pages-create.component.scss']
})
export class PagesCreateComponent implements OnInit, OnDestroy {
  apiPath: string = environment.BACKEND_URL;
  savePageSubscription: Subscription = new Subscription();
  pageForm: FormGroup;
  page: Page;
  mode: 'create' | 'edit';

  selectedFiles: {
    name: string;
    file: File;
    preview?: any;
    view?: any;
  }[] = [];

  public froalaOptions: Object = {
    height: 850,
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
    requestHeaders: {
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    },
    imageUploadURL: `${this.apiPath}/pages/content-image-upload`,
    paragraphFormat: {
      N: 'Normal',
      H1: 'Heading 1',
      H2: 'Heading 2'
    },
    listAdvancedTypes: true,
    colorsBackground:[
      '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
      '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
      '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
      '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', '#6DC1C0', '#d66d51', 'REMOVE'
    ],
    colorsText:[
      '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
      '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
      '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
      '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', '#6DC1C0', '#d66d51', 'REMOVE'
    ],
    toolbarButtons: ['paragraphFormat', 'fontSize', 'fontFamily', 'textColor', 'backgroundColor', 'bold', 'italic', 'underline', 'undo', 'redo', 'formatOL', 'formatUL', 'align', 'indent', 'outdent', 'lineHeight', 'insertLink', 'insertImage', 'html', 'fullscreen'],
    pluginsEnabled: ['paragraphFormat', 'fontSize', 'fontFamily', 'align', 'codeBeautifier', 'codeView', 'draggable', 'image', 'imageManager', 'inlineClass', 'lineBreaker', 'lineHeight', 'link', 'colors', 'fullscreen', 'lists', 'formatOL', 'formatUL'],
    attribution: false
  };

  loading$: Observable<boolean>;

  constructor(
    private pagesService: PagesService,
    private adminService: AdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.page = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].page : null;
    this.mode = !this.page ? 'create' : 'edit';

    this.pageForm = this.fb.group({
      titlu: new FormControl(this.page && this.page.titlu ? this.page.titlu : null, [Validators.required]),
      url: new FormControl(this.page && this.page.url ? this.page.url : null, [Validators.required]),
      descriere: new FormControl(this.page && this.page.descriere ? this.page.descriere : null, [Validators.required]),
      imagine: new FormControl(this.page && this.page.imagine ? this.page.imagine : null),
      status: new FormControl(this.page && this.page.status ? this.page.status : (this.page && this.page.status === false ? false : null), [Validators.required]),
    });

    if (this.mode === 'edit') {
      if (this.page.imagine) {
        this.selectedFiles[0] = {
          name: this.page.imagine.name,
          file: this.page.imagine.file,
          preview: this.page.imagine.small,
          view: this.page.imagine.original
        }
      }
    }
  }

  convertToUrl(value) {
    let url = value.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
    this.pageForm.get('url').setValue(url);
    this.pageForm.updateValueAndValidity({emitEvent: true});
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
    this.pageForm.setControl('imagine', this.fb.group({
      name: file.name,
      file: file,
      small: file.small || null,
      original: file.original || null
    }));

    this.pageForm.updateValueAndValidity();
  }

  removeImage() {
    this.pageForm.setControl('imagine', null);
    this.pageForm.updateValueAndValidity();
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

  createPage() {
    let method = this.mode === 'create' ? 'createPage' : 'updatePageById';
    let params = this.mode === 'create' ? [this.pageForm.value] : [this.page._id, this.pageForm.value];


    this.savePageSubscription = this.pagesService[method](...params).subscribe(() => {
      if (this.mode === 'create') this.router.navigate(['/admin/pagini']);
    });
  }

  ngOnDestroy(): void {
    this.savePageSubscription.unsubscribe();
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
