import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  @Input() text: string;
  @Input() tooltip: string;
  @Input() color: string = 'rgba(56, 56, 56, 0.9)';

  // questionColor, size, and icon are currently unused (always have default values)
  @Input() questionColor: string = 'rgba(47, 79, 79, 0.5)';
  @Input() size: number = 100;
  @Input() icon: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
