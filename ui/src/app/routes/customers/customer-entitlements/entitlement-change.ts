import { Entitlement } from "../../../model/entitlement";
import { Location } from "../../../model/location";
import { Product } from "../../../model/product";
import { isNullOrUndefined } from "util";

export class EntitlementChange {
    newEntitlement: Entitlement;
    oldEntitlement: Entitlement;
    pIndex: number;
    lIndex: number;
    uniqueId: number;
    static NEXT_ID = 1;

    constructor(newEnt: Entitlement, oldEnt: Entitlement, 
        pIndex: number, lIndex: number) {
        this.newEntitlement = newEnt;
        this.oldEntitlement = oldEnt;
        this.pIndex = pIndex;
        this.lIndex = lIndex;
        this.updateId();
    }

    static copy(eChange: EntitlementChange, {
        newEntitlement = eChange.getNewEntitlement(),
        oldEntitlement = eChange.getOldEntitlement(),
        pIndex = eChange.getProductIndex(),
        lIndex = eChange.getLocationIndex(),
    }: {newEntitlement?: Entitlement, oldEntitlement?: Entitlement, 
        pIndex?: number, lIndex?: number} = {}) {
        return new EntitlementChange(
            newEntitlement, oldEntitlement, pIndex, lIndex
        )
    }
    
    getNewEntitlement(): Entitlement {
        return this.newEntitlement;
    }
    getOldEntitlement(): Entitlement {
        return this.oldEntitlement;
    }
    getProductIndex(): number {
        return this.pIndex;
    }
    getLocationIndex(): number {
        return this.lIndex;
    }
    getProduct(): Product {
        let nonNull = this.newEntitlement ? this.newEntitlement : this.oldEntitlement;
        return nonNull.getProduct();
    }
    getLocation(): Location {
        let nonNull = this.newEntitlement ? this.newEntitlement : this.oldEntitlement;
        return nonNull.getLocation();
    }
    getProductName(): string {
        return this.getProduct().getName();
    }
    getLocationCode(): string {
        return this.getLocation().getCode();
    }
    
    oldNumLogins(): number {
        if(this.getOldEntitlement())
            return this.getOldEntitlement().getNumLogins();
        return 0;
    }
    newNumLogins(): number {
        if(this.getNewEntitlement())
            return this.getNewEntitlement().getNumLogins();
        return 0;
    }

    oldString(): string {
        if(this.oldEntitlement) {
            if(this.oldEntitlement.getExpirationDate()) {
                return "Trial " + this.oldEntitlement.getExpirationDate().toLocaleDateString();
            }else return "Subscribed"
        }else return "Unsubscribed"
    }
    newString(): string {
        if(this.newEntitlement) {
            if(this.newEntitlement.getExpirationDate()) {
                return "Trial " + this.newEntitlement.getExpirationDate().toLocaleDateString();
            }else return "Subscribed"
        }else return "Unsubscribed"
    }
    
    oldTrial(): boolean {
        return this.oldEntitlement && !isNullOrUndefined(this.oldEntitlement.getExpirationDate());
    }
    oldSub(): boolean {
        return this.oldEntitlement && isNullOrUndefined(this.oldEntitlement.getExpirationDate());
    }
    oldUnsub(): boolean {
        return !this.oldEntitlement;
    }
    newTrial(): boolean {
        return this.newEntitlement && !isNullOrUndefined(this.newEntitlement.getExpirationDate());
    }
    newSub(): boolean {
        return this.newEntitlement && isNullOrUndefined(this.newEntitlement.getExpirationDate());
    }
    newUnsub(): boolean {
        return !this.newEntitlement;
    }

    getId(): number {
        return this.uniqueId;
    }
    updateId() {
        this.uniqueId = EntitlementChange.NEXT_ID;
        EntitlementChange.NEXT_ID++;
    }
}