import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { AlertService, sharedDataService } from "@/_services";
import * as XLSX from "xlsx";
import * as $ from "jquery";
@Component({ templateUrl: "customer.component.html" })
export class customerComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private shareData: sharedDataService,
    private http: HttpClient
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.alertService.clear();
    this.registerForm = this.formBuilder.group({
      //name: ['', Validators.required],
      //email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      mobile: ["", [Validators.required, Validators.pattern("^[0-9,]*$")]],
      //address: ['',[]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    let dep: string = "";
    let hID: string = "";
    let hName: string = "";
    let data = JSON.parse(sessionStorage.currentUser);
    if (
      data.hospital_id == null ||
      data.hospital_id == undefined ||
      data.hospital_id == ""
    ) {
      hID = data._id;
    } else {
      hID = data.hospital_id;
    }

    if (data.Hname == null || data.Hname == undefined || data.Hname == "") {
      hName = data.firstName.toUpperCase();
    } else {
      hName = data.Hname.toUpperCase();
    }
    if (hName) {
      hName = hName.replace(/ /g, "");
    }
    let Nsting: string = "Give your Feedfack";

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.value["department"] =
      this.shareData.getData("departMent");
    if (this.shareData.getData("departMent") == "OPD") {
      dep = "http://gudwil.live/sms.html?dep=opdfeedback";
    }
    if (this.shareData.getData("departMent") == "IPD") {
      dep = "http://gudwil.live/sms.html?dep=ipdfeedback";
    }
    this.loading = true;
    let mobNos = this.registerForm.value.mobile.trim();
    let msgString = `Hi, Request your feedback on your visit to ${hName},Your inputs will help us improve our service to you. Click here: ${dep},${hID},${hName} - WEISERMANNER.`;
    this.whatappAPIReq(msgString);
    let smsUrl =
      "http://185.136.166.131/domestic/sendsms/bulksms.php?username=joykj&password=joykj@1&type=TEXT&sender=WEISER&mobile=" +
      mobNos +
      "&message=" +
      msgString +
      "&entityId=1601335161674716856&templateId=1607100000000125850";
    this.shareData.setData("smsFlag", true);
    this.alertService.success("SMS sent successfully", true);
    this.loading = false;
    this.submitted = false;
    this.registerForm.reset();
    $.ajax({
      method: "GET",
      url: smsUrl,
      crossDomain: true,
      done: function () {},
      success: function () {
        //console.log(JSON.stringify(data));
      },
      error: function (xhr, status) {},
    });
    // this.http
    //   .get(smsUrl)
    //   .pipe(first())
    //   .subscribe(
    //     () => {
    //       this.alertService.success("SMS sent successfully", true);
    //       this.loading = false;
    //       this.submitted = false;
    //       this.registerForm.reset();
    //     },
    //     (error) => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //     }
    //   );
  }

  whatappAPIReq(mess) {
    var data = {
      to: "+919980568567",
      type: "hsm",
      from: "aa4c8e7cee664341a22ef9bfd9f52477",
      content: {
        hsm: {
          namespace: "61705ee7-6aa2-45f7-a847-41132871c315",
          templateName: "gudwil_feedback_template",
          language: {
            policy: "deterministic",
            code: "en",
          },
          params: [{ default: "Bob" }, { default: "tomorrow!" }],
        },
      },
    };

    let aUrl = "https://conversations.messagebird.com/v1/send";
    $.ajax({
      data: data,
      method: "POST",
      dataType: "json",
      cors: true,
      secure: true,
      headers: {
        Authorization: "AccessKey" + "xviwR0ZGgwT8WVU5InhX0uUgy",
        contentType: "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(""));
      },
      url: aUrl,
      crossDomain: true,
      done: function () {},
      success: function () {
        console.log(JSON.stringify(data));
      },
      error: function (xhr, status) {},
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
      this.registerForm.controls.mobile.setValue("");
      this.registerForm.controls.mobile.setValue(mobilenbs);
      (document.getElementById("fileexcel") as HTMLInputElement).value = null;

      //document.getElementById('output').innerHTML = this.phonenos;
    };
    reader.readAsBinaryString(file);
  }

  formreset() {
    this.registerForm.controls.mobile.setValue("");
    this.submitted = false;
  }
}
