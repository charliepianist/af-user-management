import { Entitlement } from "../model/entitlement";
import { Location } from "../model/location";
import { Product } from "../model/product";

export class EChange {
    newEntitlement: Entitlement;
    oldEntitlement: Entitlement;
    pIndex: number;
    lIndex: number;

    constructor(newEnt: Entitlement, oldEnt: Entitlement, 
        pIndex: number, lIndex: number) {
        this.newEntitlement = newEnt;
        this.oldEntitlement = oldEnt;
        this.pIndex = pIndex;
        this.lIndex = lIndex;
    }

    static copy(eChange: EChange, {
        newEntitlement = eChange.getNewEntitlement(),
        oldEntitlement = eChange.getOldEntitlement(),
        pIndex = eChange.getProductIndex(),
        lIndex = eChange.getLocationIndex(),
    }: {newEntitlement?: Entitlement, oldEntitlement?: Entitlement, 
        pIndex?: number, lIndex?: number} = {}) {
        return new EChange(
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
    oldClasses() {
        let classes = [];
        if(this.oldEntitlement) {
            if(this.oldEntitlement.getExpirationDate()) {
                classes.push('trial-background')
            }else classes.push('sub-background')
        }else classes.push('unsub-background')
        return classes;
    }
    newClasses() {
        let classes = [];
        if(this.newEntitlement) {
            if(this.newEntitlement.getExpirationDate()) {
                classes.push('trial-background')
            }else classes.push('sub-background')
        }else classes.push('unsub-background')
        return classes;
    }
}