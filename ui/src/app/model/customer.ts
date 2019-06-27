


export class Customer {

  id:number;
  name:string;
  userId:string;
  password:string;

  constructor(id: number = null, name: string = null, userId: string = null, password: string = null) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.password = password;
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
}
