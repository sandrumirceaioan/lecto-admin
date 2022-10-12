import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { debounceTime, distinctUntilChanged, filter, finalize, forkJoin, map, Observable, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../admin.service';
import { SessionsService } from '../sessions.service';
import { EditorModule } from '../../../shared/modules/editor.module';
import { environment } from '../../../../environments/environment';
import { Session } from '../../../shared/models/session.model';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LocationsService } from '../../locations/locations.service';
import { Location } from '../../../shared/models/location.model';
import { Course } from 'src/app/shared/models/course.model';
import { CoursesService } from '../../courses/courses.service';
import { AlertService } from '@full-fledged/alerts';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Discount } from 'src/app/shared/models/discount.model';

@Component({
  selector: 'app-courses-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    EditorModule,
  ],
  templateUrl: './sessions-create.component.html',
  styleUrls: ['./sessions-create.component.scss']
})
export class SessionsCreateComponent implements OnInit, OnDestroy {
  apiPath: string = environment.BACKEND_URL;
  mode: 'create' | 'edit';
  session: Session;
  sessionData: { teachers: Teacher[]; discounts: Discount[] };
  saveSessionSubscription: Subscription = new Subscription();

  // general, online, local form groups
  sessionGroup: FormGroup;

  // autocomplete
  locations: Observable<Location[]>;
  courses: Observable<Course[]>;
  toggleOptions: any[] = [];

