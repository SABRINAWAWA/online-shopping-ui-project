import { Component } from '@angular/core';
import { Address } from '../../../models/address';
import { AddressService } from '../../../services/address.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent {
  address: Address = new Address();
  addAddressMessage: string = '';

  constructor(private addressService: AddressService, private routerService: RouterService) { }

  async addAddress(): Promise<void> {
    this.addressService.addAddress(this.address).subscribe({
      next: (response) => {
        if (response.success === false) {
          this.addAddressMessage = response.message;
        } else {
          this.addAddressMessage = "Address Successfully Added. Redirecting to Address page!";
          setTimeout(() => {
            console.log("Redirecting to Address Page.");
            this.goToAddressPage();
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Failed to Create address:', error);
        this.addAddressMessage = 'Failed to create address. Please try again later.';
      }
    });
  }

  goToAddressPage(): void {
    this.routerService.goToAddressPage();
  }
}
