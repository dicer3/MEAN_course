import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignUpComponent {
  isLoading = false;

  constructor(private authservice: AuthService) { }
  onSignup(form: NgForm) {
    console.log("form..", form.value)
    if (form.invalid)
      return;
    this.isLoading = true;
    this.authservice.createUser(form.value.email, form.value.password);
  }
}
