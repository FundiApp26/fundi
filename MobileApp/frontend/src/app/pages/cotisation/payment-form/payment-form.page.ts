import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.page.html',
  standalone: false,
  styleUrls: ['./payment-form.page.scss'],
})
export class PaymentFormPage implements OnInit {
  cotisationId = '';
  montant = '50.000';
  selectedOperator: 'om' | 'momo' | null = null;
  confirmationName = '';
  showSuccess = false;
  loading = false;
  activeTourId = '';

  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.cotisationId = this.route.snapshot.queryParams['id'] || '';
    if (this.cotisationId) this.loadCotisationInfo();
  }

  loadCotisationInfo() {
    this.api.get<any>(`cotisations/${this.cotisationId}`).subscribe({
      next: (c) => {
        this.montant = c.amount.toLocaleString('fr-FR');
        const activeTour = (c.tours || []).find((t: any) => t.status === 'active');
        if (activeTour) this.activeTourId = activeTour.id;
      }
    });
  }

  goBack() { this.location.back(); }

  confirm() {
    if (!this.selectedOperator || !this.activeTourId) { this.showSuccess = true; return; }
    this.loading = true;

    this.api.post(`cotisations/${this.cotisationId}/payments/initiate`, {
      tourId: this.activeTourId,
      operator: this.selectedOperator,
    }).subscribe({
      next: () => { this.loading = false; this.showSuccess = true; },
      error: () => { this.loading = false; this.showSuccess = true; }
    });
  }

  close() { this.showSuccess = false; this.location.back(); }
}
