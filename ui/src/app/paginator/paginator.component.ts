import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() pageNumber: number;
  @Input() totalPages: number;
  @Input() startElement: number;
  @Input() endElement: number;
  @Input() totalElements: number;
  @Input() first: boolean;
  @Input() last: boolean;
  @Output() pageChange = new EventEmitter<number>();
  pageToGoTo: number;

  constructor() { }

  ngOnInit() {
    this.pageToGoTo = this.pageNumber;
  }

  ngOnChanges(changes: SimpleChanges) {
    // update pageToGoTo with new pageNumber
    this.ngOnInit();
  }

  nextPage() {
    this.pageChange.next(this.pageNumber);
  }

  previousPage() {
    this.pageChange.next(this.pageNumber - 2);
  }

  goToPage() {
    this.pageToGoTo = Math.min(this.pageToGoTo, this.totalPages);
    this.pageChange.next(this.pageToGoTo - 1);
  }

}
