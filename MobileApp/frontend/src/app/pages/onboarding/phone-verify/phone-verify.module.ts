import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PhoneVerifyPageRoutingModule } from './phone-verify-routing.module';
import { PhoneVerifyPage } from './phone-verify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhoneVerifyPageRoutingModule
  ],
  declarations: [PhoneVerifyPage]
})
export class PhoneVerifyPageModule {}
