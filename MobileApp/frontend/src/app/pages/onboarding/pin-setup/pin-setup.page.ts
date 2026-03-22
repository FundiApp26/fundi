import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-pin-setup',
  templateUrl: './pin-setup.page.html',
  standalone: false,
  styleUrls: ['./pin-setup.page.scss'],
})
export class PinSetupPage implements OnInit {
  @ViewChild('hiddenPin') hiddenPin!: ElementRef<HTMLInputElement>;

  phase: 'create' | 'confirm' | 'success' = 'create';
  pinValue = '';
  confirmPinValue = '';
  error = '';
  userName = '';
  userPhoto: string | null = null;
  loading = false;

  constructor(
    private router: Router, private location: Location,
    private storage: StorageService, private auth: AuthService, private socket: SocketService
  ) {}

  async ngOnInit() {
    const nom = await this.storage.get('fundi_setup_nom') || '';
    const prenom = await this.storage.get('fundi_setup_prenom') || '';
    this.userName = (nom + '_' + prenom).replace(/\s+/g, '_') || 'Utilisateur';
    this.userPhoto = await this.storage.get('fundi_setup_photo') || null;
    this.focusInput();
  }

  get title(): string {
    return this.phase === 'create' ? 'Créer votre code PIN' : 'Confirmer votre code PIN';
  }

  get currentValue(): string {
    return this.phase === 'create' ? this.pinValue : this.confirmPinValue;
  }

  get pinDots(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < this.currentValue.length);
  }

  focusInput() { setTimeout(() => this.hiddenPin?.nativeElement?.focus(), 200); }

  onPinChange() {
    if (this.phase === 'create') {
      this.pinValue = this.pinValue.replace(/\D/g, '').substring(0, 5);
    } else {
      this.confirmPinValue = this.confirmPinValue.replace(/\D/g, '').substring(0, 5);
    }
    this.error = '';
  }

  goBack() {
    if (this.phase === 'confirm') { this.phase = 'create'; this.confirmPinValue = ''; }
    else { this.location.back(); }
  }

  async onConfirm() {
    if (this.phase === 'create' && this.pinValue.length === 5) {
      this.phase = 'confirm';
      this.confirmPinValue = '';
      this.focusInput();
    } else if (this.phase === 'confirm' && this.confirmPinValue.length === 5) {
      if (this.pinValue !== this.confirmPinValue) {
        this.error = 'Les codes PIN ne correspondent pas';
        this.confirmPinValue = '';
        return;
      }

      // DEV: save locally and go to success — no server call
      // TODO: replace with this.auth.register() when backend is connected
      const phone = await this.storage.get('fundi_setup_phone') || '+237000000000';
      const firstName = await this.storage.get('fundi_setup_nom') || 'Utilisateur';
      const lastName = await this.storage.get('fundi_setup_prenom') || '';

      // Save user data in cache so we can "login" later
      const fakeUser = {
        id: 'local-' + Date.now(),
        phone,
        firstName,
        lastName,
        avatarUrl: await this.storage.get('fundi_setup_photo') || null,
        isPremium: false,
        createdAt: new Date().toISOString(),
      };

      await this.storage.set('fundi_access_token', 'dev-token-' + Date.now());
      await this.storage.set('fundi_refresh_token', 'dev-refresh-' + Date.now());
      await this.storage.set('fundi_user', JSON.stringify(fakeUser));
      await this.storage.set('fundi_pin', this.pinValue);

      this.phase = 'success';
      setTimeout(() => this.router.navigate(['/tabs'], { replaceUrl: true }), 2500);
    }
  }
}
