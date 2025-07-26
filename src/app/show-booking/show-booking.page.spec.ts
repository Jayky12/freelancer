import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowBookingPage } from './show-booking.page';

describe('ShowBookingPage', () => {
  let component: ShowBookingPage;
  let fixture: ComponentFixture<ShowBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
