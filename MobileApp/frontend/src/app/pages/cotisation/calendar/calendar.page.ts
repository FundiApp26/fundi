import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  standalone: false,
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  cotisationId = '';
  cotisationName = '';
  tours: any[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.cotisationId = this.route.snapshot.queryParams['id'] || '';
    if (this.cotisationId) this.loadData();
  }

  loadData() {
    this.api.get<any>(`cotisations/${this.cotisationId}`).subscribe({
      next: (c) => {
        this.cotisationName = c.name;
        this.tours = (c.tours || []).map((t: any) => ({
          number: t.tourNumber,
          date: new Date(t.scheduledDate),
          beneficiary: t.beneficiary ? t.beneficiary.firstName + ' ' + t.beneficiary.lastName : 'Non assigné',
          status: t.status,
        }));
      }
    });
  }

  goBack() { this.location.back(); }

  formatDate(d: Date): string {
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  isToday(d: Date): boolean {
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  isPast(d: Date): boolean {
    return d < new Date();
  }
}
