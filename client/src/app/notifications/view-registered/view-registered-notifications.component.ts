import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
@Component({
  templateUrl: "view-registered-notifications.component.html",
  styleUrls: ["./view-registered-notifications.component.scss"],
})
export class viewRegisteredNotificationComponent implements OnInit {
  currentUser: User;
  notifications: any = [];
  loading = false;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private shareData: sharedDataService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    //this.alertService.clear();
  }

  ngOnInit() {
    this.notifications.length = 0;
    this.loadAllNotifications();
  }

  loadAllNotifications() {
    let obj = {
      id: this.currentUser._id,
    };
    this.userService
      .getAllNotificationsById(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          this.notifications = data;
          //console.log(this.users);
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
      id: this.notifications,
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
}
