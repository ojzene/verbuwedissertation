import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpinPageRoutingModule } from './forgotpin-routing.module';

import { ForgotpinPage } from './forgotpin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotpinPageRoutingModule
  ],
  declarations: [ForgotpinPage]
})
export class ForgotpinPageModule {}
