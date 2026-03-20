import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NewDiscussionPage } from './new-discussion.page';

const routes: Routes = [{ path: '', component: NewDiscussionPage }];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [NewDiscussionPage]
})
export class NewDiscussionPageModule {}
