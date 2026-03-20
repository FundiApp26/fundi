import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhoneVerifyPage } from './phone-verify.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneVerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneVerifyPageRoutingModule {}
