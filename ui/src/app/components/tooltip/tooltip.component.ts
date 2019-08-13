import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DOMManip } from 'src/app/helper/dom-manip';
import { MyUtil } from 'src/app/helper/my-util';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  // max width for tooltip, before checking that no words are partially cut off
  static readonly MAX_EXPAND_WIDTH = 475;
  static readonly MAX_SINGLE_LINE_WIDTH = 225;
  static readonly PADDING = 18;
  // Ratio of first through second to last lines' ideal width to last line:
  // FIRST:LAST
  static readonly FIRST = 3;
  static readonly LAST = 2;

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
      alert('text or tooltip is null in TooltipComponent ' + this);
    }
  }

  ngAfterViewInit() {
    // Calculate tooltip width
    if(this.hasTextAndTooltip()) {
      setTimeout(() => {
          this.descriptionWidth = this.calculateTooltipWidth();
        }
      );
    }
  }

  calculateTooltipWidth(): number {
    let words = this.tooltip.match(/[^\s]+(?=\s|$)/g);
    let font = DOMManip.getComputedProperty(this.descriptionElement, 'font');
    let minWidth = 0; // To avoid cutting off parts of words
    if(words) { 
      // Get width needed for no word to be cut off
      minWidth = MyUtil.max(words.map(
        w => DOMManip.getUnwrappedTextWidthInPixels(w, font)
      ), MyUtil.NUMBER_COMPARATOR);
    }

    let totalWidth = DOMManip.getUnwrappedTextWidthInPixels(
      this.tooltip, font);
    let ideal = this.calculateIdealWidth(totalWidth);

    return Math.max(minWidth, ideal) + TooltipComponent.PADDING;
  }

  calculateIdealWidth(width: number): number {
    // width / (first * (lines - 1) + last) < max
    let first = TooltipComponent.FIRST;
    let last = TooltipComponent.LAST;
    let max = TooltipComponent.MAX_EXPAND_WIDTH;
    let lines = Math.ceil(
      (width * first / max - last) / first + 1
    )

    // Have more than one line if MIN_LINE_WIDTH permits
    if(width >= TooltipComponent.MAX_SINGLE_LINE_WIDTH) 
      lines = Math.max(2, lines);
    if(lines <= 1) return width;
    return (width * first / (first * (lines - 1) + last));
  }

  hasTextAndTooltip(): boolean {
    return !(isNullOrUndefined(this.text) || isNullOrUndefined(this.tooltip));
  }
}
