import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDatatable } from './ngx-datatable';

describe('NgxDatatable', () => {
  let component: NgxDatatable;
  let fixture: ComponentFixture<NgxDatatable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDatatable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxDatatable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
