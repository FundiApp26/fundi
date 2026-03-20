import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-manual-payment',
  templateUrl: './manual-payment.page.html',
  standalone: false,
  styleUrls: ['./manual-payment.page.scss'],
})
export class ManualPaymentPage implements OnInit {
  cotisationId = '';
  personne = '';
  montant = '';
  proofImage: string | null = null;
  showSuccess = false;
  loading = false;
  activeTourId = '';

  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.cotisationId = this.route.snapshot.queryParams['id'] || '';
    if (this.cotisationId) {
      this.api.get<any>(`cotisations/${this.cotisationId}`).subscribe({
        next: (c) => {
          const activeTour = (c.tours || []).find((t: any) => t.status === 'active');
          if (activeTour) this.activeTourId = activeTour.id;
        }
      });
    }
  }

  goBack() { this.location.back(); }
  pickImage() { /* TODO: Capacitor Camera */ }

  confirm() {
    if (!this.activeTourId) { this.showSuccess = true; return; }
    this.loading = true;

    this.api.post(`cotisations/${this.cotisationId}/payments/manual`, {
      tourId: this.activeTourId,
      amount: parseInt(this.montant.replace(/\D/g, '')) || 0,
      proofUrl: this.proofImage,
    }).subscribe({
      next: () => { this.loading = false; this.showSuccess = true; },
      error: () => { this.loading = false; this.showSuccess = true; }
    });
  }

  close() { this.showSuccess = false; this.location.back(); }
}
