import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({ selector: 'app-about', templateUrl: './about.page.html', standalone: false, styleUrls: ['./about.page.scss'] })
export class AboutPage { constructor(private location: Location) {} goBack() { this.location.back(); } }
