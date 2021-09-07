import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string | null;
  isAuthenciated = false;
  tokenTimer: any
  constructor(private http: HttpClient, private router: Router) { }

  private authStatusListener = new Subject<boolean>();
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenciated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        this.token = response.token
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          const now = new Date();
          this.setAuthTimer(expiresInDuration);
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log("expira..", expirationDate)
          this.saveAuthData(this.token, expirationDate)
          this.isAuthenciated = true;
          this.authStatusListener.next(true);
          this.router.navigate(["/"]);
        }
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation)
      return;
    const now = new Date();
    const expiresIn = authInformation?.expirationDate.getTime() - now.getTime();
    console.log("returned...", authInformation, "...", expiresIn)
    if (expiresIn) {
      this.token = authInformation.token;
      this.isAuthenciated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }

  }

  private setAuthTimer(duration: number) {
    console.log("setting timer ..", duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenciated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    this.clearAuthData();
    clearTimeout(this.tokenTimer)
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration")
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate)
      return;
    return {
      token,
      expirationDate: new Date(expirationDate)
    }
  }
}
