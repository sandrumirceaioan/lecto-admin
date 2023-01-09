import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, finalize, Observable, Subscription, switchMap, tap } from 'rxjs';
import { Resort, LocationGroup } from '../../../shared/models/resort.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DndDirective } from '../../../shared/directives/dnd.directive';
import { EditorModule } from '../../../shared/modules/editor.module';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../../shared/components/dialogs/image-dialog/image-dialog.component';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ResortsService } from '../resorts.service';

@Component({
  selector: 'app-resorts-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DndDirective,
    EditorModule,
  ],
  templateUrl: './resorts-create.component.html',
  styleUrls: ['./resorts-create.component.scss'],
})
export class ResortsCreateComponent implements OnInit, OnDestroy {
  apiPath: string = environment.BACKEND_URL;

  saveResortSubscription: Subscription = new Subscription();
  resortsForm: FormGroup;
  resort: Resort;
  romania: Observable<LocationGroup[]>;
  mode: 'create' | 'edit';

  minLengthTerm = 1;
  isLoading = false;

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
    imageUploadURL: `${this.apiPath}/resorts/content-image-upload`,
    paragraphFormat: {
      N: 'Normal',
      H1: 'Heading 1',
      H2: 'Heading 2'
    },
    listAdvancedTypes: true,
    toolbarButtons: ['paragraphFormat', 'fontSize', 'fontFamily', 'textColor', 'backgroundColor', 'bold', 'italic', 'underline', 'undo', 'redo', 'formatOL', 'formatUL', 'align', 'indent', 'outdent', 'lineHeight', 'insertLink', 'insertImage', 'html', 'fullscreen'],
    pluginsEnabled: ['paragraphFormat', 'fontSize', 'fontFamily', 'align', 'codeBeautifier', 'codeView', 'draggable', 'image', 'imageManager', 'inlineClass', 'lineBreaker', 'lineHeight', 'link', 'colors', 'fullscreen', 'lists', 'formatOL', 'formatUL'],
    attribution: false
  };

  loading$: Observable<boolean>;

  constructor(
    private resortsService: ResortsService,
    private adminService: AdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.resort = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].resort : null;
    this.mode = !this.resort ? 'create' : 'edit';

    // form initialization
    this.resortsForm = this.fb.group({
      resort: new FormControl(this.resort && this.resort.resort ? this.resort.resort : null, [Validators.required]),
      url: new FormControl(this.resort && this.resort.url ? this.resort.url : null, [Validators.required]),
      descriere: new FormControl(this.resort && this.resort.descriere ? this.resort.descriere : null, [Validators.required]),
      imagine: new FormControl(this.resort && this.resort.imagine ? this.resort.imagine : null),
      localitate: new FormControl(this.resort && this.resort.oras ? this.resort.oras : null, [Validators.required]),
      oras: new FormControl(this.resort && this.resort.oras ? this.resort.oras : null, [Validators.required]),
      judet: new FormControl(this.resort && this.resort.judet ? this.resort.judet : null, [Validators.required]),
      status: new FormControl(this.resort && this.resort.status ? this.resort.status : (this.resort && this.resort.status === false ? false : null), [Validators.required]),
    });

    if (this.mode === 'edit') {
      if (this.resort.imagine) {
        this.selectedFiles[0] = {
          name: this.resort.imagine.name,
          file: this.resort.imagine.file,
          preview: this.resort.imagine.small,
          view: this.resort.imagine.original
        }
      }
    }

    // autocomplete filtering
    this.romania = this.resortsForm.get('localitate').valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length
        }),
        distinctUntilChanged(),
        debounceTime(250),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.resortsService.getRomanianLocations(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      );

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

  // add image
  addImage(file) {
    this.resortsForm.setControl('imagine', this.fb.group({
      name: file.name,
      file: file,
      small: file.small || null,
      original: file.original || null
    }));

    this.resortsForm.updateValueAndValidity();
  }

  // remove image
  removeImage() {
    this.resortsForm.setControl('imagine', null);
    this.resortsForm.updateValueAndValidity();
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


  // romanian location
  onSelectedResort(event: MatAutocompleteSelectedEvent) {
    let value = event.option.value ? event.option.value : null;
    let label = event.option.group.label ? event.option.group.label : null;
    this.resortsForm.get('oras').setValue(value);
    this.resortsForm.get('judet').setValue(label);
    this.resortsForm.updateValueAndValidity();
  }

  convertToUrl(value) {
    let url = value.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    this.resortsForm.get('url').setValue(url);
    this.resortsForm.updateValueAndValidity({ emitEvent: true });
  }


  createResort() {
    let method = this.mode === 'create' ? 'createResort' : 'updateResortById';
    let params = this.mode === 'create' ? [this.resortsForm.value] : [this.resort._id, this.resortsForm.value];


    this.saveResortSubscription = this.resortsService[method](...params).subscribe(() => {
      if (this.mode === 'create') this.router.navigate(['/admin/locatii']);
    });
  }

  ngOnDestroy(): void {
    this.saveResortSubscription.unsubscribe();
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
