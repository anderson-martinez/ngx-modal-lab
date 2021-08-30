import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WdprModalModule } from './wdpr-modal/wdpr-modal.module';
import { ModalContentProofComponent } from './components/modal-content-proof/modal-content-proof.component';
import { APP_BASE_HREF } from '@angular/common';
import { ModalComponentTestV2Component } from './components/modal-component-test-v2/modal-component-test-v2.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalContentProofComponent,
    ModalComponentTestV2Component
  ],
  imports: [
    BrowserModule,
    WdprModalModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/photopass'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
