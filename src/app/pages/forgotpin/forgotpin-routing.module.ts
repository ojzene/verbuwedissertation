import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotpinPage } from './forgotpin.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotpinPageRoutingModule {}
