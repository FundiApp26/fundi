import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({ selector: 'app-premium', templateUrl: './premium.page.html', standalone: false, styleUrls: ['./premium.page.scss'] })
export class PremiumPage {
  loading = false;
  constructor(private location: Location, private api: ApiService) {}
  goBack() { this.location.back(); }

  devenirPremium() {
    this.loading = true;
    this.api.post('premium/subscribe', { operator: 'om' }).subscribe({
      next: () => { this.loading = false; alert('Souscription initiée ! Suivez les instructions de votre opérateur.'); },
      error: (err) => { this.loading = false; alert(err.error?.error || 'Erreur'); }
    });
  }
}
