import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AuthenticationService,
  sharedDataService,
  AlertService,
} from "./_services";
import { User } from "./_models";
import "./_content/app.less";
import * as $ from "jquery";
@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent implements OnInit {
  currentUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public shareData: sharedDataService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }
  ngOnInit() {
    console.log(this.currentUser);
  }
  logout() {
    this.shareData.setData("smsFlag", false);
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
    this.alertService.clear();
  }
  clearAlert() {
    this.alertService.clear();
  }
  toggleMenu(e) {
    //$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    //});
  }

  ChangeOPD(d: string) {
    this.shareData.setData("departMent", d);
    this.shareData.setData("smsFlag", false);
    //$("#smsreset").click();
  }
}
