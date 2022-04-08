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
      mobile: ["", [Validators.required, Validators.pattern("^[-+0-9,' ']*$")]],
      //address: ['',[]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.alertService.clear();
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
    let mobNoArr = [];
    let mobNos: string = "";
    let replaceHySp = this.registerForm.value.mobile.replaceAll(/-|\s/g, "");
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
    //let mobNos = this.registerForm.value.mobile.trim();
    let msgString = `Hi, Request your feedback on your visit to ${hName},Your inputs will help us improve our service to you. Click here: ${dep},${hID},${hName} - WEISERMANNER.`;

    let smsUrl = `http://185.136.166.131/domestic/sendsms/bulksms.php?username=joykj&password=joykj@1&type=TEXT&sender=WEISER&mobile=${mobNos}&message=${msgString}&entityId=1601335161674716856&templateId=1607100000000125850`;
    this.shareData.setData("smsFlag", true);
    this.alertService.success("SMS sent successfully", true);
    this.loading = false;
    this.submitted = false;
    this.registerForm.reset();
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
        this.registerForm.reset();
      },
      error: function (xhr, status) {
        //this.alertService.error(status);
        this.loading = false;
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
