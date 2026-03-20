import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({ selector: 'app-notifications', templateUrl: './notifications.page.html', standalone: false, styleUrls: ['./notifications.page.scss'] })
export class NotificationsPage {
  groups = [
    { label: "Aujourd'hui", items: [
      { avatar: '', initials: '', icon: 'cash-outline', name: 'Steve Mongan Fah', text: 'vient de vous effectuer un dépôt externe', time: 'il y a 3 minutes', unread: true },
      { avatar: '', initials: '', icon: '', name: 'Stephane Happi', text: 'st désormais votre nouveau coach personnel', time: 'il y a 13 minutes', unread: false },
      { avatar: '', initials: 'AF', icon: '', name: "L'atelier Francine Lenteu", text: 'vous a envoyé un message.', time: 'il y a 1 jour', unread: false },
    ]},
    { label: 'Hier', items: [
      { avatar: '', initials: '', icon: '', name: 'John Malick B.', text: 'est désormais votre nouveau coach personnel', time: 'il y a 4 jours', unread: false },
      { avatar: '', initials: '', icon: '', name: 'Stephane Happi', text: 'vous a envoyé un message.', time: 'Vous avez 4 amis en commun', unread: true },
      { avatar: '', initials: 'AD', icon: '', name: 'Stephane Happi', text: 'vous a envoyé un message.', time: 'Vous avez 4 amis en commun', unread: false },
      { avatar: '', initials: 'GB', icon: '', name: 'Ghislain Bounda', text: 'vous a envoyé un message.', time: 'Vous avez 4 amis en commun', unread: true },
    ]}
  ];
  constructor(private location: Location) {}
  goBack() { this.location.back(); }
}
