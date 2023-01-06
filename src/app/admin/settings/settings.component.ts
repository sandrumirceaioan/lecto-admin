import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Settings } from '../../shared/models/settings.model';
import { Observable, Subscription } from 'rxjs';
import { SettingsService } from './settings.service';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../shared/modules/material.module';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  saveSettingsSubscription: Subscription = new Subscription();
  settingsForm: FormGroup;
  settings: Settings;
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private adminService: AdminService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loading$ = this.adminService.loading$;
    this.settings = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].settings : null;

    // initialize company form
    this.settingsForm = this.fb.group({
      title: new FormControl(this.settings && this.settings.title ? this.settings.title : null),
      summary: new FormControl(this.settings && this.settings.summary ? this.settings.summary : null),
      description: new FormControl(this.settings && this.settings.description ? this.settings.description : null),
      currency: new FormControl(this.settings && this.settings.currency ? this.settings.currency : null),

      company: this.fb.group({
        name: new FormControl(this.settings && this.settings.company && this.settings.company.name ? this.settings.company.name : null, []),
        description: new FormControl(this.settings && this.settings.company && this.settings.company.description ? this.settings.company.description : null, []),
        cui: new FormControl(this.settings && this.settings.company && this.settings.company.cui ? this.settings.company.cui : null, []),
        j: new FormControl(this.settings && this.settings.company && this.settings.company.j ? this.settings.company.j : null, []),
      }),

      contact: this.fb.group({
        address: new FormControl(this.settings && this.settings.contact && this.settings.contact.address ? this.settings.contact.address : null),
        phones: this.fb.array(this.settings && this.settings.contact && this.settings.contact.phones && this.settings.contact.phones.length ? this.settings.contact.phones.map(item => this.createPhone(item)) : []),
        email: new FormControl(this.settings && this.settings.contact ? this.settings.contact.email : null),
        web: new FormControl(this.settings && this.settings.contact && this.settings.contact.web ? this.settings.contact.web : null),
      }),

      social: this.fb.group({
        facebook: new FormControl(this.settings && this.settings.social && this.settings.social.facebook ? this.settings.social.facebook : null),
        twitter: new FormControl(this.settings && this.settings.social && this.settings.social.twitter ? this.settings.social.twitter : null),
        instagram: new FormControl(this.settings && this.settings.social && this.settings.social.instagram ? this.settings.social.instagram : null),
        linkedin: new FormControl(this.settings && this.settings.social && this.settings.social.linkedin ? this.settings.social.linkedin : null),
        youtube: new FormControl(this.settings && this.settings.social && this.settings.social.youtube ? this.settings.social.youtube : null),
      }),

      meta: this.fb.group({
        title: new FormControl(this.settings && this.settings.meta && this.settings.meta.title ? this.settings.meta.title : null),
        description: new FormControl(this.settings && this.settings.meta && this.settings.meta.description ? this.settings.meta.description : null),
        keywords: new FormControl(this.settings && this.settings.meta && this.settings.meta.keywords ? this.settings.meta.keywords : null),
        author: new FormControl(this.settings && this.settings.meta && this.settings.meta.author ? this.settings.meta.author : null),
        robots: new FormControl(this.settings && this.settings.meta && this.settings.meta.robots ? this.settings.meta.robots : null),
      }),

    });
  }

  // phone array form
  createPhone(item) {
    return this.fb.group({
      type: item.type || null,
      number: item.number || null,
      person: item.person || null
    });
  }

  addPhone() {
    const group = this.fb.group({
      type: null,
      number: null,
      person: null,
    })

    const phonesArray = this.settingsForm.get('contact').get('phones') as FormArray;
    phonesArray.push(group);
  }

  removePhone(index) {
    let phonesArray = this.settingsForm.get('contact').get('phones') as FormArray;
    phonesArray.removeAt(index);
  }

  get phones(): FormArray {
    return this.settingsForm.get('contact').get('phones') as FormArray;
  }

  saveSettings() {
    this.saveSettingsSubscription = this.settingsService.saveSettings(this.settingsForm.value).subscribe();
  }

  ngOnDestroy(): void {
    this.saveSettingsSubscription.unsubscribe();
  }

}
