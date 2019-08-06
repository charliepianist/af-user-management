export class User {
    roles: string[]
    
    constructor(roles?: string[]) {
        this.roles = roles;
    }
    
    getRoles(): string[] {
        return this.roles;
    }
}