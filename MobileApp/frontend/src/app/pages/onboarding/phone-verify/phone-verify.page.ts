import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-phone-verify',
  templateUrl: './phone-verify.page.html',
  standalone: false,
  styleUrls: ['./phone-verify.page.scss'],
})
export class PhoneVerifyPage {
  phoneNumber = '';
  showConfirmModal = false;
  loading = false;

  constructor(private router: Router, private location: Location, private auth: AuthService) {}

  goBack() { this.location.back(); }

  onPhoneInput() { this.phoneNumber = this.phoneNumber.replace(/\D/g, ''); }

  openCountryPicker() {}

  formatPhone(num: string): string {
    if (num.length >= 9) return `${num.substring(0, 3)} ${num.substring(3, 6)} ${num.substring(6, 9)}`;
    return num;
  }

  onNext() {
    if (this.phoneNumber.length >= 9) this.showConfirmModal = true;
  }

  confirmNumber() {
    this.showConfirmModal = false;
    this.loading = true;
    const phone = '+237' + this.phoneNumber;

    this.auth.sendOtp(phone).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/otp-verify'], { queryParams: { phone } });
      },
      error: (err) => {
        this.loading = false;
        console.error('OTP send failed', err);
        // Navigate anyway for dev (SMS might not be configured)
        this.router.navigate(['/otp-verify'], { queryParams: { phone } });
      }
    });
  }
}
