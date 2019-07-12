import { Entitlement } from "./entitlement";



export class Customer {

  id: number;
  name: string;
  userId: string;
  password: string;
  entitlements: Entitlement[];

  constructor(id: number = null, name: string = null, 
    userId: string = null, password: string = null,
    entitlements: Entitlement[] = null) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.password = password;
    this.entitlements = entitlements;
  }
  
  static copy(customer: Customer, {
      id = customer.getId(),
      name = customer.getName(),
      userId = customer.getUserId(),
      password = customer.getPassword(),
      entitlements = customer.getEntitlements()
    }: {
      id?: number,
      name?: string,
      userId?: string,
      password?: string,
      entitlements?: Entitlement[]
    } = {}): Customer {
      return new Customer(id, name, userId, password, entitlements);
  }

  getId(): number {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getUserId(): string {
    return this.userId;
  }
  getPassword(): string {
    return this.password;
  }
  getEntitlements(): Entitlement[] {
    return this.entitlements;
  }
  setEntitlements(entitlements: Entitlement[]) {
    this.entitlements = entitlements;
  }

  equals(other: Customer): boolean {
    return this.getId() === other.getId() &&
    this.getName() === other.getName() &&
    this.getUserId() === other.getUserId() &&
    this.getPassword() === other.getPassword();
  }
}
