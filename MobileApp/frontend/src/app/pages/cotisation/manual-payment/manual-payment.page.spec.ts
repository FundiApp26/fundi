import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualPaymentPage } from './manual-payment.page';

describe('ManualPaymentPage', () => {
  let component: ManualPaymentPage;
  let fixture: ComponentFixture<ManualPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
