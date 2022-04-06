import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";

import {
  AlertService,
  UserService,
  AuthenticationService,
  sharedDataService,
} from "@/_services";

@Component({ templateUrl: "edit.component.html" })
export class editUserComponent implements OnInit, OnDestroy {
  editregisterForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private shareData: sharedDataService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.editregisterForm = this.formBuilder.group({
      firstName: [
        this.authenticationService.currentUserValue.firstName,
        Validators.required,
      ],
      email: [
        this.authenticationService.currentUserValue.email,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ],
      ],
      mobile: [
        this.authenticationService.currentUserValue.mobile,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmpassword: ["", [Validators.required]],
      address: [this.authenticationService.currentUserValue.address, []],
      Pincode: [this.authenticationService.currentUserValue.Pincode, []],
    });

    this.shareData.setData("profile", true);
    this.shareData.setData("pp", false);
    this.shareData.setData("support", false);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editregisterForm.controls;
  }

  mainpageafooter(p1: boolean, p2: boolean, p3: boolean) {
    this.shareData.setData("profile", p1);
    this.shareData.setData("pp", p2);
    this.shareData.setData("support", p3);
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
    return this.editregisterForm.controls["password"];
  }

  get confirmpassword(): AbstractControl {
    return this.editregisterForm.controls["confirmpassword"];
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.editregisterForm.invalid) {
      return;
    }
    let obj = {};
    obj = {
      password: this.editregisterForm.value.password,
      mobile: this.editregisterForm.value.mobile,
      id: this.authenticationService.currentUserValue._id,
      address: this.editregisterForm.value.address,
      Pincode: this.editregisterForm.value.Pincode,
    };
    this.loading = true;
    this.userService
      .update(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success(
            "Updated successfully - Please login again",
            true
          );
          this.loading = false;
          this.authenticationService.logout();
          this.router.navigate(["/login"]);
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
    //this.editregisterForm.reset();
  }
  ngOnDestroy() {
    this.shareData.deleteData("profile");
    this.shareData.deleteData("pp");
    this.shareData.deleteData("support");
  }
}
