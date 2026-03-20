import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MomoSetupPageRoutingModule } from './momo-setup-routing.module';
import { MomoSetupPage } from './momo-setup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomoSetupPageRoutingModule
  ],
  declarations: [MomoSetupPage]
})
export class MomoSetupPageModule {}
