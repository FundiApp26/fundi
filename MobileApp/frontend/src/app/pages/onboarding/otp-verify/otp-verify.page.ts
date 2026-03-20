import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.page.html',
  standalone: false,
  styleUrls: ['./otp-verify.page.scss'],
})
export class OtpVerifyPage implements OnInit, OnDestroy {
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  phone = '';
  rawPhone = '';
  otpValue = '';
  resendTimer = 57;
  callTimer = 58;
  loading = false;
  private timerInterval: any;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private location: Location, private auth: AuthService, private storage: StorageService
  ) {}

  ngOnInit() {
    this.rawPhone = this.route.snapshot.queryParams['phone'] || '+237000000000';
    this.phone = this.formatPhoneDisplay(this.rawPhone);
    this.startTimer();
  }

  ngOnDestroy() { clearInterval(this.timerInterval); }

  formatPhoneDisplay(raw: string): string {
    const d = raw.replace(/\D/g, '');
    if (d.length >= 12) return `+(${d.substring(0, 3)}) ${d.substring(3, 6)} ${d.substring(6, 9)} ${d.substring(9, 12)}`;
    return raw;
  }

  startTimer() {
    this.resendTimer = 57; this.callTimer = 58;
    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) this.resendTimer--;
      if (this.callTimer > 0) this.callTimer--;
      if (this.resendTimer === 0 && this.callTimer === 0) clearInterval(this.timerInterval);
    }, 1000);
  }

  formatTimer(seconds: number): string {
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  get otpDigits(): string[] {
    const arr = this.otpValue.split('');
    while (arr.length < 6) arr.push('');
    return arr.slice(0, 6);
  }

  focusInput() { setTimeout(() => this.hiddenInput?.nativeElement?.focus(), 100); }

  onOtpChange() {
    this.otpValue = this.otpValue.replace(/\D/g, '').substring(0, 6);
    if (this.otpValue.length === 6) this.verifyOtp();
  }

  goBack() { this.location.back(); }

  verifyOtp() {
    if (this.otpValue.length !== 6) return;
    this.loading = true;

    this.auth.verifyOtp(this.rawPhone, this.otpValue).subscribe({
      next: (res) => {
        this.loading = false;
        // Store phone for registration flow
        this.storage.set('fundi_setup_phone', this.rawPhone);

        if (res.isNewUser) {
          this.router.navigate(['/profile-setup'], { replaceUrl: true });
        } else {
          // Existing user → go to PIN login
          this.router.navigate(['/pin-login'], { replaceUrl: true });
        }
      },
      error: () => {
        this.loading = false;
        this.otpValue = '';
      }
    });
  }

  resendSms() {
    if (this.resendTimer === 0) {
      this.auth.sendOtp(this.rawPhone).subscribe();
      this.startTimer();
    }
  }

  wrongNumber() { this.router.navigate(['/phone-verify'], { replaceUrl: true }); }
}
