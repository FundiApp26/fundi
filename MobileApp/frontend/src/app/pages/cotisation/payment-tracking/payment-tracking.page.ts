import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

interface MemberItem { num: number; name: string; date: string; checked: boolean; amount?: string; detail?: string; status?: string; isBeneficiary?: boolean; }

@Component({
  selector: 'app-payment-tracking',
  templateUrl: './payment-tracking.page.html',
  standalone: false,
  styleUrls: ['./payment-tracking.page.scss'],
})
export class PaymentTrackingPage implements OnInit {
  cotisationId = '';
  view: 'members' | 'tracking' = 'members';
  searchQuery = '';
  showDetail = false;
  detailMember: MemberItem | null = null;
  members: MemberItem[] = [];
  tracking: MemberItem[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.cotisationId = this.route.snapshot.queryParams['id'] || '';
    if (this.cotisationId) this.loadData();
  }

  loadData() {
    this.api.get<any>(`cotisations/${this.cotisationId}`).subscribe({
      next: (c) => {
        this.members = (c.members || []).map((m: any, i: number) => ({
          num: i + 1,
          name: m.user.firstName + ' ' + (m.user.lastName || ''),
          date: '',
          checked: false,
        }));

        // Load tours for tracking view
        this.api.get<any[]>(`cotisations/${this.cotisationId}/tours`).subscribe({
          next: (tours) => {
            this.tracking = (tours || []).map((t: any) => ({
              num: t.tourNumber,
              name: t.beneficiary ? t.beneficiary.firstName + ' ' + t.beneficiary.lastName : 'TBD',
              date: new Date(t.scheduledDate).toLocaleDateString('fr-FR'),
              checked: t.status === 'completed',
              status: t.status,
              isBeneficiary: true,
            }));

            // Update members with tour dates
            this.members.forEach((m, i) => {
              const tour = (tours || []).find((t: any) => t.tourNumber === i + 1);
              if (tour) m.date = new Date(tour.scheduledDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
            });
          }
        });
      }
    });
  }

  goBack() { this.location.back(); }
  switchView(v: 'members' | 'tracking') { this.view = v; }
  openDetail(m: MemberItem) { this.detailMember = m; this.showDetail = true; }
  closeDetail() { this.showDetail = false; this.detailMember = null; }
}
