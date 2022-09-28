import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsCreateComponent } from './discounts-create.component';

describe('DiscountsCreateComponent', () => {
  let component: DiscountsCreateComponent;
  let fixture: ComponentFixture<DiscountsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DiscountsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
