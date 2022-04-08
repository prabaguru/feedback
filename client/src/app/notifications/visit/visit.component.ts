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
import { MatDatepickerInputEvent } from "@angular/material";

@Component({
  templateUrl: "visit.component.html",
  styleUrls: ["./visit.component.scss"],
})
export class visitComponent implements OnInit {
  registrationForm: FormGroup;
  registrationFormApp: FormGroup;
  loading = false;
  submitted = false;
  notification = [];
  tomorrow = new Date();
  minDate = new Date("01/01/1970");
  registrationForminvalid: boolean = false;
  succesFB: boolean = true;
  notificationId: string;
  hospital_Name: string;
  timeID;
  APPerformanceFlag: boolean = false;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  cage: any;
  Age: any;
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
    this.timeID = "";
    this.notificationId = this.route.snapshot.queryParamMap.get("Nid");

    this.alertService.clear();
    this.registrationForm = this.formBuilder.group({
      Name: ["", [Validators.required]],
      Email: ["", []],
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
      Gender: ["Male", []],
      DOB: ["", []],
      age: ["", []],
    });
    this.getNotifications();
  }
  calAge(e) {
    let date = e.target.value;
    var timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    this.cage = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) + " - Years";
    this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  makeEvoid(e) {
    e.preventDefault();
  }
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
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      window.scroll(0, 0);
      this.registrationForminvalid = true;
      return;
    } else {
      this.registrationForminvalid = false;
    }
    this.loading = true;
    let Fb = {};
    Fb = {
      HowdidyoucometoknowaboutUs:
        this.registrationForm.value.HowdidyoucometoknowaboutUs,
      Reception: this.registrationForm.value.Reception,
      StaffCourtesy: this.registrationForm.value.StaffCourtesy,
      AbilitytoansweryourQueries:
        this.registrationForm.value.AbilitytoansweryourQueries,
      GeneralComfortandCleanliness:
        this.registrationForm.value.GeneralComfortandCleanliness,
      CarebyNurse: this.registrationForm.value.CarebyNurse,
      nurses: this.registrationForm.value.nurses,
      CarebyDoctor: this.registrationForm.value.CarebyDoctor,
      doctors: this.registrationForm.value.doctors,
      LaboratoryService: this.registrationForm.value.LaboratoryService,
      PharmacyService: this.registrationForm.value.PharmacyService,
      FoodService: this.registrationForm.value.FoodService,
      AdmissionProcess: this.registrationForm.value.AdmissionProcess,
      DischargeProcess: this.registrationForm.value.DischargeProcess,
      RoomServiceFacilities: this.registrationForm.value.RoomServiceFacilities,
      CostVsService: this.registrationForm.value.CostVsService,
      Comments: this.registrationForm.value.Comments,
      WillyourecommendUs: this.registrationForm.value.WillyourecommendUs,
      Email: this.registrationForm.value.Email,
      Name: this.registrationForm.value.Name,
      Mobile: this.registrationForm.value.Mobile,
      Gender: this.registrationForm.value.Gender,
      Pincode: this.registrationForm.value.Pincode,
      DOB: this.registrationForm.value.DOB,
      Age: this.Age,
      //hospital_Id: this.hospital_Id,
      IPDCONSULTATIONNo: this.registrationForm.value.IPDCONSULTATIONNo,
    };
    this.userService
      .ipdFeedBack(Fb)
      .pipe(first())
      .subscribe(
        (data) => {
          this.succesFB = false;
          this.alertService.success(
            "Feedback successfully submitted. Thank you for your time & interest in providing your feedback",
            true
          );
          this.loading = false;
          this.submitted = false;
          this.registrationForm.reset();
          this.APPerformanceFlag = true;
          // this.router.navigate([], {
          //   queryParams: { hID: null, tID: null },
          //   queryParamsHandling: "merge",
          // });
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
