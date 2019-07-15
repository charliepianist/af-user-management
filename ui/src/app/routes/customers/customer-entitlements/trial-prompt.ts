import { Entitlement } from "src/app/model/entitlement";

export class TrialPrompt {
    entitlement: Entitlement;
    selected: boolean;
    prodIndex: number;
    locIndex: number;
    orderedIndex: number;

    constructor(entitlement: Entitlement,
        prodIndex: number,
        locIndex: number,
        toSetTime: boolean = true,
        orderedIndex: number = null) {
            this.entitlement = entitlement;
            this.selected = toSetTime;
            this.prodIndex = prodIndex;
            this.locIndex = locIndex;
            this.orderedIndex = orderedIndex;
        }

    getEntitlement(): Entitlement {
        return this.entitlement;
    }

    isSelected(): boolean {
        return this.selected;
    }

    setSelected(selected: boolean) {
        this.selected = selected;
    }

    toggleSelected() {
        this.selected = !this.selected;
    }

    getProductIndex(): number {
        return this.prodIndex;
    }

    getLocationIndex(): number {
        return this.locIndex;
    }

    getOrderedIndex(): number {
        return this.orderedIndex;
    }

    setOrderedIndex(orderedIndex: number) {
        this.orderedIndex = orderedIndex;
    }
}