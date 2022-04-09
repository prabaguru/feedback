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
import * as XLSX from "xlsx";
import * as $ from "jquery";
@Component({
  templateUrl: "view-registered-notifications.component.html",
  styleUrls: ["./view-registered-notifications.component.scss"],
})
export class viewRegisteredNotificationComponent implements OnInit {
  currentUser: User;
  notifications: any = [];
  loading = false;
  fileName = "newnote-members.xlsx";
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
    let obj: any = {
      id: this.currentUser._id,
    };
    this.userService
      .getRegNotificationById(obj)
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

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
