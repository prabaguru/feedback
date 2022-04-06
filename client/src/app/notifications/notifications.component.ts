import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";

import { User } from "@/_models";
import {
  AlertService,
  UserService,
  AuthenticationService,
  sharedDataService,
} from "@/_services";
import * as $ from "jquery";
import { GoogleChartInterface } from "ng2-google-charts";
@Component({ templateUrl: "notifications.component.html" })
export class notificationsComponent implements OnInit {
  currentUser: User;
  users = [];
  user;
  loading = false;
  userID;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private shareData: sharedDataService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.alertService.clear();
  }

  ngOnInit() {}

  // deleteUser() {
  //   this.userService
  //     .updateSingle(this.userID)
  //     .pipe(first())
  //     .subscribe(
  //       () => {
  //         this.alertService.success("Deleted successfully", true);
  //         //this.users = this.users.filter(arr => arr._id == id);
  //         this.loadAllUsers();
  //       },
  //       (error) => {
  //         this.alertService.error(error);
  //       }
  //     );
  // }

  loadAllUsers() {
    let obj = {
      id: this.currentUser._id,
    };
    this.userService
      .getAllById(obj)
      .pipe(first())
      .subscribe(
        (users) => {
          this.users = users;
          console.log(this.users);
          //this.users = this.users.filter(arr => arr.hospital_id == this.currentUser._id);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  onSubmit(editForm) {
    // reset alerts on submit
    this.alertService.clear();
    //console.log(editForm);return;

    let obj = {};
    obj = {
      regType: editForm.value.regType,
      role: editForm.value.role,
      password: editForm.value.password,
      mobile: editForm.value.mobile,
      id: this.user.id,
      status: editForm.value.status,
    };
    this.loading = true;
    this.userService
      .update(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Update successful", true);
          this.loading = false;
          //$("#exampleModalLong").modal("hide");
          //this.router.navigate(['/login']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
          //$("#exampleModalLong").modal("hide");
        }
      );
  }
}
