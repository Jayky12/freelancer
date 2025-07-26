import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowBookingPageRoutingModule } from './show-booking-routing.module';

import { ShowBookingPage } from './show-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowBookingPageRoutingModule
  ],
  declarations: [ShowBookingPage]
})
export class ShowBookingPageModule {}
