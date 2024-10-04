import { Component } from '@angular/core';
import { Address } from '../../../models/address';
import { AddressService } from '../../../services/address.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {
  addresses: Address[] = [];

  constructor(private addressService:AddressService, private routerService:RouterService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchAddresses();
  }

  async fetchAddresses(): Promise<void> {
    this.addressService.fetchAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses; // Assign the fetched addresses to the component's addresses array
        console.log('Addresses in component:', this.addresses); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching addresses:', err); // Handle errors here
      }
    });
  }

  goToAddAddressPage(): void{
    this.routerService.goToAddAddressPage();
  }
}
