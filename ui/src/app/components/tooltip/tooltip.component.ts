import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DOMManip } from 'src/app/helper/dom-manip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  static readonly MAX_WIDTH = 475;

  @Input() text: string;
  @Input() tooltip: string;
  @Input() color: string = 'rgba(56, 56, 56, 0.9)';

  // questionColor, size, and icon are currently unused (always have default values)
  @Input() questionColor: string = 'rgba(47, 79, 79, 0.5)';
  @Input() size: number = 100;
  @Input() icon: boolean = true;

  descriptionWidth: number = 160;

  @ViewChild('description') descriptionElement: ElementRef;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    this.tooltip = 'OneWordddddddddd'
    if(!this.hasTextAndTooltip()) {
      alert('text or tooltip is null in TooltipComponent ' + this);
    }
  }

  ngAfterViewInit() {
    // Calculate tooltip width
    if(this.hasTextAndTooltip()) {
      setTimeout(() => {
          this.descriptionWidth = Math.min(
            DOMManip.getUnwrappedTextWidthInPixels(
              this.tooltip, 
              DOMManip.getComputedProperty(this.descriptionElement, 'font')
            ) * 2 / 3,
            TooltipComponent.MAX_WIDTH
          );
        }
      );
    }
  }

  hasTextAndTooltip(): boolean {
    return !(isNullOrUndefined(this.text) || isNullOrUndefined(this.tooltip));
  }
}
