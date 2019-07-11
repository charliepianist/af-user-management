export class Location {
    id: number;
    code: string;
    name: string;

    constructor(id: number = null, code: string = null, name: string = null) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    getId(): number {
        return this.id;
    }
    getCode(): string {
        return this.code;
    }
    getName(): string {
        return this.name;
    }

    equals(other: Location): boolean {
        return this.getCode() === other.getCode() &&
        this.getName() === other.getName();
    }
}