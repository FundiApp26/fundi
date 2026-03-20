import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  standalone: false,
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  acceptAndContinue() {
    this.router.navigate(['/phone-verify'], { replaceUrl: true });
  }
}
