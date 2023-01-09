import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResortsCreateComponent } from './resorts-create.component';

describe('ResortsCreateComponent', () => {
  let component: ResortsCreateComponent;
  let fixture: ComponentFixture<ResortsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ResortsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResortsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
