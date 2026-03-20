import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({ selector: 'app-history-transactions', templateUrl: './history-transactions.page.html', standalone: false, styleUrls: ['./history-transactions.page.scss'] })
export class HistoryTransactionsPage implements OnInit {
  groups: any[] = [];

  constructor(private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>('premium/history').subscribe({
      next: (txs) => {
        const byDate: Record<string, any[]> = {};
        (txs || []).forEach((tx: any) => {
          const d = new Date(tx.time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
          if (!byDate[d]) byDate[d] = [];
          byDate[d].push({
            icon: tx.type === 'cotisation' ? 'cash-outline' : '',
            name: tx.name,
            sub: tx.subtype,
            amount: (tx.positive ? '' : '-') + tx.amount.toLocaleString('fr-FR') + ' FCFA',
            time: new Date(tx.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            positive: tx.positive,
          });
        });
        this.groups = Object.entries(byDate).map(([date, items]) => ({ date, items }));
        if (!this.groups.length) this.groups = [{ date: 'Aucune transaction', items: [] }];
      },
      error: () => { this.groups = [{ date: 'Aucune transaction', items: [] }]; }
    });
  }

  goBack() { this.location.back(); }
}
