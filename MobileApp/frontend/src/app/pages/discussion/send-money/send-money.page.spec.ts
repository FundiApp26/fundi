import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMoneyPage } from './send-money.page';

describe('SendMoneyPage', () => {
  let component: SendMoneyPage;
  let fixture: ComponentFixture<SendMoneyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
