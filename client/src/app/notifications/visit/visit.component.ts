import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";
import * as $ from "jquery";

import {
  AlertService,
  UserService,
  AuthenticationService,
  sharedDataService,
} from "@/_services";
import { DateAdapter } from "@angular/material/core";

@Component({
  templateUrl: "visit.component.html",
  styleUrls: ["./visit.component.scss"],
})
export class visitComponent implements OnInit {
  registrationForm: FormGroup;
  registrationFormApp: FormGroup;
  loading = false;
  submitted = false;
  notification: any = [];
  readAllDAta: any = [];
  tomorrow = new Date();
  minDate = new Date("01/01/1970");
  registrationForminvalid: boolean = false;
  notificationId: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private shareData: sharedDataService,
    private dateAdapter: DateAdapter<Date>,
    private route: ActivatedRoute
  ) {
    this.dateAdapter.setLocale("en-GB"); //dd/MM/yy
    this.tomorrow.setDate(this.tomorrow.getDate());
  }

  ngOnInit() {
    this.notificationId = "";
    this.notificationId = this.route.snapshot.queryParamMap.get("Nid");

    this.alertService.clear();
    this.registrationForm = this.formBuilder.group({
      name: ["", [Validators.required]],
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
      DOB: ["", [Validators.required]],
      hospital_id: ["", [Validators.required]],
      notification: ["", [Validators.required]],
      notificationId: ["", [Validators.required]],
    });
    this.getNotifications();
  }
  // calAge(e) {
  //   let date = e.target.value;
  //   var timeDiff = Math.abs(Date.now() - new Date(date).getTime());
  //   this.cage = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) + " - Years";
  //   this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  // }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  getNotifications() {
    this.userService
      .getNotificationById(this.notificationId)
      .pipe(first())
      .subscribe(
        (data) => {
          this.notification = data;

          this.f.notification.setValue(this.notification.templatename);
          this.f.notificationId.setValue(this.notification._id);
          this.f.hospital_id.setValue(this.notification.hospital_id);
          this.loadAllNotifications(this.f.hospital_id.value);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }
  loadAllNotifications(id: string) {
    this.userService
      .getAllNotificationsByIdNoJwt(id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.readAllDAta = null;
          this.readAllDAta = data;
          //console.log(this.users);
          //this.users = this.users.filter(arr => arr.hospital_id == this.currentUser._id);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }
  readOtherNotes(id: string) {
    this.notification = 0;
    let noteDAta = this.readAllDAta.filter((arr) => arr._id == id);
    this.notification = noteDAta[0];
  }
  onSubmit() {
    this.submitted = true;
    //console.log(this.registrationForm.value);
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }
    this.loading = true;

    this.userService
      .createRegNotifications(this.registrationForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success(
            "Registered successfully. Thank you for Your time & interest. We will get back soon...",
            true
          );
          this.loading = true;
          this.submitted = false;
          this.registrationForm.reset();
          $("#aclose").click();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
          this.registrationForm.reset();
          $("#aclose").click();
        }
      );
  }
}
