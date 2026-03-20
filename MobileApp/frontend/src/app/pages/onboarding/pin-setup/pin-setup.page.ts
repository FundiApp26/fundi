import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

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
    private storage: StorageService, private auth: AuthService
  ) {}

  async ngOnInit() {
    const nom = await this.storage.get('fundi_setup_nom') || '';
    const prenom = await this.storage.get('fundi_setup_prenom') || '';
    this.userName = (nom + '_' + prenom).replace(/\s+/g, '_') || 'Utilisateur';
    this.userPhoto = await this.storage.get('fundi_setup_photo') || null;
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

  focusInput() { setTimeout(() => this.hiddenPin?.nativeElement?.focus(), 100); }

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
      setTimeout(() => this.focusInput(), 200);
    } else if (this.phase === 'confirm' && this.confirmPinValue.length === 5) {
      if (this.pinValue !== this.confirmPinValue) {
        this.error = 'Les codes PIN ne correspondent pas';
        this.confirmPinValue = '';
        return;
      }

      // Call register API
      this.loading = true;
      const phone = await this.storage.get('fundi_setup_phone') || '';
      const firstName = await this.storage.get('fundi_setup_nom') || '';
      const lastName = await this.storage.get('fundi_setup_prenom') || '';
      const avatarUrl = await this.storage.get('fundi_setup_photo') || undefined;
      const omNumber = await this.storage.get('fundi_setup_om_number') || undefined;
      const omConfirmName = await this.storage.get('fundi_setup_om_name') || undefined;
      const momoNumber = await this.storage.get('fundi_setup_momo_number') || undefined;
      const momoConfirmName = await this.storage.get('fundi_setup_momo_name') || undefined;

      this.auth.register({
        phone, firstName, lastName, avatarUrl,
        omNumber, omConfirmName, momoNumber, momoConfirmName,
        pin: this.pinValue,
      }).subscribe({
        next: () => {
          this.loading = false;
          this.phase = 'success';
          setTimeout(() => this.router.navigate(['/tabs'], { replaceUrl: true }), 2500);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Erreur lors de la création du compte';
          this.confirmPinValue = '';
        }
      });
    }
  }
}
