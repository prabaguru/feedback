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
@Component({ templateUrl: "home.component.html" })
export class HomeComponent implements OnInit {
  currentUser: User;
  users = [];
  user;
  RegType: any = ["OPD", "IPD"];
  UserRole: any = ["Admin", "Reception"];
  loading = false;
  userID;
  hospitalUsers: any = [];
  hospitalDetails = [];
  ipdfeedbackdata: any;
  opdfeedbackdata: any;
  accordFlag: boolean = false;
  ipdChartFlag: boolean = false;
  opdChartFlag: boolean = false;
  chartRowCount;
  public pieChart: GoogleChartInterface;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private shareData: sharedDataService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.alertService.clear();
  }

  ngOnInit() {
    if (this.currentUser.role === "SUPER-ADMIN") {
      this.loadAllUsers();
    }

    if (this.shareData.getData("smsFlag")) {
      this.loading = false;
      this.alertService.success(
        "SMS sent successfully - Reload the page if there is a problem",
        true
      );
    }

    if (this.currentUser.role === "Weisermanner") {
      this.loadAllUsersforAdmin();
    }

    this.user = {
      firstName: "",
      mobile: "",
      email: "",
      regType: "",
      role: "",
      password: "",
      cpassword: "",
      status: "",
    };
  }

  // deleteUser(id: number) {
  //     this.userService.delete(id)
  //         .pipe(first())
  //         .subscribe(() => this.loadAllUsers());
  // }

  getUserID(id: number) {
    this.userID = null;
    this.userID = id;
  }

  getChart() {
    this.chartRowCount =
      this.opdfeedbackdata.length + this.ipdfeedbackdata.length;
    if (this.chartRowCount > 0) {
      this.ipdChartFlag = true;
      this.pieChart = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["OPD", this.opdfeedbackdata.length],
          ["IPD", this.ipdfeedbackdata.length],
        ],
        options: {
          width: 500,
          height: 500,
          pieHole: 0.4,
          title: "Feedback Info",
          pieSliceText: "value",
        },
      };
    }
  }

  getFeedbackIPD(id) {
    this.alertService.clear();
    this.userService
      .getAllByIpdFbk(id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.ipdfeedbackdata = data;
          this.getFeedbackOPD(id);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  getFeedbackOPD(id) {
    this.alertService.clear();
    this.userService
      .getAllByOpdFbk(id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.opdfeedbackdata = data;
          this.getChart();
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  deleteUser() {
    this.userService
      .updateSingle(this.userID)
      .pipe(first())
      .subscribe(
        () => {
          this.alertService.success("Deleted successfully", true);
          //this.users = this.users.filter(arr => arr._id == id);
          this.loadAllUsers();
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  loadAllUsersforAdmin() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(
        (users) => {
          this.users = users;
          console.log(this.users);
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  gethospitaldetails(id) {
    this.ipdChartFlag = false;
    this.ipdfeedbackdata = null;
    this.opdfeedbackdata = null;
    this.chartRowCount = null;
    this.alertService.clear();
    if (id == "Select Hospital" || id == "Select Hospital") {
      this.accordFlag = false;
      return;
    }
    this.accordFlag = false;
    this.hospitalDetails = this.users.filter((arr) => arr.id == id);
    this.userService
      .getAllByIdWeis(id)
      .pipe(first())
      .subscribe(
        (data) => {
          this.hospitalUsers = data;
        },
        (error) => {
          this.alertService.error(error);
        }
      );

    this.accordFlag = true;
  }
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

  deactivateall(id: string, flag: boolean) {
    this.userService
      .updateAllStatus(id, flag)
      .pipe(first())
      .subscribe(
        () => {
          let str: string;
          if (flag) {
            str = "Activated successfully";
          } else {
            str = "De-activated successfully";
          }
          this.alertService.success(str, true);
          this.loadAllUsersforAdmin();
          this.accordFlag = false;
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  editUser(user) {
    this.user = {};
    this.user = user;
    this.alertService.clear();
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
