import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addresses: Address[] = [];
  private addressUrl: string = "/address";
  private baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  fetchAddresses(): Observable<Address[]> {
    const url=`${this.baseUrl}${this.addressUrl}`;
    return this.http
      .get<any>(url)
      .pipe(
        // check the response data using tap
        tap((response: any) => console.log('Fetched response:', response)),
        // transform the response data using map as needed
        map((response: any) => {
          const success = response.success;
          const addressesInfo = response.data;
          if (success && Array.isArray(addressesInfo)) {
            this.addresses = addressesInfo.map(address => ({
              addressId: address.addressId || 0,  // Default value if not present
              street: address.street || '',
              city: address.city || '',
              state: address.state || '',
              country: address.country || '',
              zipCode: address.zipCode || ''
            }));
          } else {
            console.error('Response failed with error or Expected an array inside "data", got:', addressesInfo);
            this.addresses = [];
          }
          // Return the updated addresses array
          return this.addresses;
        })
      );
  }

  /*
  async fetchAddresses(): Promise<void> {
    const url = `${this.baseUrl}${this.addressUrl}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      this.addresses = data.data;
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  }*/

  addAddress(address: Address){
    const url=`${this.baseUrl}${this.addressUrl}`;
    return this.http.post<any>(url, address).pipe(
      tap((response) => {
        console.log('Address created successfully:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to create address:', error);
        return throwError(() => new Error('Failed to create address'));
      })
    );
  }
  /*
  async addAddress(address: Address): Promise<any> {
    const url = `${this.baseUrl}${this.addressUrl}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(address)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to Create address:', error);
    }
  }
  */
}
