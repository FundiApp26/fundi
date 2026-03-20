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
  phase: 'logo' | 'name' | 'slogan' = 'logo';

  constructor(private router: Router) {}

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }

    // Phase 1: Logo only (1.5s)
    setTimeout(() => {
      this.phase = 'name';
    }, 1500);

    // Phase 2: Logo + Name (1.5s)
    setTimeout(() => {
      this.phase = 'slogan';
    }, 3000);

    // Phase 3: Logo + Name + Slogan (1.5s) then navigate
    setTimeout(() => {
      this.router.navigate(['/onboarding'], { replaceUrl: true });
    }, 4500);
  }
}