  // froala editor options
  public froalaOptions: Object = {
    height: 550,
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
    private sessionsService: SessionsService,
    private locationsService: LocationsService,
    private coursesService: CoursesService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.session = this.route.snapshot.data['session'] ? this.route.snapshot.data['session'].session : null;
    this.sessionData = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'] : null;
    this.mode = !this.session ? 'create' : 'edit';

    console.log(this.sessionData);

    this.sessionGroup = this.fb.group({
      titlu: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      descriere: new FormControl(null, [Validators.required]),

      inscriere: this.fb.group({
        start: new FormControl(null),
        end: new FormControl(null),
      }),

      perioada: this.fb.group({
        start: new FormControl(null),
        end: new FormControl(null),
      }),

      searchLocation: new FormControl(null),
      searchCourse: new FormControl(null),

      cursuri: this.fb.array([], [Validators.required]),

      locatie: this.fb.group({
        data: new FormControl(null),
        oferte: this.fb.array([], [Validators.required])
      }),
    });

    // autocomplete location
    this.locations = this.sessionGroup.get('searchLocation').valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length
        }),
        distinctUntilChanged(),
        debounceTime(250),
        switchMap(value => this.locationsService.searchLocations(value)
          .pipe(
            map(value => {
              return value;
            })
          )
        )
      );

    // autocomplete courses
    this.courses = this.sessionGroup.get('searchCourse').valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length
        }),
        debounceTime(250),
        switchMap(value => this.coursesService.searchCourses(value))
      );


    // session form change validators
    this.sessionGroup.get('type').valueChanges.subscribe(val => {
      if (val === 'local') {
        this.sessionGroup.get('locatie').reset();
        this.sessionGroup.get('locatie').setValidators([Validators.required]);
      } else {
        this.sessionGroup.get('locatie').reset();
        this.sessionGroup.get('locatie').clearValidators();
      }

      this.sessionGroup.get('locatie').updateValueAndValidity({ emitEvent: true });
    });

  }

  convertToUrl(value) {
    let url = value.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    this.sessionGroup.get('url').setValue(url);
    this.sessionGroup.updateValueAndValidity({ emitEvent: true });
  }

  // LOCATION GROUP
  onSelectedLocation(event: MatAutocompleteSelectedEvent, auto: MatAutocomplete) {
    let value = event.option.value ? event.option.value : null;
    if (!value) return false;

    this.locatie.get('data').setValue(value);
    this.locatie.setControl('oferte', this.fb.array([]));

    auto.options.forEach((item) => {
      item.deselect();
    });
    this.sessionGroup.get('searchLocation').patchValue('');
    this.sessionGroup.updateValueAndValidity();
  }

  getLocationLabel(selected) {
    return selected && selected.locatie ? selected.locatie : null;
  }

  createOffer(oferta) {
    return this.fb.group({
      nume: oferta.nume || null,
      valoare: oferta.valoare || null
    });
  }

  addOffer() {
    const group = this.fb.group({
      nume: new FormControl(null, [Validators.required]),
      valoare: new FormControl(null, [Validators.required])
    })

    const offerArray = this.sessionGroup.get('locatie.oferte') as FormArray;
    offerArray.push(group);
  }

  removeOffer(index) {
    let offerArray = this.sessionGroup.get('locatie.oferte') as FormArray;
    offerArray.removeAt(index);
  }


  // NESTED GROUP REFERENCES
  get inscriere() {
    return this.sessionGroup.get('inscriere') as FormGroup;
  }

  get perioada() {
    return this.sessionGroup.get('perioada') as FormGroup;
  }

  get cursuri() {
    return this.sessionGroup.get('cursuri') as FormArray;
  }

  get locatie() {
    return this.sessionGroup.get('locatie') as FormGroup;
  }

  get oferte() {
    return this.sessionGroup.get('locatie.oferte') as FormArray;
  }


  // COURSES GROUP
  addCourse(value) {
    const coursesArray = this.sessionGroup.get('cursuri') as FormArray;
    let index = coursesArray.controls.findIndex((x) => x.value.data._id === value._id);
    if (index !== -1) {
      this.alertService.danger('Cursul a fost deja adaugat');
      return false;
    }

    const group = this.fb.group({
      data: value,
      options: this.fb.group({
        certificare: this.fb.group({
          anc: new FormControl(false),
          participare: new FormControl(false)
        }),
        pret: this.fb.group({
          anc: new FormControl(null),
          participare: new FormControl(null)
        })
      }),

      discounts: this.fb.group({
        volum: this.fb.array(value.discounts && value.discounts.volum && value.discounts.volum.length ? value.discounts.volum.map(item => this.createVolum(item)) : []),
        inscriere: this.fb.array(value.discounts && value.discounts.inscriere && value.discounts.inscriere.length ? value.discounts.inscriere.map(item => this.createInscriere(item)) : []),
        fidelitate: this.fb.array(value.discounts && value.discounts.fidelitate && value.discounts.fidelitate.length ? value.discounts.fidelitate.map(item => this.createFidelitate(item)) : []),
      }),

      selectTeacher: new FormControl(''),
      teachers: this.fb.array([], [Validators.required]),

      toggleTeachers: false,
      toggleOptions: false,
      toggleDiscounts: false
    });

    coursesArray.push(group);
    console.log(this.sessionGroup.value);
  }

  removeCourse(index) {
    let coursesArray = this.sessionGroup.get('cursuri') as FormArray;
    coursesArray.removeAt(index);
    console.log(this.sessionGroup.value);
  }

  toggleCourse(course, type) {
    if (course.get(`toggle${type}`).value === true) {
      course.get(`toggle${type}`).patchValue(false);
    } else {
      course.get(`toggle${type}`).patchValue(true);
    }
  }

  getCourseLabel(selected) {
    return selected && selected.titlu ? selected.titlu : null;
  }

  onSelectedCourse(event: MatAutocompleteSelectedEvent, auto: MatAutocomplete) {
    let value = event.option.value ? event.option.value : null;
    if (!value) return false;

    this.addCourse(value);

    this.sessionGroup.get('searchCourse').patchValue('');
    auto.options.forEach((item) => {
      item.deselect();
    });
  }

  // TEACHERS

  onTeacherSelect(event, course) {
    let teacher = event.value;
    const teachersArray = course.get('teachers') as FormArray;
    course.get('selectTeacher').patchValue('');

    let index = teachersArray.controls.findIndex((x) => x.value._id === teacher._id);
    if (index !== -1) {
      this.alertService.danger('Formatorul a fost deja adaugat');
      return false;
    }

    const group = this.fb.control(teacher);
    teachersArray.push(group);
  }

  onTeacherRemove(teacher, course) {
    const teachersArray = course.get('teachers') as FormArray;
    let index = teachersArray.controls.findIndex((x) => x.value._id === teacher._id);
    teachersArray.removeAt(index);
  }

  // DISCOUNTS

  // volum
  createVolum(volum) {
    return this.fb.group({
      min_cursanti: volum.min_cursanti || null,
      max_cursanti: volum.max_cursanti || null,
      type: volum.type || null,
      value: volum.value || null
    });
  }

  addVolum(curs) {
    const group = this.fb.group({
      min_cursanti: new FormControl(null, [Validators.required]),
      max_cursanti: new FormControl(null),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required])
    })

    const volumArray = curs.get('discounts.volum') as FormArray;
    volumArray.push(group);
  }

  removeVolum(curs, index) {
    let volumArray = curs.get('discounts.volum') as FormArray;
    volumArray.removeAt(index);
  }


  // inscriere
  createInscriere(inscriere) {
    return this.fb.group({
      max_inscriere: inscriere.max_inscriere || null,
      type: inscriere.type || null,
      value: inscriere.value || null
    });
  }

  addInscriere(curs) {
    const group = this.fb.group({
      max_inscriere: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required])
    })

    const inscriereArray = curs.get('discounts.inscriere') as FormArray;
    inscriereArray.push(group);
  }

  removeInscriere(curs, index) {
    let inscriereArray = curs.get('discounts.inscriere') as FormArray;
    inscriereArray.removeAt(index);
  }


  // fidelitate
  createFidelitate(fidelitate) {
    return this.fb.group({
      participare: fidelitate.participare || null,
      consecutiva: fidelitate.consecutiva || false,
      type: fidelitate.type || null,
      value: fidelitate.value || null
    });
  }

  addFidelitate(curs) {
    const group = this.fb.group({
      participare: new FormControl(null, [Validators.required]),
      consecutiva: new FormControl(null),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    })

    const fidelitateArray = curs.get('discounts.fidelitate') as FormArray;
    fidelitateArray.push(group);
  }

  removeFidelitate(curs, index) {
    let fidelitateArray = curs.get('discounts.fidelitate') as FormArray;
    fidelitateArray.removeAt(index);
  }

  get discountFidelitate(): FormArray {
    return this.cursuri.get('discounts.fidelitate') as FormArray;
  }



  // create/update session
  createSession() {
    console.log(this.sessionGroup.value);

    // let method = this.mode === 'create' ? 'createCourse' : 'updateCourseById';
    // let params = this.mode === 'create' ? [this.courseForm.value] : [this.course._id, course];


    // this.saveSessionSubscription = this.sessionsService[method](...params).subscribe(() => {
    //   if (this.mode === 'create') this.router.navigate(['/admin/cursuri']);
    // });
  }

  ngOnDestroy(): void {
    this.saveSessionSubscription.unsubscribe();
  }

  // HELPERS

}
