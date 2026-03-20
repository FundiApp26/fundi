import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { HistoryTransactionsPage } from './history-transactions.page';
const routes: Routes = [{ path: '', component: HistoryTransactionsPage }];
@NgModule({ imports: [CommonModule, IonicModule, RouterModule.forChild(routes)], declarations: [HistoryTransactionsPage] })
export class HistoryTransactionsPageModule {}
