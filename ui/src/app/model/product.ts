import { MulticastGroup } from "./multicast-group";



export class Product{

    id: number;
    name: string;
    multicastGroups: MulticastGroup[]
  
    constructor(id: number = null, name: string = null,
      multicastGroups: MulticastGroup[] = []) {
      this.id = id;
      this.name = name;
      this.multicastGroups = multicastGroups;
      
    }
    
    getId(): number {
      return this.id;
    }
    getName(): string {
      return this.name;
    }
    getMulticastGroups(): MulticastGroup[] {
      return this.multicastGroups;
    }
    setMulticastGroups(multicastGroups: MulticastGroup[],
      sort: (a: MulticastGroup, b: MulticastGroup) => number = 
      (a: MulticastGroup, b: MulticastGroup) => {
        if(a.getName() > b.getName()) return 1;
        if(a.getName() == b.getName()) return 0;
        return -1;
      }) {
      this.multicastGroups = multicastGroups.sort(sort);
    }

    equals(other: Product): boolean {
      return this.getName() === other.getName();
    }
  }
  