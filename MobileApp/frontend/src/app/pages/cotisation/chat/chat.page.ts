import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

interface Message { text: string; time: string; sent: boolean; sender?: string; senderPhone?: string; date?: string; }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  standalone: false,
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  groupName = 'Cotisation 50.000';
  groupSubtitle = 'Voir les détails du groupe';
  isTerminated = false;
  messageText = '';

  messages: Message[] = [
    { text: "Lorem Ipsum is simply dummy text of the printing industry.", time: '23 : 12', sent: false, sender: 'Boris Nama', date: '12 Juin 20211' },
    { text: "Ipsum is simply dummy text of the printing and typesetting industry. is simply dummy text of the printing and", time: '23 : 12', sent: false, senderPhone: '+695 65 87 41', sender: 'Achille Mbam' },
    { text: "Ha d'accord", time: '23 : 32', sent: true },
    { text: "Bonjour ! Comment tu vas ?", time: '07 : 18', sent: false, sender: 'Charly Mzambo', date: "Aujourd'hui" },
    { text: "Bonjour Nadine", time: '07 : 48', sent: true },
  ];

  constructor(private route: ActivatedRoute, private router: Router, private location: Location) {}

  ngOnInit() {
    const name = this.route.snapshot.queryParams['name'];
    if (name) this.groupName = name;
    const terminated = this.route.snapshot.queryParams['terminated'];
    if (terminated) this.isTerminated = true;
  }

  goBack() { this.location.back(); }
  openProfile() { this.router.navigate(['/cotisation/members-list']); }
  openCalendar() { this.router.navigate(['/cotisation/calendar']); }

  sendMessage() {
    if (this.messageText.trim() && !this.isTerminated) {
      this.messages.push({ text: this.messageText.trim(), time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), sent: true });
      this.messageText = '';
    }
  }

  relancerCotisation() {
    this.isTerminated = false;
  }
}
