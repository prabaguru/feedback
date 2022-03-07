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

@Component({ templateUrl: "opd.component.html" })
export class opdFBComponent implements OnInit {
  registrationForm: FormGroup;
  registrationFormApp: FormGroup;
  loading = false;
  submitted = false;
  RegType = ["First Timer", "Revisitor"];
  patType = ["I am the Patient", "I am Relative to the Patient"];
  kbuType = [
    "Friends",
    "News paper",
    "Online",
    "Referred by Dr",
    "Word of mouth",
  ];
  gender = ["Male", "Female", "Transgender"];
  specialityVisited = ["OPD – Speciality visited", "OPD Department visited"];
  tomorrow = new Date();
  minDate = new Date("01/01/1950");
  registrationForminvalid: boolean = false;
  succesFB: boolean = true;
  hospital_Id: string;
  hospital_Name: string;
  timeID;
  radioFlag: boolean = true;
  APPerformanceFlag: boolean = false;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  cage: any;
  Age: number;
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
      visitorType: ["First Timer"],
      PatientType: ["I am the Patient"],
      department: ["", []],
      Reception: ["", Validators.required],
      StaffCourtesy: ["", Validators.required],
      AbilitytoansweryourQueries: ["", Validators.required],
      GeneralComfortandCleanliness: ["", Validators.required],
      WaitingtimeforDoctor: ["", Validators.required],
      CarebyNurse: ["", Validators.required],
      CarebyDoctor: ["", Validators.required],
      LaboratoryService: ["", Validators.required],
      PharmacyService: ["", Validators.required],
      Comments: ["", []],
      Howdidyouknowaboutus: ["Online", []],
      Willyourevisitus: [false, []],
      WillyourecommendUs: [false, []],
      Willyousharehospitallink: [false, []],
      Name: ["", [Validators.required]],
      //lName: ["", []],
      Email: ["", []],
      Mobile: ["", [Validators.required]],
      Gender: ["Male", []],
      DOB: ["", []],
      age: ["", []],
      Pincode: ["", []],
      //specialityVisited: ["OPD Department visited", []],
    });

    this.registrationFormApp = this.formBuilder.group({
      rating: ["1", []],
      Comments: ["", []],
      name: ["", []],
    });
  }
  makeEvoid(e) {
    e.preventDefault();
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  calAge(e) {
    let date = e.target.value;
    var timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    this.cage = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) + " - Years";
    this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid

    if (this.registrationForm.invalid) {
      return (this.registrationForminvalid = true);
    } else {
      this.registrationForminvalid = false;
    }
    this.loading = true;
    let Fb = {};
    Fb = {
      OPDVisitedorOPDConsultationNumber: this.registrationForm.value.department,
      Reception: this.registrationForm.value.Reception,
      Staff_Courtesy: this.registrationForm.value.StaffCourtesy,
      Ability_to_answer_your_Queries:
        this.registrationForm.value.AbilitytoansweryourQueries,
      General_Comfort_and_Cleanliness:
        this.registrationForm.value.GeneralComfortandCleanliness,
      Waiting_time_for_Doctor: this.registrationForm.value.WaitingtimeforDoctor,
      Care_by_Nurse: this.registrationForm.value.CarebyNurse,
      Care_by_Doctor: this.registrationForm.value.CarebyDoctor,
      Laboratory_Service: this.registrationForm.value.LaboratoryService,
      Pharmacy_Service: this.registrationForm.value.PharmacyService,
      Comments: this.registrationForm.value.Comments,
      Willyourevisitus: this.registrationForm.value.Willyourevisitus,
      WillyourecommendUs: this.registrationForm.value.WillyourecommendUs,
      Willyousharehospitallink:
        this.registrationForm.value.Willyousharehospitallink,
      Email: this.registrationForm.value.Email,
      Name: this.registrationForm.value.Name,
      Mobile: this.registrationForm.value.Mobile,
      Gender: this.registrationForm.value.Gender,
      DOB: this.registrationForm.value.DOB,
      Age: this.Age,
      Pincode: this.registrationForm.value.Pincode,
      hospital_Id: this.hospital_Id,
      Howdidyouknowaboutus: this.registrationForm.value.Howdidyouknowaboutus,
      visitorType: this.registrationForm.value.visitorType,
      PatientType: this.registrationForm.value.PatientType,
    };
    this.userService
      .opdFeedBack(Fb)
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
