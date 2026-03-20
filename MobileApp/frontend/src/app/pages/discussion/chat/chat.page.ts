import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface Message {
  text: string;
  time: string;
  sent: boolean;
  date?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  standalone: false,
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  contactName = 'Steph Happi';
  contactAvatar = '';
  messageText = '';
  showSendMoney = false;
  showSuccess = false;
  sendAmount = '';
  selectedOperator: 'om' | 'momo' | null = null;
  confirmationName = 'Onana mbarga jean';

  messages: Message[] = [
    { text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", time: '23 : 12', sent: false },
    { text: "Ha d'accord", time: '23 : 32', sent: true },
    { text: "Bonjour ! Comment tu vas ?", time: '07 : 18', sent: false, date: "Aujourd'hui" },
    { text: "Bonjour Nadine", time: '07 : 48', sent: true },
  ];

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    const name = this.route.snapshot.queryParams['name'];
    if (name) this.contactName = name;
  }

  goBack() { this.location.back(); }

  sendMessage() {
    if (this.messageText.trim()) {
      this.messages.push({
        text: this.messageText.trim(),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sent: true,
      });
      this.messageText = '';
    }
  }

  openSendMoney() {
    this.showSendMoney = true;
    this.sendAmount = '';
    this.selectedOperator = null;
  }

  confirmSendMoney() {
    this.showSendMoney = false;
    this.showSuccess = true;
  }

  closeSuccess() {
    this.showSuccess = false;
  }
}
