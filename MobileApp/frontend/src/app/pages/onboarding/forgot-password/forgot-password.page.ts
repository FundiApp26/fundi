import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  standalone: false,
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  phase: 'phone' | 'verify' | 'newpass' = 'phone';
  phoneNumber = '';
  otpValue = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  loading = false;
  devCode = '';
  activePassField: 'new' | 'confirm' = 'new';

  keypad = [
    [{ d: '1', sub: '' }, { d: '2', sub: 'ABC' }, { d: '3', sub: 'DEF' }],
    [{ d: '4', sub: 'GHI' }, { d: '5', sub: 'JKL' }, { d: '6', sub: 'MNO' }],
    [{ d: '7', sub: 'PQRS' }, { d: '8', sub: 'TUV' }, { d: '9', sub: 'WXYZ' }],
    [{ d: '+', sub: '' }, { d: '0', sub: '' }, { d: 'back', sub: '' }],
  ];

  constructor(private router: Router, private location: Location, private auth: AuthService) {}

  get otpDigits(): string[] {
    const arr = this.otpValue.split('');
    while (arr.length < 4) arr.push('');
    return arr.slice(0, 4);
  }

  onKeyAction(key: string) {
    if (key === 'back') {
      if (this.phase === 'phone' && this.phoneNumber.length > 0) this.phoneNumber = this.phoneNumber.slice(0, -1);
      else if (this.phase === 'verify' && this.otpValue.length > 0) this.otpValue = this.otpValue.slice(0, -1);
    } else if (key !== '+') {
      if (this.phase === 'phone' && this.phoneNumber.length < 9) this.phoneNumber += key;
      else if (this.phase === 'verify' && this.otpValue.length < 4) this.otpValue += key;
    }
  }

  onNewPassKey(key: string) {
    if (key === 'back') {
      if (this.activePassField === 'new' && this.newPassword.length > 0) this.newPassword = this.newPassword.slice(0, -1);
      else if (this.activePassField === 'confirm' && this.confirmPassword.length > 0) this.confirmPassword = this.confirmPassword.slice(0, -1);
    } else if (key !== '+') {
      if (this.activePassField === 'new') this.newPassword += key;
      else this.confirmPassword += key;
    }
  }

  setActiveField(field: 'new' | 'confirm') { this.activePassField = field; }

  sendCode() {
    if (this.phoneNumber.length < 9) return;
    this.loading = true;
    const phone = '+237' + this.phoneNumber;

    this.auth.forgotPassword(phone).subscribe({
      next: (res: any) => { this.loading = false; this.devCode = res.devCode || ''; this.phase = 'verify'; },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Erreur'; }
    });
  }

  verifyCode() {
    if (this.otpValue.length === 4) this.phase = 'newpass';
  }

  savePassword() {
    if (this.newPassword.length < 5) { this.error = 'Le mot de passe doit contenir au moins 5 caractères'; return; }
    if (this.newPassword !== this.confirmPassword) { this.error = 'Les mots de passe ne correspondent pas'; return; }

    this.loading = true;
    const phone = '+237' + this.phoneNumber;

    this.auth.resetPassword(phone, this.otpValue, this.newPassword).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/pin-login'], { replaceUrl: true }); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Erreur'; }
    });
  }

  goBack() {
    if (this.phase === 'verify') { this.phase = 'phone'; this.otpValue = ''; }
    else if (this.phase === 'newpass') { this.phase = 'verify'; }
    else { this.location.back(); }
  }
}
