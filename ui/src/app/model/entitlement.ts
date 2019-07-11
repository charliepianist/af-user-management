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

    constructor(id: number = null, product: Product = null,
        location: Location = null, client: Customer = null,
        expirationDate: Date = null) {
        this.id = id;
        this.product = product;
        this.location = location;
        this.client = client;
        this.expirationDate = expirationDate;
    }

    static copy(entitlement: Entitlement, {
        id = entitlement.getId(),
        product = entitlement.getProduct(),
        location = entitlement.getLocation(),
        client = entitlement.getClient(),
        expirationDate = entitlement.getExpirationDate()
    }: {id?: number, product?: Product, location?: Location,
    client?: Customer, expirationDate?: Date} = {}) {
        return new Entitlement(
            id,
            product,
            location,
            client,
            expirationDate
        )
    }

    getId(): number {
        return this.id;
    }
    getProduct(): Product {
        return this.product;
    }
    getLocation(): Location {
        return this.location;
    }
    getClient(): Customer {
        return this.client;
    }
    getExpirationDate(): Date {
        return this.expirationDate;
    }

    equals(other: Entitlement): boolean {
        let nullProducts = false;
        let nullLocations = false;
        let nullClients = false;
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
            if(isNullOrUndefined(this.getClient() && isNullOrUndefined(other.getClient()))) {
                nullClients = true;
            }else return false;
        }
        if(isNullOrUndefined(this.getExpirationDate()) || isNullOrUndefined(other.getExpirationDate())) {
            if(isNullOrUndefined(this.getExpirationDate()) && isNullOrUndefined(other.getExpirationDate())) {
                nullDates = true;
            }else return false;
        }
        return (nullProducts || this.getProduct().equals(other.getProduct())) && 
        (nullLocations || this.getLocation().equals(other.getLocation())) &&
        (nullClients || this.getClient().equals(other.getClient())) &&
        (nullDates || this.getExpirationDate().getTime() === other.getExpirationDate().getTime());
    }

    static areEqual(e1: Entitlement, e2: Entitlement): boolean {
        if(isNullOrUndefined(e1)) return isNullOrUndefined(e2);
        return e1.equals(e2);
    }
}