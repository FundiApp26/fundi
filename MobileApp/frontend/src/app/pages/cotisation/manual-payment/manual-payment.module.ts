import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ManualPaymentPageRoutingModule } from './manual-payment-routing.module';
import { ManualPaymentPage } from './manual-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualPaymentPageRoutingModule
  ],
  declarations: [ManualPaymentPage]
})
export class ManualPaymentPageModule {}
