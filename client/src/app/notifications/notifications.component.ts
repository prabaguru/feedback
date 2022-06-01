import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { User } from "@/_models";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import {
  AlertService,
  UserService,
  AuthenticationService,
  sharedDataService,
} from "@/_services";
import * as XLSX from "xlsx";
import * as $ from "jquery";
@Component({ templateUrl: "notifications.component.html" })
export class notificationsComponent implements OnInit {
  sendSmsForm: FormGroup;
  currentUser: User;
  notifications: any = [];
  loading = false;
  submitted = false;
  templateName: string = null;
  templateId: string = null;
  constructor(
    private formBuilder: FormBuilder,
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

    //this.alertService.clear();
    this.sendSmsForm = this.formBuilder.group({
      mobile: ["", [Validators.required, Validators.pattern("^[-+0-9,' ']*$")]],
    });
  }
  get f() {
    return this.sendSmsForm.controls;
  }
  sendEditData(data: any) {
    this.shareData.deleteData("editdata");
    this.shareData.setData("editdata", data);
    this.router.navigate(["/editnotification"]);
  }

  SendTemplateName(name: string, id: string) {
    this.templateName = "";
    this.templateId = "";
    this.templateName = name ? name : null;
    this.templateId = id ? id : null;
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
  onSubmit() {
    this.alertService.clear();
    let hName: string = "";
    let data = JSON.parse(sessionStorage.currentUser);

    if (data.Hname == null || data.Hname == undefined || data.Hname == "") {
      hName = data.firstName.toUpperCase();
    } else {
      hName = data.Hname.toUpperCase();
    }
    if (hName) {
      hName = hName.replace(/ /g, " ");
    }

    this.submitted = true;
    let mobNoArr = [];
    let mobNos: string = "";
    let replaceHySp = this.sendSmsForm.value.mobile.replaceAll(/-|\s/g, "");
    let array = replaceHySp.split(",");
    for (let i = 0; i < array.length; i++) {
      if (array[i].length >= 10 && array[i].length <= 13) {
        mobNoArr.push(array[i]);
      }
    }
    mobNos = mobNoArr.join();
    //console.log(mobNos);
    // reset alerts on submit
    this.alertService.clear();

    //stop here if form is invalid
    if (this.sendSmsForm.invalid) {
      return;
    }
    let dep = `http://gudwil.live/note.html?Nid=`;

    this.loading = true;
    let msgString = `Dear Health Seeker. Here is a New-Note from your ${hName}. ${dep}${this.templateId}. Share to Care.! - Weisermanner`;
    let smsUrl = `http://185.136.166.131/domestic/sendsms/bulksms.php?username=joykj&password=joykj@1&type=TEXT&sender=WEISER&mobile=${mobNos}&message=${msgString}&entityId=1601335161674716856&templateId=1607100000000206161`;
    this.alertService.success("SMS sent successfully", true);
    this.loading = false;
    this.submitted = false;
    this.sendSmsForm.reset();
    $.ajax({
      type: "GET",
      url: smsUrl,
      crossDomain: true,
      dataType: "jsonp",
      jsonpCallback: "callback",
      success: function () {
        //console.log(JSON.stringify(data));
        this.alertService.success("SMS sent successfully", true);
        this.loading = false;
        this.submitted = false;
        this.sendSmsForm.reset();
        $("#closenote").click();
      },
      error: function (xhr, status) {
        //this.alertService.error(status);
        this.loading = false;
        //this.sendSmsForm.reset();
        $("#closenote").click();
      },
    });
  }
  onFileChange(ev) {
    this.alertService.clear();
    let phonenos = [];
    let mobilenbs = null;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      let result = jsonData.Sheet1[0].hasOwnProperty("mobilenos");
      if (!result) {
        (document.getElementById("fileexcel") as HTMLInputElement).value = null;
        return this.alertService.error(
          'Invalid File... Upload excel/csv file with a single column "mobilenos" followed by mobile nos'
        );
      }
      if (Object.keys(jsonData.Sheet1[0]).length > 1) {
        (document.getElementById("fileexcel") as HTMLInputElement).value = null;
        return this.alertService.error(
          "Invalid column format... More than one column in the uploaded excel sheet"
        );
      }

      phonenos = jsonData.Sheet1.map((a) => a.mobilenos);
      mobilenbs = phonenos.toString();
      this.sendSmsForm.controls.mobile.setValue("");
      this.sendSmsForm.controls.mobile.setValue(mobilenbs);
      (document.getElementById("fileexcel") as HTMLInputElement).value = null;

      //document.getElementById('output').innerHTML = this.phonenos;
    };
    reader.readAsBinaryString(file);
  }

  deactivateNote(id, status) {
    this.submitted = true;
    let obj: any = {
      id: id,
      status: status,
    };
    // reset alerts on submit
    this.alertService.clear();
    this.userService
      .updateNotifications(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          if (status) {
            this.alertService.success("Activated successfully", true);
          } else {
            this.alertService.error("Deactivated successfully", true);
          }
          this.loadAllNotifications();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  formreset() {
    this.sendSmsForm.controls.mobile.setValue("");
    this.submitted = false;
  }
}
