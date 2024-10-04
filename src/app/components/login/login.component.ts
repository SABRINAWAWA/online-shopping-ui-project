import { ChangeDetectorRef, Component } from '@angular/core';
import { UserRequest } from '../../models/user-request';
import { AuthService } from '../../services/auth.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userRequest: UserRequest;
  logInMessage!: string;

  constructor(
    private routerService: RouterService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.userRequest = new UserRequest();
  }

  goToSignUpPage() {
    this.routerService.goToSignUpPage();
  }

  goToLogInPage() {
    this.routerService.goToLoginPage();
  }

  goToHomePage() {
    this.routerService.goToHomePage();
  }

  async onLogin() : Promise<void>{
    this.logInMessage = '';
    try {
      const result = await this.authService.logIn(this.userRequest);
      if (this.authService.isAuthenticated()) {
        console.log("Token added to the local storage.");
        this.changeDetector.detectChanges();
        this.goToHomePage();
      } else {
        if (result.success === false) {
          this.logInMessage = result.message;
        }
      }
    } catch (error) {
      this.logInMessage = 'Unexpected error occurred during login';
      console.error('Login failed:', error);
    }
  }
}
