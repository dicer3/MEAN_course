import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";

const BACKEND_URL = environment.apiUrl + "user/"

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string | null;
  isAuthenciated = false;
  tokenTimer: any
  private userId: string | null

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

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password }
    return this.http.post(BACKEND_URL + "signup", authData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        this.token = response.token
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          const now = new Date();
          this.setAuthTimer(expiresInDuration);
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.userId = response.userId;
          this.saveAuthData(this.token, expirationDate, this.userId)
          this.isAuthenciated = true;
          this.authStatusListener.next(true);
          this.router.navigate(["/"]);
        }
      }, error => {
        this.authStatusListener.next(false);
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
      this.userId = authInformation.userId;
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
    this.userId = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate)
      return;
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    }
  }
}
