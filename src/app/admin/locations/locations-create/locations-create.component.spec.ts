import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsCreateComponent } from './locations-create.component';

describe('LocationsCreateComponent', () => {
  let component: LocationsCreateComponent;
  let fixture: ComponentFixture<LocationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LocationsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
