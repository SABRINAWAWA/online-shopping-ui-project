import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserRequest } from '../models/user-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logInUrl: string = '/auth/login';
  private userUrl: string = '/user';
  private baseUrl: string = "http://localhost:8080";
  private userRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userRole$ = this.userRoleSubject.asObservable();

  constructor() {
    if (this.isBrowser()) {
      const storedUserRole = localStorage.getItem('role');
      //console.log(storedUserRole);
      this.userRoleSubject.next(storedUserRole);
    } else {
      console.log("wait");
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public getUserRoleObservable() {
    return this.userRoleSubject.asObservable();
  }

  public getCurrentUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  public async logIn(userRequest: UserRequest): Promise<any> {
    const url = `${this.baseUrl}${this.logInUrl}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userRequest)
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message };
      }
      const success = data.success;
      const message = data.message;
      if (success) {
        const token = data.token;
        const successfulMessage = 'Login Successful';
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token stored:', token);
          await this.storeUserInfo();
          return { success: true, message: successfulMessage };
        } else {
          return { success: false, message: "Token is not generated." };
        }
      } else {
        return { success: false, message: message };
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

  // Logout and clear the JWT, role and user name
  public logout(): void {
    this.userRoleSubject.next(null);
    localStorage.removeItem('token');// Clear JWT on logout
    localStorage.removeItem('role'); // Clear Role on logout
    localStorage.removeItem('username'); // Clear Role on logout
    console.log('Logged out.');
  }

  // Store user info (username and user role) to local storage
  public async storeUserInfo(): Promise<void> {
    // Retrieve user role and username and store at localstorage
    const getUserUrl = `${this.baseUrl}${this.userUrl}`;
    const userResponse = await fetch(getUserUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const userData = await userResponse.json();
    if (!userResponse.ok) {
      throw new Error('Error in retrieving user info');
    }
    const role = userData.data.role;
    const username = userData.data.username;
    if (username) {
      localStorage.setItem('username', username);
    } else {
      throw new Error('Error in retrieving username, the username is null.');
    }
    if (role) {
      let roleType = role === 1 ? 'USER' : 'ADMIN';
      localStorage.setItem('role', roleType);
      this.userRoleSubject.next(roleType);
      console.log(this.userRoleSubject.getValue());
      return Promise.resolve();
    } else {
      throw new Error('Error in retrieving user role, the user role is null.');
    }
    //console.log(localStorage.getItem('role'), localStorage.getItem('username'));
  }

  // Check if the user is authenticated
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get user role from local storage
  public getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // Get username from local storage
  public getUsername(): string | null {
    return localStorage.getItem('username');
  }

  public loadUserRoleFromStorage(): void {
    const role = localStorage.getItem('role');
    if (role) {
      this.userRoleSubject.next(role); // If a role is found in storage, broadcast it
    }
  }
}