import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockProductComponent } from './restock-product.component';

describe('RestockProductComponent', () => {
  let component: RestockProductComponent;
  let fixture: ComponentFixture<RestockProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestockProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestockProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
