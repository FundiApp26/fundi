import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembersListPage } from './members-list.page';

describe('MembersListPage', () => {
  let component: MembersListPage;
  let fixture: ComponentFixture<MembersListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
