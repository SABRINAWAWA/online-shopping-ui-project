export class UserRequest {
    username: string='';
    password: string='';

    getFullRequest(): string {
        return `${this.username} ${this.password}`;
      }
}
