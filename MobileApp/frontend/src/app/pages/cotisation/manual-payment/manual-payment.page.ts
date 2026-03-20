import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manual-payment',
  templateUrl: './manual-payment.page.html',
  standalone: false,
  styleUrls: ['./manual-payment.page.scss'],
})
export class ManualPaymentPage {
  personne = '';
  montant = '';
  proofImage: string | null = null;
  showSuccess = false;

  constructor(private location: Location) {}
  goBack() { this.location.back(); }

  pickImage() {
    // TODO: Capacitor Camera
  }

  confirm() { this.showSuccess = true; }
  close() { this.showSuccess = false; this.location.back(); }
}
