import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-pin-login',
  templateUrl: './pin-login.page.html',
  standalone: false,
  styleUrls: ['./pin-login.page.scss'],
})
export class PinLoginPage implements OnInit {
  pinValue = '';
  error = '';
  loading = false;
  userPhone = '';

  keypad = [
    [{ d: '1', sub: '' }, { d: '2', sub: 'ABC' }, { d: '3', sub: 'DEF' }],
    [{ d: '4', sub: 'GHI' }, { d: '5', sub: 'JKL' }, { d: '6', sub: 'MNO' }],
    [{ d: '7', sub: 'PQRS' }, { d: '8', sub: 'TUV' }, { d: '9', sub: 'WXYZ' }],
    [{ d: '+', sub: '' }, { d: '0', sub: '' }, { d: 'back', sub: '' }],
  ];

  constructor(private router: Router, private location: Location, private auth: AuthService, private storage: StorageService) {}

  async ngOnInit() {
    // Get stored phone from previous OTP verification
    this.userPhone = await this.storage.get('fundi_setup_phone') || '';
    // Or from last logged-in user
    const user = await this.auth.getUser();
    if (user?.phone) this.userPhone = user.phone;
  }

  get pinDots(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < this.pinValue.length);
  }

  goBack() { this.location.back(); }

  onKeyAction(key: string) {
    if (key === 'back') { if (this.pinValue.length > 0) this.pinValue = this.pinValue.slice(0, -1); }
    else if (key === '+') { return; }
    else if (this.pinValue.length < 5) { this.pinValue += key; this.error = ''; }
  }

  onConfirm() {
    if (!this.userPhone) { this.error = 'Numéro non trouvé'; return; }
    this.loading = true;

    this.auth.login(this.userPhone, this.pinValue).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tabs'], { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Code PIN incorrect';
        this.pinValue = '';
      }
    });
  }

  forgotPassword() { this.router.navigate(['/forgot-password']); }
}
