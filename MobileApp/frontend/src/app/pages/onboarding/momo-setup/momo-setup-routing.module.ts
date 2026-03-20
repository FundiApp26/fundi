import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MomoSetupPage } from './momo-setup.page';

const routes: Routes = [
  {
    path: '',
    component: MomoSetupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MomoSetupPageRoutingModule {}
