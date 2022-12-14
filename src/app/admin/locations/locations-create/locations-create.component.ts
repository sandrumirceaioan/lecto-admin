import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, filter, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { Location } from '../../../shared/models/location.model';
import { LocationsService } from '../locations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DndDirective } from '../../../shared/directives/dnd.directive';
import { EditorModule } from '../../../shared/modules/editor.module';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../../shared/components/dialogs/image-dialog/image-dialog.component';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Resort } from '../../../shared/models/resort.model';

@Component({
  selector: 'app-locations-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DndDirective,
    EditorModule,
  ],
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss'],
})
export class LocationsCreateComponent implements OnInit, OnDestroy {
  apiPath: string = environment.BACKEND_URL;

  saveLocationSubscription: Subscription = new Subscription();
  locationsForm: FormGroup;
  location: Location;
  mode: 'create' | 'edit';

  minLengthTerm = 1;
  isLoading = false;
  selectedFiles: {
    name: string;
    file: File;
    preview?: any;
    view?: any;
    main?: boolean;
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
    imageUploadURL: `${this.apiPath}/locations/content-image-upload`,
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

  resorts: Resort[];
  filteredResorts: Observable<Resort[]>;
  loading$: Observable<boolean>;

  constructor(
    private locationsService: LocationsService,
    private adminService: AdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.location = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].location : null;
    this.resorts = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].resorts : null;
    this.mode = !this.location ? 'create' : 'edit';

    // form initialization
    this.locationsForm = this.fb.group({
      resort: new FormControl(this.location && this.location.resort ? this.location.resort : null, [Validators.required]),

      locatie: new FormControl(this.location && this.location.locatie ? this.location.locatie : null, [Validators.required]),
      url: new FormControl(this.location && this.location.url ? this.location.url : null, [Validators.required]),
      descriere: new FormControl(this.location && this.location.descriere ? this.location.descriere : null, [Validators.required]),
      galerie: this.fb.array(this.location && this.location.galerie && this.location.galerie.length ? this.location.galerie.map(item => this.createImage(item)) : [], [Validators.required]),
      status: new FormControl(this.location && this.location.status ? this.location.status : (this.location && this.location.status === false ? false : null), [Validators.required]),

    });

    if (this.mode === 'edit') {
      this.selectedFiles = this.location.galerie.map(item => {
        return {
          name: item.name,
          file: item.file,
          preview: item.small,
          view: item.original,
          main: item.main
        }
      })
    }

    this.filteredResorts = this.locationsForm.get('resort').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string | Resort): Resort[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.resort.toLowerCase();
    return this.resorts.filter(resort => resort.resort.toLowerCase().includes(filterValue));
  }

  onSelectedResort(event: MatAutocompleteSelectedEvent) {
    let value = event.option.value ? event.option.value : null;
    if (!value) return false;

    this.locationsForm.get('resort').setValue(value.resort);
    this.locationsForm.updateValueAndValidity();
  }

  getResortLabel(selected) {
    return selected && selected.resort ? selected.resort : null;
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
  onFileRemoved(index) {
    this.removeImage(index);
    this.selectedFiles.splice(index, 1);
  }

  // on file set as main
  onFileMain(index) {
    this.selectedFiles.forEach((file, i) => {
      if (index === i) {
        file.main = true;
      } else {
        file.main = false;
      }
    });

    this.locationsForm.setControl('galerie', this.fb.array([], [Validators.required]));
    this.locationsForm.setControl('galerie', this.fb.array(this.selectedFiles.map(item => this.createImage(item)), [Validators.required]));
    this.locationsForm.updateValueAndValidity();
  }

  // set selected files to preview and form
  async setSelectedFiles(files: File[]) {
    for (let i = 0, l = files.length; i < l; i++) {
      let file = files[i];

      if (this.validImage(file)) {
        this.addImage(file);
        let filePreview = await this.preview(file);
        this.selectedFiles.push({
          name: file.name,
          file: file,
          preview: filePreview,
          view: filePreview
        });
      }

    }
  }

  // GALLERY FORM ARRAY
  createImage(image) {
    return this.fb.group({
      name: image.name,
      file: image.file,
      small: image.small || null,
      original: image.original || null,
      main: image.main || false
    });
  }

  addImage(file) {
    const group = this.fb.group({
      name: new FormControl(file.name),
      file: new FormControl(file),
      small: null,
      original: null,
      main: false
    })

    const galerieArray = this.locationsForm.get('galerie') as FormArray;
    galerieArray.push(group);
  }

  updateImage(index, value) {
    const galerieArray = this.locationsForm.get('galerie') as FormArray;
    let currentValue = galerieArray.at(index).value;

    galerieArray.at(index).setValue({
      ...currentValue,
      main: value
    });
  }

  removeImage(index) {
    let galerieArray = this.locationsForm.get('galerie') as FormArray;
    galerieArray.removeAt(index);
  }

  createLocation() {
    console.log(this.locationsForm.value);
    let method = this.mode === 'create' ? 'createLocation' : 'updateLocationById';
    let params = this.mode === 'create' ? [this.locationsForm.value] : [this.location._id, this.locationsForm.value];


    this.saveLocationSubscription = this.locationsService[method](...params).subscribe(() => {
      if (this.mode === 'create') this.router.navigate(['/admin/locatii']);
    });
  }

  ngOnDestroy(): void {
    this.saveLocationSubscription.unsubscribe();
  }


  // HELPERS
  convertToUrl(value) {
    let url = value.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    this.locationsForm.get('url').setValue(url);
    this.locationsForm.updateValueAndValidity({ emitEvent: true });
  }

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
