import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.page.html',
  standalone: false,
  styleUrls: ['./payment-form.page.scss'],
})
export class PaymentFormPage {
  montant = '50.000';
  selectedOperator: 'om' | 'momo' | null = null;
  confirmationName = 'Onana mbarga jean';
  showSuccess = false;

  constructor(private location: Location) {}
  goBack() { this.location.back(); }
  confirm() { this.showSuccess = true; }
  close() { this.showSuccess = false; this.location.back(); }
}
