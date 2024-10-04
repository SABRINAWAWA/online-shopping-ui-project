import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy{
  userRole:string|null='';
  private userRoleSubscription: Subscription = new Subscription();
  constructor(
    private router: Router, 
    private authService:AuthService,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.userRoleSubscription = this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
      console.log('User role updated in NavComponent:', this.userRole);
      this.cdr.detectChanges();
    });
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      this.userRole = storedRole;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.userRoleSubscription.unsubscribe();
  }

  public onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
