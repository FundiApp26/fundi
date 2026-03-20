import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  standalone: false,
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  tontines: any[] = [];

  constructor(private location: Location, private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.api.get<any[]>('cotisations').subscribe({
      next: (list) => {
        this.tontines = (list || []).map((c, i) => ({
          name: c.name || 'Tontine ' + (i + 1),
          status: c.status === 'active' ? 'En cours' : 'Terminé',
          amount: (c.amount || 0).toLocaleString('fr-FR') + ' Fcfa/s',
          duration: '',
          echec: c.status === 'completed' ? 'Aucun échec' : '',
        }));
      },
      error: () => {
        this.tontines = [
          { name: 'Tontine 1', status: 'Terminé', amount: '5000 Fcfa/s', duration: '2 Mois', echec: 'Aucun échec' },
        ];
      }
    });
  }

  goBack() { this.location.back(); }
}
