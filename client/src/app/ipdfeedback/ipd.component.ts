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

@Component({ templateUrl: "ipd.component.html" })
export class ipdFBComponent implements OnInit {
  registrationForm: FormGroup;
  registrationFormApp: FormGroup;
  loading = false;
  submitted = false;
  kabtUS = [
    "Doctor recommendation",
    "Reputation of Hospital",
    "Friends / relatives",
    "Location",
    "Services available here",
    "Staff courtesy & Care",
    "Insurance Requirements",
    "Heard on TV",
    "Media",
  ];
  patType = ["I am the Patient", "I am Relative to the Patient"];
  gender = ["Male", "Female", "Transgender"];
  specialityVisited = ["OPD – Speciality visited", "OPD Department visited"];
  tomorrow = new Date();
  minDate = new Date("01/01/1970");
  registrationForminvalid: boolean = false;
  succesFB: boolean = true;
  hospital_Id: string;
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
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.hospital_Id = "";
    this.timeID = "";
    this.hospital_Id = this.route.snapshot.queryParamMap.get("hID");
    this.hospital_Name = this.route.snapshot.queryParamMap.get("hName");
    this.timeID = this.route.snapshot.queryParamMap.get("tID");
    if (
      this.hospital_Id == null ||
      this.hospital_Id == undefined ||
      this.hospital_Id == ""
    ) {
      this.succesFB = false;
      this.alertService.success("Feedback already submitted.", true);
      return;
    }
    // var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
    //  if (OneDay < this.timeID) {
    //     this.succesFB=false;
    //     this.alertService.success('Link Expired... Contact Admin...', true);
    //     return;
    // }
    this.alertService.clear();
    this.registrationForm = this.formBuilder.group({
      HowdidyoucometoknowaboutUs: ["Doctor recommendation", []],
      Reception: ["5", Validators.required],
      StaffCourtesy: ["5", Validators.required],
      AbilitytoansweryourQueries: ["5", Validators.required],
      GeneralComfortandCleanliness: ["5", Validators.required],
      CarebyNurse: ["5", Validators.required],
      nurses: [""],
      CarebyDoctor: ["5", Validators.required],
      doctors: [""],
      LaboratoryService: ["5", Validators.required],
      PharmacyService: ["5", Validators.required],
      //OverallcoordinationofCare: ["5", Validators.required],
      FoodService: ["5", Validators.required],
      AdmissionProcess: ["5", Validators.required],
      DischargeProcess: ["5", Validators.required],
      RoomServiceFacilities: ["5", Validators.required],
      CostVsService: ["5", Validators.required],
      Comments: ["", []],
      //ClientExperience: ["5", []],
      WillyourecommendUs: [false, []],
      Name: ["", [Validators.required]],
      //lName: ["", []],
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
      Pincode: ["", []],
      IPDCONSULTATIONNo: ["", []],
      //RoomNo: ["", []],
    });

    this.registrationFormApp = this.formBuilder.group({
      rating: ["", []],
      Comments: ["", []],
      name: ["", []],
    });
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
      hospital_Id: this.hospital_Id,
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

    let customer = {};
    customer = {
      Name: this.registrationForm.value.Name,
      Mobile: this.registrationForm.value.Mobile,
      Email: this.registrationForm.value.Email,
      Gender: this.registrationForm.value.Gender,
      DOB: this.registrationForm.value.DOB,
      Pincode: this.registrationForm.value.Pincode,
    };
    this.userService
      .sendSMSandRegister(customer)
      .pipe(first())
      .subscribe(
        (data) => {},
        (error) => {}
      );
  }

  onSubmitApp() {
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registrationFormApp.invalid) {
      return;
    }
    this.loading = true;
    let Fb = {};
    Fb = {
      rating: this.registrationFormApp.value.rating,
      Comments: this.registrationFormApp.value.Comments,
      name: "Feedback",
    };
    this.userService
      .APPerformance(Fb)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success(
            "Thank you for your time & interest in providing your feedback",
            true
          );
          this.loading = false;
          this.APPerformanceFlag = false;
          //this.registrationFormApp.reset();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
