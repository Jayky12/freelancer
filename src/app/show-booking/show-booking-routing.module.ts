import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowBookingPage } from './show-booking.page';

const routes: Routes = [
  {
    path: '',
    component: ShowBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowBookingPageRoutingModule {}
