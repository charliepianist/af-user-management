import { Entitlement } from "./entitlement";



export class Customer {

  id: number;
  name: string;
  userId: string;
  password: string;
  clientType: string;
  priority: number;
  entitlements: Entitlement[];
  disabled: boolean;
  static readonly clientTypes = {
    'c': 'Client',
    'r': 'Reporter',
    'a': 'Administrator'
  }

  constructor(id: number = null, name: string = null, 
    userId: string = null, password: string = null, 
    clientType: string = null, priority: number = null,
    entitlements: Entitlement[] = null, disabled: boolean = false) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.password = password;
    this.clientType = clientType;
    this.priority = priority;
    this.entitlements = entitlements;
    this.disabled = disabled;
  }
  
  static copy(customer: Customer, {
      id = customer.getId(),
      name = customer.getName(),
      userId = customer.getUserId(),
      password = customer.getPassword(),
      clientType = customer.getClientType(),
      priority = customer.getPriority(),
      entitlements = customer.getEntitlements(),
      disabled = customer.isDisabled()
    }: {
      id?: number,
      name?: string,
      userId?: string,
      password?: string,
      clientType?: string,
      priority?: number,
      entitlements?: Entitlement[],
      disabled?: boolean
    } = {}): Customer {
      return new Customer(id, name, userId, password, 
        clientType, priority, entitlements, disabled);
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
  getClientType(): string {
    return this.clientType;
  }
  clientTypeString(): string {
    return Customer.clientTypes[this.clientType];
  }
  getPriority(): number { 
    return this.priority;
  }
  getEntitlements(): Entitlement[] {
    return this.entitlements;
  }
  setEntitlements(entitlements: Entitlement[]) {
    this.entitlements = entitlements;
  }
  isDisabled(): boolean {
    return this.disabled;
  }

  equals(other: Customer): boolean {
    return this.getId() === other.getId() &&
    this.getName() === other.getName() &&
    this.getUserId() === other.getUserId() &&
    this.getPassword() === other.getPassword() &&
    this.getClientType() === other.getClientType() &&
    this.getPriority() === other.getPriority();
  }
}
