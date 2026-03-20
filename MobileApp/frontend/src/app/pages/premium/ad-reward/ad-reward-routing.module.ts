import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdRewardPage } from './ad-reward.page';

const routes: Routes = [
  {
    path: '',
    component: AdRewardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdRewardPageRoutingModule {}
