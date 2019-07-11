


export class Product{

    id: number;
    name: string;
    multicastGroups: any[];
  
    constructor(id: number = null, name: string = null) {
      this.id = id;
      this.name = name;
    }
    
    getId(): number {
      return this.id;
    }
    getName(): string {
      return this.name;
    }

    equals(other: Product): boolean {
      return this.getName() === other.getName();
    }
  }
  