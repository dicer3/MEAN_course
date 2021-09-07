import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticate = false;
  private authListernerSubs: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticate = this.authService.getIsAuth();
    this.authListernerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticate = isAuthenticated
      })
  }

  ngOnDestroy() {
    this.authListernerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout()
  }
}
