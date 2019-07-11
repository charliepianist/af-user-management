import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {

  @Input() button: boolean;
  toDelete: boolean = false;
  @Output() onDelete = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  throwDeleteEvent() {
    this.onDelete.next();
  }

}
