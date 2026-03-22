import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  standalone: false,
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  // Phase 1: tilted logo → Phase 2: straight logo → Phase 3: logo + slogan
  phase: 'tilted' | 'straight' | 'slogan' = 'tilted';

  constructor(private router: Router) {}

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }

    // Phase 1: Tilted logo (1.5s)
    setTimeout(() => {
      this.phase = 'straight';
    }, 1500);

    // Phase 2: Straight logo (1.5s)
    setTimeout(() => {
      this.phase = 'slogan';
    }, 3000);

    // Phase 3: Logo + slogan (1.5s) then navigate
    setTimeout(() => {
      this.router.navigate(['/onboarding'], { replaceUrl: true });
    }, 4500);
  }
}
