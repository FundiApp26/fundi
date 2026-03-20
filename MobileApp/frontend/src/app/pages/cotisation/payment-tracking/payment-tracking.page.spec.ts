import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentTrackingPage } from './payment-tracking.page';

describe('PaymentTrackingPage', () => {
  let component: PaymentTrackingPage;
  let fixture: ComponentFixture<PaymentTrackingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
