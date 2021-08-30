import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActiveModal } from 'src/app/wdpr-modal/classes/active-modal';

@Component({
  selector: 'app-modal-component-test-v2',
  templateUrl: './modal-component-test-v2.component.html',
  styleUrls: ['./modal-component-test-v2.component.less']
})
export class ModalComponentTestV2Component implements OnInit {

  @Input() title: string;

  @Input() buttons: {
    label: string;
    class: string;
  }[] = [];

  constructor(public activeModal: ActiveModal) { }

  ngOnInit(): void {
  }

}
