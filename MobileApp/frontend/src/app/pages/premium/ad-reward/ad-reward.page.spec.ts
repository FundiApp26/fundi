import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdRewardPage } from './ad-reward.page';

describe('AdRewardPage', () => {
  let component: AdRewardPage;
  let fixture: ComponentFixture<AdRewardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdRewardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
