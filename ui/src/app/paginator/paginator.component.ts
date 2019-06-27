import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Page } from '../model/page';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() page: Page<any>;
  pageNumber: number; // indexed at 1; Spring indexes at 0
  totalPages: number;
  startElement: number;
  endElement: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  @Output() pageChange = new EventEmitter<number>();
  pageToGoTo: number;

  constructor() { }

  ngOnInit() {
    this.pageNumber = this.page.number + 1;
    this.totalPages = this.page.totalPages;
    this.startElement = this.page.pageable.offset + 1;
    this.endElement = this.page.pageable.offset + this.page.numberOfElements;
    this.totalElements = this.page.totalElements;
    this.first = this.page.first;
    this.last = this.page.last;

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
