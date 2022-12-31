import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Discount } from '../../../shared/models/discount.model';
import { DiscountsService } from '../discounts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-discounts-create',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './discounts-create.component.html',
  styleUrls: ['./discounts-create.component.scss']
})
export class DiscountsCreateComponent implements OnInit {
  saveDiscountSubscription: Subscription = new Subscription();
  discountTypes: string[] = ['volum', 'inscriere', 'fidelitate'];
  discountForm: FormGroup;
  discount: Discount;
  mode: 'create' | 'edit';

  loading$: Observable<boolean>;

  constructor(
    private discountsService: DiscountsService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loading$ = this.adminService.loading$;
    this.discount = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].discount : null;
    this.mode = !this.discount ? 'create' : 'edit';

    this.discountForm = this.fb.group({
      categorie: new FormControl(this.discount && this.discount.categorie ? this.discount.categorie : null, [Validators.required]),
      volum: this.fb.array(this.discount && this.discount.volum && this.discount.volum.length ? this.discount.volum.map(item => this.createVolum(item)) : []),
      inscriere: this.fb.array(this.discount && this.discount.inscriere && this.discount.inscriere.length ? this.discount.inscriere.map(item => this.createInscriere(item)) : []),
      fidelitate: this.fb.array(this.discount && this.discount.fidelitate && this.discount.fidelitate.length ? this.discount.fidelitate.map(item => this.createFidelitate(item)) : []),
      descriere: new FormControl(this.discount && this.discount.descriere ? this.discount.descriere : null),
      activ: new FormControl(this.discount && this.discount.activ ? this.discount.activ : (this.discount && this.discount.activ === false ? false : null), [Validators.required]),
    });
  }

  // reset other discount types on select
  selectType(type: "volum" | "inscriere" | "fidelitate") {
    this.discountTypes.forEach(t => {
      if (t !== type) {
        this.discountForm.setControl(t, this.fb.array([]));
      }
    });
    this.discountForm.updateValueAndValidity();
  }

  // volum
  createVolum(volum) {
    return this.fb.group({
      min_cursanti: volum.min_cursanti || null,
      max_cursanti: volum.max_cursanti || null,
      type: volum.type || null,
      value: volum.value || null
    });
  }

  addVolum() {
    const group = this.fb.group({
      min_cursanti: new FormControl(null, [Validators.required]),
      max_cursanti: new FormControl(null),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required])
    })

    const volumArray = this.discountForm.get('volum') as FormArray;
    volumArray.push(group);
  }

  removeVolum(index) {
    let volumArray = this.discountForm.get('volum') as FormArray;
    volumArray.removeAt(index);
  }

  get volum(): FormArray {
    return this.discountForm.get('volum') as FormArray;
  }

  // inscriere
  createInscriere(inscriere) {
    return this.fb.group({
      max_inscriere: inscriere.max_inscriere || null,
      type: inscriere.type || null,
      value: inscriere.value || null
    });
  }

  addInscriere() {
    const group = this.fb.group({
      max_inscriere: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required])
    })

    const inscriereArray = this.discountForm.get('inscriere') as FormArray;
    inscriereArray.push(group);
  }

  removeInscriere(index) {
    let inscriereArray = this.discountForm.get('inscriere') as FormArray;
    inscriereArray.removeAt(index);
  }

  get inscriere(): FormArray {
    return this.discountForm.get('inscriere') as FormArray;
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

  addFidelitate() {
    const group = this.fb.group({
      participare: new FormControl(null, [Validators.required]),
      consecutiva: new FormControl(null),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    })

    const fidelitateArray = this.discountForm.get('fidelitate') as FormArray;
    fidelitateArray.push(group);
  }

  removeFidelitate(index) {
    let fidelitateArray = this.discountForm.get('fidelitate') as FormArray;
    fidelitateArray.removeAt(index);
  }

  get fidelitate(): FormArray {
    return this.discountForm.get('fidelitate') as FormArray;
  }

  // create / update discount
  createDiscount() {
    let method = this.mode === 'create' ? 'createDiscount' : 'updateDiscountById';
    let params = this.mode === 'create' ? [this.discountForm.value] : [this.discount._id, this.discountForm.value];
    this.saveDiscountSubscription = this.discountsService[method](...params).subscribe(() => this.router.navigate(['/admin/discounturi']));
  }

  ngOnDestroy(): void {
    this.saveDiscountSubscription.unsubscribe();
  }
}
