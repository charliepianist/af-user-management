import { isNullOrUndefined } from "util";
import { ElementRef } from "@angular/core";

export class DOMManip {
    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;

    static getComputedProperty(element: ElementRef, property: string) {
        return window.getComputedStyle(element.nativeElement).getPropertyValue(property);
    }
    static getUnwrappedTextWidthInPixels(text: string, font: string): number {
        if(isNullOrUndefined(this.canvas)){
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
        this.ctx.font = font;
        return this.ctx.measureText(text).width;
    }
}