export class MulticastGroup {
    id: number;
    name: string;
    ip: string;
    port: number;

    constructor(id: number = null,
        name: string = null,
        ip: string = null,
        port: number = null) {
            this.id = id;
            this.name = name;
            this.ip = ip;
            this.port = port;
        }

    getId(): number {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getIp(): string {
        return this.ip;
    }
    getPort(): number {
        return this.port;
    }
    toString(): string {
        return this.name + " (" + this.ip + ":" + this.port + ")"
    }
}