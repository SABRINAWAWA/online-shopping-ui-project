import { Component } from '@angular/core';
import { User } from '../../models/user';
import { RouterService } from '../../services/router.service';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User;
  signUpMessage!: string;

  constructor(
    private routerService: RouterService, private userService: UserServiceService
  ) {
    this.user = new User();
  }

  async OnSignUp(): Promise<void> {
    this.user.role = 1;
    this.signUpMessage = '';
    try {
      const result = await this.userService.signUp(this.user);
      if (result.success === false) {
        this.signUpMessage = result.message;
      } else {
        this.signUpMessage = result.message;
        setTimeout(() => {
          console.log("Redirecting to Login Page.")
          this.routerService.goToLoginPage();
        }, 1000);
      }
    }
    catch (error) {
      this.signUpMessage = 'Unexpected error occurred during SignUp';
      console.error('SignUp failed:', error);
    }
  }


}
