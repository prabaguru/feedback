import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, UserService, AuthenticationService } from "@/_services";

@Component({ templateUrl: "userregister.component.html" })
export class UserRegisterComponent implements OnInit {
  @ViewChild(FormGroupDirective, { static: false })
  formGroupDirective: FormGroupDirective;
  userregisterForm: FormGroup;
  loading = false;
  submitted = false;
  RegType: any = ["OPD", "IPD"];
  UserRole: any = ["Admin", "Reception"];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.alertService.clear();
    this.userregisterForm = this.formBuilder.group({
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
      regType: ["", Validators.required],
      role: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmpassword: ["", [Validators.required]],
      hospital_id: [this.authenticationService.currentUserValue._id, []],
      Hname: [this.authenticationService.currentUserValue.firstName, []],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userregisterForm.controls;
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
    return this.userregisterForm.controls["password"];
  }

  get confirmpassword(): AbstractControl {
    return this.userregisterForm.controls["confirmpassword"];
  }

  onSubmit(event): void {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.userregisterForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .register(this.userregisterForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Registration successful", true);
          //this.router.navigate(['/login']);
          this.loading = false;
          this.resetForm();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  resetForm() {
    this.submitted = false;
    this.userregisterForm.reset();
  }
}
