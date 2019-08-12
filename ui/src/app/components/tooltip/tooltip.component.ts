import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { isNullOrUndefined } from 'util';

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

  descriptionWidth: number = 160;

  @ViewChild('description') descriptionElement: ElementRef;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    if(!this.hasTextAndTooltip()) {
      console.log('text or tooltip is null in TooltipComponent ' + this);
    }
  }

  ngAfterViewInit() {
    if(this.hasTextAndTooltip()) {
      setTimeout(() => {
          this.descriptionWidth = 
            this.getUnwrappedTextWidthInPixels(
              this.tooltip, 
              this.getComputedProperty(this.descriptionElement, 'font')
            ) * 2 / 3;
        }
      );
    }
  }

  hasTextAndTooltip(): boolean {
    return !(isNullOrUndefined(this.text) || isNullOrUndefined(this.tooltip));
  }

  getComputedProperty(element: ElementRef, property: string) {
    return window.getComputedStyle(element.nativeElement).getPropertyValue(property);
  }
  getUnwrappedTextWidthInPixels(text: string, font: string): number {
    if(isNullOrUndefined(this.canvas)){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    this.ctx.font = font;
    return this.ctx.measureText(text).width;
  }

}
