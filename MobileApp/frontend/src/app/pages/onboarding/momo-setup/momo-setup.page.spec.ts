import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MomoSetupPage } from './momo-setup.page';

describe('MomoSetupPage', () => {
  let component: MomoSetupPage;
  let fixture: ComponentFixture<MomoSetupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MomoSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
