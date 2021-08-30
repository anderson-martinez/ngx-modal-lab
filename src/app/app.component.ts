import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { ModalContentProofComponent } from './components/modal-content-proof/modal-content-proof.component';
import { ModalConfigService } from './wdpr-modal/services/modal-config.service';
import { ModalService } from './wdpr-modal/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'angular-modal-example';
  constructor(private _modalService: ModalService, private modalConfigService: ModalConfigService) { }
  @ViewChild('div') private div: HTMLElement;
  ngOnInit(): void {
    this.modalConfigService.animation = true;
    this.modalConfigService.backdrop = 'static';

  }
  open() {
    this._modalService.open(ModalContentProofComponent, { animation: false, centered: false, size: 'xl' });
  }
}
