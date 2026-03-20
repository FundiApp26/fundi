import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { OtpVerifyPage } from './otp-verify.page';

const routes: Routes = [{ path: '', component: OtpVerifyPage }];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [OtpVerifyPage]
})
export class OtpVerifyPageModule {}
