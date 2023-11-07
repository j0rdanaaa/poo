export class User {
    constructor(
      private id: string,
      private name: string,
      private createdAt: string
    ) {}
  
    public getId(): string {
      return this.id;
    }
  
    public setId(value: string): void {
      this.id = value;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public setName(value: string): void {
      this.name = value;
    }
  
    public getCreatedAt(): string {
      return this.createdAt;
    }
  
    public setCreatedAt(value: string): void {
      this.createdAt = value;
    }
  }