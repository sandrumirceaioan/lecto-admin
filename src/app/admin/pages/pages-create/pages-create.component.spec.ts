import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesCreateComponent } from './pages-create.component';

describe('PagesCreateComponent', () => {
  let component: PagesCreateComponent;
  let fixture: ComponentFixture<PagesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PagesCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
