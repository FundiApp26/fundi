import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({ selector: 'app-premium', templateUrl: './premium.page.html', standalone: false, styleUrls: ['./premium.page.scss'] })
export class PremiumPage {
  constructor(private location: Location) {}
  goBack() { this.location.back(); }
  devenirPremium() { /* TODO: Dohone payment */ }
}
