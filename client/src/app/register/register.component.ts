import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, UserService, AuthenticationService } from "@/_services";

@Component({ templateUrl: "register.component.html" })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.alertService.clear();
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9_.+-]+@[a-z0-9-]+.[a-z0-9-.]+$"),
        ],
      ],
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmpassword: ["", [Validators.required]],
      role: ["SUPER-ADMIN", []],
      address: ["", []],
      Pincode: ["", []],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onPasswordChange() {
    if (this.confirmpassword.value == this.password.value) {
      this.confirmpassword.setErrors(null);
    } else {
      this.confirmpassword.setErrors({ mismatch: true });
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.registerForm.controls["password"];
  }

  get confirmpassword(): AbstractControl {
    return this.registerForm.controls["confirmpassword"];
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.registerForm.value.hospital_id = null;
    this.loading = true;
    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
