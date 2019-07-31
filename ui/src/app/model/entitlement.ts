import { Product } from "./product";
import { Location } from "./location";
import { Customer } from "./customer";
import { isNullOrUndefined } from "util";

export class Entitlement {
    id: number;
    product: Product;
    location: Location;
    client: Customer;
    expirationDate: Date;
    numLogins: number

    static readonly DEFAULT_NUM_LOGINS = 2;

    constructor(id: number = null, product: Product = null,
        location: Location = null, client: Customer = null,
        expirationDate: Date = null, numLogins: number = Entitlement.DEFAULT_NUM_LOGINS) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = expirationDate;
        this.numLogins = numLogins;
    }

    static copy(entitlement: Entitlement, {
        id = entitlement ? entitlement.getId() : null,
        product = entitlement ? entitlement.getProduct() : null,
        location = entitlement ? entitlement.getLocation() : null,
        client = entitlement ? entitlement.getClient() : null,
        expirationDate = entitlement ? entitlement.getExpirationDate() : null,
        numLogins = entitlement ? entitlement.getNumLogins() : null
    }: {id?: number, product?: Product, location?: Location,
    client?: Customer, expirationDate?: Date, numLogins?: number} = {}) {
        if(isNullOrUndefined(entitlement)) return null;
        return new Entitlement(
            id,
            product,
            location,
            client,
            expirationDate,
            numLogins
        )
    }

    getId(): number {
        return this.id;
    }
    getProduct(): Product {
        return this.product;
    }
    getProductName(): string {
        return this.getProduct().getName();
    }
    getLocation(): Location {
        return this.location;
    }
    getLocationCode(): string {
        return this.getLocation().getCode();
    }
    getClient(): Customer {
        return this.client;
    }
    getExpirationDate(): Date {
        return this.expirationDate;
    }
    getNumLogins(): number {
        return this.numLogins;
    }
    setNumLogins(numLogins: number) {
        this.numLogins = numLogins;
    }
    validateNumLogins() {
        if(!this.numLogins) this.numLogins = Entitlement.DEFAULT_NUM_LOGINS;
        if(this.numLogins < 1) this.numLogins = Entitlement.DEFAULT_NUM_LOGINS;
        if(this.numLogins % 1 !== 0) this.numLogins = Entitlement.DEFAULT_NUM_LOGINS;
    }

    equals(other: Entitlement, {
        strictClientEquals = false
    }: {
        strictClientEquals?: boolean
    } = {}): boolean {
        let nullProducts = false;
        let nullLocations = false;
        let nullClient = false;
        let nullDates = false;
        if(isNullOrUndefined(other)) {
            return false;
        }
        if(isNullOrUndefined(this.getProduct()) || isNullOrUndefined(other.getProduct())) {
            if(isNullOrUndefined(this.getProduct() && isNullOrUndefined(other.getProduct()))) {
                nullProducts = true;
            }else return false;
        }
        if(isNullOrUndefined(this.getLocation()) || isNullOrUndefined(other.getLocation())) {
            if(isNullOrUndefined(this.getLocation() && isNullOrUndefined(other.getLocation()))) {
                nullLocations = true;
            }else return false;
        }
        if(isNullOrUndefined(this.getClient()) || isNullOrUndefined(other.getClient())) {
            if(strictClientEquals) {
                if(isNullOrUndefined(this.getClient()) && isNullOrUndefined(other.getClient())) {
                    nullClient = true;
                }else return false;
            }else nullClient = true;
        }
        if(isNullOrUndefined(this.getExpirationDate()) || isNullOrUndefined(other.getExpirationDate())) {
            if(isNullOrUndefined(this.getExpirationDate()) && isNullOrUndefined(other.getExpirationDate())) {
                nullDates = true;
            }else return false;
        }
        return (nullProducts || this.getProduct().equals(other.getProduct())) && 
        (nullLocations || this.getLocation().equals(other.getLocation())) &&
        (nullClient || this.getClient().equals(other.getClient())) &&
        (nullDates || this.getExpirationDate().getTime() === other.getExpirationDate().getTime())
        && this.getNumLogins() == other.getNumLogins();
    }

    static areEqual(e1: Entitlement, e2: Entitlement): boolean {
        if(isNullOrUndefined(e1)) return isNullOrUndefined(e2);
        return e1.equals(e2);
    }
}