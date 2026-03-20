import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  standalone: false,
  styleUrls: ['./members-list.page.scss'],
})
export class MembersListPage implements OnInit {
  cotisationId = '';
  cotisation: any = { name: 'Cotisation', status: 'active', description: '', montant: '0 Fcfa / Mois', avatar: '' };
  members: any[] = [];
  showDepotModal = false;
  depotType: 'app' | 'externe' = 'app';

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.cotisationId = this.route.snapshot.queryParams['id'] || '';
    if (this.cotisationId) this.loadCotisation();
  }

  loadCotisation() {
    this.api.get<any>(`cotisations/${this.cotisationId}`).subscribe({
      next: (c) => {
        this.cotisation = { name: c.name, status: c.status, description: c.description || '', montant: c.amount.toLocaleString('fr-FR') + ' Fcfa / Mois', avatar: c.avatarUrl };
        this.members = (c.members || []).map((m: any) => ({ name: m.user.firstName + ' ' + m.user.lastName, phone: m.user.phone, avatar: m.user.avatarUrl || '' }));
      }
    });
  }

  goBack() { this.location.back(); }
  openCotiser() { this.showDepotModal = true; }
  openListe() { this.router.navigate(['/cotisation/payment-tracking'], { queryParams: { id: this.cotisationId } }); }
  openCalendrier() { this.router.navigate(['/cotisation/calendar'], { queryParams: { id: this.cotisationId } }); }

  confirmDepot() {
    this.showDepotModal = false;
    if (this.depotType === 'app') this.router.navigate(['/cotisation/payment-form'], { queryParams: { id: this.cotisationId } });
    else this.router.navigate(['/cotisation/manual-payment'], { queryParams: { id: this.cotisationId } });
  }
}
