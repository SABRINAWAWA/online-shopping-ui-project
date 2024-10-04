export class User {
    username: string='';
    password: string='';
    firstname: string='';
    lastname: string='';
    email: string='';
    role: number=0;

    getFullName(): string {
        return `${this.firstname} ${this.lastname}`;
      }
}
