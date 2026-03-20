import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private socket: SocketService, private auth: AuthService) {}

  async ngOnInit() {
    const isAuth = await this.auth.isAuthenticated();
    if (isAuth) {
      await this.socket.connect();
    }
  }
}
