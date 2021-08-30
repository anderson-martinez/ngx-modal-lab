import { Output } from "@angular/core";
import { Component } from "@angular/core";
import { EventEmitter } from "stream";

@Component({
    selector: 'mock-modal-window',
    styles: [''],
    template: `
        <div>
        </div>
    `
})
export class ModalWindowComponent {

    @Output('dismiss') public dismissEvent = new EventEmitter();

    constructor() { }


}