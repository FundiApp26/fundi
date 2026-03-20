import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualPaymentPage } from './manual-payment.page';

const routes: Routes = [
  {
    path: '',
    component: ManualPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualPaymentPageRoutingModule {}
