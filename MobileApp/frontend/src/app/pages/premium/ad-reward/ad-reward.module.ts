import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdRewardPageRoutingModule } from './ad-reward-routing.module';
import { AdRewardPage } from './ad-reward.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdRewardPageRoutingModule
  ],
  declarations: [AdRewardPage]
})
export class AdRewardPageModule {}
