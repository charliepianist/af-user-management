import { Product } from "./product";

export class MulticastGroup {
    id: number;
    name: string;
    code: string;
    autoAssign: boolean;
    ip: string;
    port: number;
    products: Product[];

    static readonly DEFAULT_SORT = (a: MulticastGroup, b: MulticastGroup) => {
        if(!a.isAutoAssign() && b.isAutoAssign()) return 1;
        if(a.isAutoAssign() && !b.isAutoAssign()) return -1;
        if(a.getName() > b.getName()) return 1;
        if(a.getName() < b.getName()) return -1;
        return 0;
    }

    constructor(id: number = null,
        name: string = null,
        code: string = null,
        ip: string = null,
        port: number = null,
        autoAssign: boolean = false,
        products: Product[] = []) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.autoAssign = autoAssign;
            this.ip = ip;
            this.port = port;
        }

    getId(): number {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getCode(): string {
        return this.code;
    }
    getProducts(): Product[] {
        return this.products;
    }
    setProducts(products: Product[]) {
        this.products = products;
    }
    isAutoAssign(): boolean {
        return this.autoAssign;
    }
    getIp(): string {
        return this.ip;
    }
    getPort(): number {
        return this.port;
    }
    getAddress(): string {
        return this.ip + ':' + this.port;
    }
    toString(): string {
        return this.name + " (" + this.getAddress() + ")"
    }
}