import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private signUpUrl: string = "/signup";
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  public async signUp(user: User): Promise<any> {
    const url = `${this.baseUrl}${this.signUpUrl}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message };
      }
      console.log(data);
      const success = data.success;
      if (success) {
        const message = 'Sign Up Successful. Redirected to Login Page';
        return { success: true, message: message };
      } else {
        const message = data.message;
        return { success: false, message: message };
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }
}
