import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneVerifyPage } from './phone-verify.page';

describe('PhoneVerifyPage', () => {
  let component: PhoneVerifyPage;
  let fixture: ComponentFixture<PhoneVerifyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneVerifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
