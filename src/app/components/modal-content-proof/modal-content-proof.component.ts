import { Component, Input, OnInit } from '@angular/core';
import { ActiveModal } from 'src/app/wdpr-modal/classes/active-modal';
import { ModalService } from 'src/app/wdpr-modal/services/modal.service';
import { ModalComponentTestV2Component } from '../modal-component-test-v2/modal-component-test-v2.component';

@Component({
  selector: 'app-modal-content-proof',
  templateUrl: './modal-content-proof.component.html',
  styleUrls: ['./modal-content-proof.component.less']
})
export class ModalContentProofComponent implements OnInit {

  @Input() name;

  constructor(public activeModal: ActiveModal, private _modalService: ModalService) { }

  ngOnInit(): void {
  }

  openNewModal() {
    const modalref = this._modalService.open(ModalComponentTestV2Component);
    modalref.componentInstance.title = "test";
    modalref.componentInstance.buttons = [{ label: 'un botoncito', class: 'x' }, { label: 'otro botoncito', class: 'y' }];
  }
}
