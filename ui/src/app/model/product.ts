


export class Product{

    id:number;
    name:string;
  
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
  }
  