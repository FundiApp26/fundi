import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PaymentTrackingPageRoutingModule } from './payment-tracking-routing.module';
import { PaymentTrackingPage } from './payment-tracking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentTrackingPageRoutingModule
  ],
  declarations: [PaymentTrackingPage]
})
export class PaymentTrackingPageModule {}
