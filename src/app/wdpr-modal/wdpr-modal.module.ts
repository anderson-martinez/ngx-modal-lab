import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { ModalBackdropComponent } from './components/modal-backdrop/modal-backdrop.component';
import { ModalService } from './services/modal.service';


@NgModule({
  declarations: [ModalWindowComponent, ModalBackdropComponent],
  imports: [
    CommonModule
  ],
  providers: [ModalService],
})
export class WdprModalModule { }
