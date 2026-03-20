import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({ selector: 'app-notifications', templateUrl: './notifications.page.html', standalone: false, styleUrls: ['./notifications.page.scss'] })
export class NotificationsPage implements OnInit {
  groups: any[] = [];

  constructor(private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>('admin/notifications').subscribe({
      next: (notifs) => {
        const today: any[] = [];
        const older: any[] = [];
        const now = new Date();
        (notifs || []).forEach((n: any) => {
          const d = new Date(n.createdAt);
          const item = { icon: '', initials: '', name: n.title, text: n.body, time: this.timeAgo(d), unread: !n.isRead };
          if (d.toDateString() === now.toDateString()) today.push(item);
          else older.push(item);
        });
        this.groups = [];
        if (today.length) this.groups.push({ label: "Aujourd'hui", items: today });
        if (older.length) this.groups.push({ label: 'Plus ancien', items: older });
        if (!this.groups.length) this.groups.push({ label: "Aujourd'hui", items: [{ icon: '', initials: '', name: 'Aucune notification', text: '', time: '', unread: false }] });
      },
      error: () => {
        this.groups = [{ label: "Aujourd'hui", items: [{ icon: '', name: 'Aucune notification', text: '', time: '', unread: false }] }];
      }
    });
  }

  timeAgo(d: Date): string {
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1) return "à l'instant";
    if (diff < 60) return `il y a ${diff} minutes`;
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)} heures`;
    return `il y a ${Math.floor(diff / 1440)} jours`;
  }

  goBack() { this.location.back(); }
}
