import { Component, OnInit, OnDestroy } from "@angular/core";
import { first } from "rxjs/operators";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { User } from "@/_models";
import {
  AlertService,
  UserService,
  AuthenticationService,
  sharedDataService,
} from "@/_services";
import * as $ from "jquery";
import { GoogleChartInterface } from "ng2-google-charts";

@Component({ templateUrl: "history.component.html" })
export class HistoryComponent implements OnInit, OnDestroy {
  currentUser: User;
  loading = false;
  ipdfeedbackdata: any = [];
  opdfeedbackdata: any = [];
  ipdChartFlag: boolean = false;
  opdChartFlag: boolean = false;
  chartRowCount;

  //chart var
  public pieChart: GoogleChartInterface;
  public opd1: GoogleChartInterface;
  public opd2: GoogleChartInterface;
  public opd3: GoogleChartInterface;
  public opd4: GoogleChartInterface;
  public opd5: GoogleChartInterface;
  public opd6: GoogleChartInterface;
  public opd7: GoogleChartInterface;
  public opd8: GoogleChartInterface;
  public opd9: GoogleChartInterface;
  public opd10: GoogleChartInterface;
  public opd11: GoogleChartInterface;
  public opd12: GoogleChartInterface;
  public opd13: GoogleChartInterface;
  public opd14: GoogleChartInterface;
  public opd15: GoogleChartInterface;
  public opd16: GoogleChartInterface;

  public ipd1: GoogleChartInterface;
  public ipd2: GoogleChartInterface;
  public ipd3: GoogleChartInterface;
  public ipd4: GoogleChartInterface;
  public ipd5: GoogleChartInterface;
  public ipd6: GoogleChartInterface;
  public ipd7: GoogleChartInterface;
  public ipd8: GoogleChartInterface;
  public ipd9: GoogleChartInterface;
  public ipd10: GoogleChartInterface;
  public ipd11: GoogleChartInterface;
  public ipd12: GoogleChartInterface;
  public ipd13: GoogleChartInterface;
  public ipd14: GoogleChartInterface;
  public ipd15: GoogleChartInterface;
  public ipd16: GoogleChartInterface;
  reportSendForm: FormGroup;
  submitted = false;
  emailtemplateipd: string = "NO IPD Records found...";
  emailtemplateopd: string = "NO OPD Records found...";
  reportEmail: any;
  maintemplate;
  reportType = "Consolidated Feedback Report";
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private shareData: sharedDataService,
    private formBuilder: FormBuilder
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.alertService.clear();
  }
  ngOnDestroy() {
    this.shareData.deleteData("departMent");
    this.shareData.deleteData("opdfeedbackdata");
    this.shareData.deleteData("ipdfeedbackdata");
  }
  ngOnInit() {
    this.alertService.clear();
    this.getFeedbackIPD(this.currentUser._id);

    this.reportSendForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9_.+-]+@[a-z0-9-]+.[a-z0-9-.]+$"),
        ],
      ],
    });
  }
  get f() {
    return this.reportSendForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    // stop here if form is invalid
    if (this.reportSendForm.invalid) {
      return;
    } else {
      this.submitted = false;
      this.alertService.clear();
      this.chartRowCount =
        this.opdfeedbackdata.length + this.ipdfeedbackdata.length;
      if (this.chartRowCount == 0) {
        this.alertService.error("No Records found...");
      }
      if (this.chartRowCount > 0) {
        this.maintemplate = `<h2><span style='text-transform: uppercase;'>${this.currentUser.firstName}<span> - ${this.reportType}</h2> 
        <p>Total OPD feedback recieved:${this.opdfeedbackdata.length}</br>
         Total IPD feedback recieved:${this.ipdfeedbackdata.length}</p>`;
        if (this.opdfeedbackdata.length > 0) {
          this.otherOpdData(true);
        }
        if (this.ipdfeedbackdata.length > 0) {
          this.otheripdData(true);
        }
      }
    }
    //this.loading = true;
  }

  getdetailType(d) {
    this.shareData.setData("departMent", d);
  }

  getdatePeriod(v: number) {
    if (v == 7) {
      this.reportType = "Weekly Feedback Report";
    } else if (v == 30) {
      this.reportType = "Monthly Feedback Report";
    } else if (v == 180) {
      this.reportType = "Six Months Feedback Report";
    } else {
      this.reportType = "Consolidated Feedback Report";
    }
    this.ipdChartFlag = false;
    this.opdfeedbackdata = null;
    this.ipdfeedbackdata = null;
    this.opdfeedbackdata = this.shareData.getData("opdfeedbackdata");
    this.ipdfeedbackdata = this.shareData.getData("ipdfeedbackdata");
    if (v == 7 || v == 30 || v == 180) {
      let weekDate = new Date(
        new Date().setDate(new Date().getDate() - v)
      ).toISOString();
      this.opdfeedbackdata = this.opdfeedbackdata.filter(
        (item) => item.createdDate >= weekDate
      );
      this.ipdfeedbackdata = this.ipdfeedbackdata.filter(
        (item) => item.createdDate >= weekDate
      );
    }

    setTimeout(() => {
      this.getChart();
    }, 0);
  }

  getChart() {
    this.alertService.clear();
    this.chartRowCount =
      this.opdfeedbackdata.length + this.ipdfeedbackdata.length;
    if (this.chartRowCount == 0) {
      this.alertService.error("No Records found...");
    }
    if (this.chartRowCount > 0) {
      this.ipdChartFlag = true;
      this.pieChart = {
        chartType: "BarChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["OPD", this.opdfeedbackdata.length],
          ["IPD", this.ipdfeedbackdata.length],
        ],
        options: {
          title: "Feedback Recieved Till Date",
          pieSliceText: "value",
        },
      };
      if (this.opdfeedbackdata.length > 0) {
        this.otherOpdData(false);
      }
      if (this.ipdfeedbackdata.length > 0) {
        this.otheripdData(false);
      }
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
          this.shareData.setData("ipdfeedbackdata", data);
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
          this.shareData.setData("opdfeedbackdata", data);
          this.getChart();
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  otherOpdData(sr?) {
    var opd15 = this.opdfeedbackdata.filter(
      (item) => item.Ability_to_answer_your_Queries == 5
    ).length;
    var opd14 = this.opdfeedbackdata.filter(
      (item) => item.Ability_to_answer_your_Queries == 4
    ).length;
    var opd13 = this.opdfeedbackdata.filter(
      (item) => item.Ability_to_answer_your_Queries == 3
    ).length;
    var opd12 = this.opdfeedbackdata.filter(
      (item) => item.Ability_to_answer_your_Queries == 2
    ).length;
    var opd1o = this.opdfeedbackdata.filter(
      (item) => item.Ability_to_answer_your_Queries == 1
    ).length;
    var opd25 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Doctor == 5
    ).length;
    var opd24 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Doctor == 4
    ).length;
    var opd23 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Doctor == 3
    ).length;
    var opd22 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Doctor == 2
    ).length;
    var opd2o = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Doctor == 1
    ).length;
    var opd35 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Nurse == 5
    ).length;
    var opd34 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Nurse == 4
    ).length;
    var opd33 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Nurse == 3
    ).length;
    var opd32 = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Nurse == 2
    ).length;
    var opd3o = this.opdfeedbackdata.filter(
      (item) => item.Care_by_Nurse == 1
    ).length;
    var opd45 = this.opdfeedbackdata.filter(
      (item) => item.General_Comfort_and_Cleanliness == 5
    ).length;
    var opd44 = this.opdfeedbackdata.filter(
      (item) => item.General_Comfort_and_Cleanliness == 4
    ).length;
    var opd43 = this.opdfeedbackdata.filter(
      (item) => item.General_Comfort_and_Cleanliness == 3
    ).length;
    var opd42 = this.opdfeedbackdata.filter(
      (item) => item.General_Comfort_and_Cleanliness == 2
    ).length;
    var opd4o = this.opdfeedbackdata.filter(
      (item) => item.General_Comfort_and_Cleanliness == 1
    ).length;
    var opd55 = this.opdfeedbackdata.filter(
      (item) => item.Laboratory_Service == 5
    ).length;
    var opd54 = this.opdfeedbackdata.filter(
      (item) => item.Laboratory_Service == 4
    ).length;
    var opd53 = this.opdfeedbackdata.filter(
      (item) => item.Laboratory_Service == 3
    ).length;
    var opd52 = this.opdfeedbackdata.filter(
      (item) => item.Laboratory_Service == 2
    ).length;
    var opd5o = this.opdfeedbackdata.filter(
      (item) => item.Laboratory_Service == 1
    ).length;
    var opd65 = this.opdfeedbackdata.filter(
      (item) => item.Pharmacy_Service == 5
    ).length;
    var opd64 = this.opdfeedbackdata.filter(
      (item) => item.Pharmacy_Service == 4
    ).length;
    var opd63 = this.opdfeedbackdata.filter(
      (item) => item.Pharmacy_Service == 3
    ).length;
    var opd62 = this.opdfeedbackdata.filter(
      (item) => item.Pharmacy_Service == 2
    ).length;
    var opd6o = this.opdfeedbackdata.filter(
      (item) => item.Pharmacy_Service == 1
    ).length;
    var opd75 = this.opdfeedbackdata.filter(
      (item) => item.Reception == 5
    ).length;
    var opd74 = this.opdfeedbackdata.filter(
      (item) => item.Reception == 4
    ).length;
    var opd73 = this.opdfeedbackdata.filter(
      (item) => item.Reception == 3
    ).length;
    var opd72 = this.opdfeedbackdata.filter(
      (item) => item.Reception == 2
    ).length;
    var opd7o = this.opdfeedbackdata.filter(
      (item) => item.Reception == 1
    ).length;
    var opd85 = this.opdfeedbackdata.filter(
      (item) => item.Staff_Courtesy == 5
    ).length;
    var opd84 = this.opdfeedbackdata.filter(
      (item) => item.Staff_Courtesy == 4
    ).length;
    var opd83 = this.opdfeedbackdata.filter(
      (item) => item.Staff_Courtesy == 3
    ).length;
    var opd82 = this.opdfeedbackdata.filter(
      (item) => item.Staff_Courtesy == 2
    ).length;
    var opd8o = this.opdfeedbackdata.filter(
      (item) => item.Staff_Courtesy == 1
    ).length;
    var opd95 = this.opdfeedbackdata.filter(
      (item) => item.Waiting_time_for_Doctor == 5
    ).length;
    var opd94 = this.opdfeedbackdata.filter(
      (item) => item.Waiting_time_for_Doctor == 4
    ).length;
    var opd93 = this.opdfeedbackdata.filter(
      (item) => item.Waiting_time_for_Doctor == 3
    ).length;
    var opd92 = this.opdfeedbackdata.filter(
      (item) => item.Waiting_time_for_Doctor == 2
    ).length;
    var opd9o = this.opdfeedbackdata.filter(
      (item) => item.Waiting_time_for_Doctor == 1
    ).length;
    if (!sr) {
      let data = this.opdfeedbackdata;

      this.opd12 = {
        chartType: "BarChart",
        dataTable: [
          ["Feedback", "Recieved"],
          [
            "Revisit",
            data.filter((item) => item.Willyourevisitus == "true").length,
          ],
          [
            "Will Not Revisit",
            data.filter((item) => item.Willyourevisitus == "").length,
          ],
        ],
        options: { title: "Will you revisit Us", colors: ["#900000"] },
      };

      this.opd11 = {
        chartType: "BarChart",
        dataTable: [
          ["Feedback", "Recieved"],
          [
            "Recommended",
            data.filter((item) => item.WillyourecommendUs == "true").length,
          ],
          [
            "Not Recommended",
            data.filter((item) => item.WillyourecommendUs == "").length,
          ],
        ],
        options: {
          title: "Will you recommend Us",
          colors: ["#e02765", "#900000"],
        },
      };

      this.opd13 = {
        chartType: "BarChart",
        dataTable: [
          ["Feedback", "Recieved"],
          [
            "Wiil Share",
            data.filter((item) => item.Willyousharehospitallink == "true")
              .length,
          ],
          [
            "Will not Share",
            data.filter((item) => item.Willyousharehospitallink == "").length,
          ],
        ],
        options: {
          title: "Will You share hospital link",
          colors: ["#e02765", "#900000"],
        },
      };

      this.opd1 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd15],
          ["Better", opd14],
          ["Good", opd13],
          ["Average", opd12],
          ["Poor", opd1o],
        ],
        options: { title: "Ability to answer your queries", pieHole: 0.4 },
      };

      this.opd2 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd25],
          ["Better", opd24],
          ["Good", opd23],
          ["Average", opd22],
          ["Poor", opd2o],
        ],
        options: { title: "Care by doctor", pieHole: 0.4 },
      };

      this.opd3 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd35],
          ["Better", opd34],
          ["Good", opd33],
          ["Average", opd32],
          ["Poor", opd3o],
        ],
        options: { title: "Care by Nurse", pieHole: 0.4 },
      };

      // this.opd4 = {
      //   chartType: "PieChart",
      //   dataTable: [
      //     ["Feedback", "Recieved"],
      //     ["Excellent", data.filter((item) => item.ClientExperience == 5).length],
      //     ["Better", data.filter((item) => item.ClientExperience == 4).length],
      //     ["Good", data.filter((item) => item.ClientExperience == 3).length],
      //     ["Average", data.filter((item) => item.ClientExperience == 2).length],
      //     ["Poor", data.filter((item) => item.ClientExperience == 1).length],
      //   ],
      //   options: { title: "Client Experience", pieHole: 0.4 },
      // };

      this.opd5 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd45],
          ["Better", opd44],
          ["Good", opd43],
          ["Average", opd42],
          ["Poor", opd4o],
        ],
        options: { title: "General Comfort and Cleanliness", pieHole: 0.4 },
      };

      this.opd6 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd55],
          ["Better", opd54],
          ["Good", opd53],
          ["Average", opd52],
          ["Poor", opd5o],
        ],
        options: { title: "Laboratory Service", pieHole: 0.4 },
      };

      this.opd7 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd65],
          ["Better", opd64],
          ["Good", opd63],
          ["Average", opd62],
          ["Poor", opd6o],
        ],
        options: { title: "Pharmacy Service", pieHole: 0.4 },
      };

      this.opd8 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd75],
          ["Better", opd74],
          ["Good", opd73],
          ["Average", opd72],
          ["Poor", opd7o],
        ],
        options: { title: "Reception", pieHole: 0.4 },
      };

      this.opd9 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd85],
          ["Better", opd84],
          ["Good", opd83],
          ["Average", opd82],
          ["Poor", opd8o],
        ],
        options: { title: "Staff Courtesy", pieHole: 0.4 },
      };

      this.opd10 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", opd95],
          ["Better", opd94],
          ["Good", opd93],
          ["Average", opd92],
          ["Poor", opd9o],
        ],
        options: { title: "Waiting time for Doctor", pieHole: 0.4 },
      };
    } else {
      this.emailtemplateopd = `<table border="1">
<thead>
<tr>
<th>OPD Data</th>
<th>Excellent</th>
<th>Better</th>
<th>Good</th>
<th>Average</th>
<th>Poor</th>
</tr>
</thead>
<tbody>
<tr>
<td>1. Reception</td>
<td>${opd75}</td>
<td>${opd74}</td>
<td>${opd73}</td>
<td>${opd72}</td>
<td>${opd7o}</td>
</tr>
<tr>
<td>2. Staff Courtesy</td>
<td>${opd85}</td>
<td>${opd84}</td>
<td>${opd83}</td>
<td>${opd82}</td>
<td>${opd8o}</td>
</tr>
<tr>
<td>3. Ability to answer your Queries</td>
<td>${opd15}</td>
<td>${opd14}</td>
<td>${opd13}</td>
<td>${opd12}</td>
<td>${opd1o}</td>
</tr>
<tr>
<td>4. General Comfort & Cleanlines</td>
<td>${opd45}</td>
<td>${opd44}</td>
<td>${opd43}</td>
<td>${opd42}</td>
<td>${opd4o}</td>
</tr>
<tr>
<td>5. Waiting time for Doctor</td>
<td>${opd95}</td>
<td>${opd94}</td>
<td>${opd93}</td>
<td>${opd92}</td>
<td>${opd9o}</td>
</tr>
<tr>
<td>6. Care by Nurse</td>
<td>${opd35}</td>
<td>${opd34}</td>
<td>${opd33}</td>
<td>${opd32}</td>
<td>${opd3o}</td>
</tr>
<tr>
<td>7. Care by Doctor</td>
<td>${opd25}</td>
<td>${opd24}</td>
<td>${opd23}</td>
<td>${opd22}</td>
<td>${opd2o}</td>
</tr>
<tr>
<td>8. Laboratory Service</td>
<td>${opd55}</td>
<td>${opd54}</td>
<td>${opd53}</td>
<td>${opd52}</td>
<td>${opd5o}</td>
</tr>
<tr>
<td>9. Pharmacy Service</td>
<td>${opd65}</td>
<td>${opd64}</td>
<td>${opd63}</td>
<td>${opd62}</td>
<td>${opd6o}</td>
</tr>
</tbody>
</table>`;
    }
  }

  otheripdData(sr?) {
    var ipd15 = this.ipdfeedbackdata.filter(
      (item) => item.AbilitytoansweryourQueries == 5
    ).length;
    var ipd14 = this.ipdfeedbackdata.filter(
      (item) => item.AbilitytoansweryourQueries == 4
    ).length;
    var ipd13 = this.ipdfeedbackdata.filter(
      (item) => item.AbilitytoansweryourQueries == 3
    ).length;
    var ipd12 = this.ipdfeedbackdata.filter(
      (item) => item.AbilitytoansweryourQueries == 2
    ).length;
    var ipd1o = this.ipdfeedbackdata.filter(
      (item) => item.AbilitytoansweryourQueries == 1
    ).length;
    var ipd25 = this.ipdfeedbackdata.filter(
      (item) => item.AdmissionProcess == 5
    ).length;
    var ipd24 = this.ipdfeedbackdata.filter(
      (item) => item.AdmissionProcess == 4
    ).length;
    var ipd23 = this.ipdfeedbackdata.filter(
      (item) => item.AdmissionProcess == 3
    ).length;
    var ipd22 = this.ipdfeedbackdata.filter(
      (item) => item.AdmissionProcess == 2
    ).length;
    var ipd2o = this.ipdfeedbackdata.filter(
      (item) => item.AdmissionProcess == 1
    ).length;
    var ipd35 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyDoctor == 5
    ).length;
    var ipd34 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyDoctor == 4
    ).length;
    var ipd33 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyDoctor == 3
    ).length;
    var ipd32 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyDoctor == 2
    ).length;
    var ipd3o = this.ipdfeedbackdata.filter(
      (item) => item.CarebyDoctor == 1
    ).length;
    var ipd45 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyNurse == 5
    ).length;
    var ipd44 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyNurse == 4
    ).length;
    var ipd43 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyNurse == 3
    ).length;
    var ipd42 = this.ipdfeedbackdata.filter(
      (item) => item.CarebyNurse == 2
    ).length;
    var ipd4o = this.ipdfeedbackdata.filter(
      (item) => item.CarebyNurse == 1
    ).length;
    var ipd55 = this.ipdfeedbackdata.filter(
      (item) => item.CostVsService == 5
    ).length;
    var ipd54 = this.ipdfeedbackdata.filter(
      (item) => item.CostVsService == 4
    ).length;
    var ipd53 = this.ipdfeedbackdata.filter(
      (item) => item.CostVsService == 3
    ).length;
    var ipd52 = this.ipdfeedbackdata.filter(
      (item) => item.CostVsService == 2
    ).length;
    var ipd5o = this.ipdfeedbackdata.filter(
      (item) => item.CostVsService == 1
    ).length;
    var ipd65 = this.ipdfeedbackdata.filter(
      (item) => item.DischargeProcess == 5
    ).length;
    var ipd64 = this.ipdfeedbackdata.filter(
      (item) => item.DischargeProcess == 4
    ).length;
    var ipd63 = this.ipdfeedbackdata.filter(
      (item) => item.DischargeProcess == 3
    ).length;
    var ipd62 = this.ipdfeedbackdata.filter(
      (item) => item.DischargeProcess == 2
    ).length;
    var ipd6o = this.ipdfeedbackdata.filter(
      (item) => item.DischargeProcess == 1
    ).length;
    var ipd75 = this.ipdfeedbackdata.filter(
      (item) => item.FoodService == 5
    ).length;
    var ipd74 = this.ipdfeedbackdata.filter(
      (item) => item.FoodService == 4
    ).length;
    var ipd73 = this.ipdfeedbackdata.filter(
      (item) => item.FoodService == 3
    ).length;
    var ipd72 = this.ipdfeedbackdata.filter(
      (item) => item.FoodService == 2
    ).length;
    var ipd7o = this.ipdfeedbackdata.filter(
      (item) => item.FoodService == 1
    ).length;
    var ipd85 = this.ipdfeedbackdata.filter(
      (item) => item.GeneralComfortandCleanliness == 5
    ).length;
    var ipd84 = this.ipdfeedbackdata.filter(
      (item) => item.GeneralComfortandCleanliness == 4
    ).length;
    var ipd83 = this.ipdfeedbackdata.filter(
      (item) => item.GeneralComfortandCleanliness == 3
    ).length;
    var ipd82 = this.ipdfeedbackdata.filter(
      (item) => item.GeneralComfortandCleanliness == 2
    ).length;
    var ipd8o = this.ipdfeedbackdata.filter(
      (item) => item.GeneralComfortandCleanliness == 1
    ).length;
    var ipd95 = this.ipdfeedbackdata.filter(
      (item) => item.LaboratoryService == 5
    ).length;
    var ipd94 = this.ipdfeedbackdata.filter(
      (item) => item.LaboratoryService == 4
    ).length;
    var ipd93 = this.ipdfeedbackdata.filter(
      (item) => item.LaboratoryService == 3
    ).length;
    var ipd92 = this.ipdfeedbackdata.filter(
      (item) => item.LaboratoryService == 2
    ).length;
    var ipd9o = this.ipdfeedbackdata.filter(
      (item) => item.LaboratoryService == 1
    ).length;
    var ipd105 = this.ipdfeedbackdata.filter(
      (item) => item.PharmacyService == 5
    ).length;
    var ipd104 = this.ipdfeedbackdata.filter(
      (item) => item.PharmacyService == 4
    ).length;
    var ipd103 = this.ipdfeedbackdata.filter(
      (item) => item.PharmacyService == 3
    ).length;
    var ipd102 = this.ipdfeedbackdata.filter(
      (item) => item.PharmacyService == 2
    ).length;
    var ipd10o = this.ipdfeedbackdata.filter(
      (item) => item.PharmacyService == 1
    ).length;
    var ipd115 = this.ipdfeedbackdata.filter(
      (item) => item.Reception == 5
    ).length;
    var ipd114 = this.ipdfeedbackdata.filter(
      (item) => item.Reception == 4
    ).length;
    var ipd113 = this.ipdfeedbackdata.filter(
      (item) => item.Reception == 3
    ).length;
    var ipd112 = this.ipdfeedbackdata.filter(
      (item) => item.Reception == 2
    ).length;
    var ipd11o = this.ipdfeedbackdata.filter(
      (item) => item.Reception == 1
    ).length;
    var ipd125 = this.ipdfeedbackdata.filter(
      (item) => item.RoomServiceFacilities == 5
    ).length;
    var ipd124 = this.ipdfeedbackdata.filter(
      (item) => item.RoomServiceFacilities == 4
    ).length;
    var ipd123 = this.ipdfeedbackdata.filter(
      (item) => item.RoomServiceFacilities == 3
    ).length;
    var ipd122 = this.ipdfeedbackdata.filter(
      (item) => item.RoomServiceFacilities == 2
    ).length;
    var ipd12o = this.ipdfeedbackdata.filter(
      (item) => item.RoomServiceFacilities == 1
    ).length;
    var ipd135 = this.ipdfeedbackdata.filter(
      (item) => item.StaffCourtesy == 5
    ).length;
    var ipd134 = this.ipdfeedbackdata.filter(
      (item) => item.StaffCourtesy == 4
    ).length;
    var ipd133 = this.ipdfeedbackdata.filter(
      (item) => item.StaffCourtesy == 3
    ).length;
    var ipd132 = this.ipdfeedbackdata.filter(
      (item) => item.StaffCourtesy == 2
    ).length;
    var ipd13o = this.ipdfeedbackdata.filter(
      (item) => item.StaffCourtesy == 1
    ).length;

    if (!sr) {
      let data = this.ipdfeedbackdata;

      this.ipd15 = {
        chartType: "BarChart",
        dataTable: [
          ["Feedback", "Recieved"],
          [
            "Recommended",
            data.filter((item) => item.WillyourecommendUs == "true").length,
          ],
          [
            "Not Recommended",
            data.filter((item) => item.WillyourecommendUs == "false").length,
          ],
        ],
        options: {
          title: "Will you recommend Us",
          colors: ["#e2431e", "#e243ui"],
        },
      };

      this.ipd1 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd15],
          ["Better", ipd14],
          ["Good", ipd13],
          ["Average", ipd12],
          ["Poor", ipd1o],
        ],
        options: { title: "Ability to answer your queries", pieHole: 0.4 },
      };

      this.ipd2 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd25],
          ["Better", ipd24],
          ["Good", ipd23],
          ["Average", ipd22],
          ["Poor", ipd2o],
        ],
        options: { title: "Admission Process", pieHole: 0.4 },
      };

      this.ipd3 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd35],
          ["Better", ipd34],
          ["Good", ipd33],
          ["Average", ipd32],
          ["Poor", ipd3o],
        ],
        options: { title: "Care by Doctor", pieHole: 0.4 },
      };

      this.ipd4 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd45],
          ["Better", ipd44],
          ["Good", ipd43],
          ["Average", ipd42],
          ["Poor", ipd4o],
        ],
        options: { title: "Care by Nurse", pieHole: 0.4 },
      };

      // this.ipd5 = {
      //   chartType: "PieChart",
      //   dataTable: [
      //     ["Feedback", "Recieved"],
      //     ["Excellent", data.filter((item) => item.ClientExperience == 5).length],
      //     ["Better", data.filter((item) => item.ClientExperience == 4).length],
      //     ["Good", data.filter((item) => item.ClientExperience == 3).length],
      //     ["Average", data.filter((item) => item.ClientExperience == 2).length],
      //     ["Poor", data.filter((item) => item.ClientExperience == 1).length],
      //   ],
      //   options: { title: "Client Experience", pieHole: 0.4 },
      // };

      this.ipd6 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd55],
          ["Better", ipd54],
          ["Good", ipd53],
          ["Average", ipd52],
          ["Poor", ipd5o],
        ],
        options: { title: "Cost Vs Service", pieHole: 0.4 },
      };

      this.ipd7 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd65],
          ["Better", ipd64],
          ["Good", ipd63],
          ["Average", ipd62],
          ["Poor", ipd6o],
        ],
        options: { title: "Discharge Process", pieHole: 0.4 },
      };

      this.ipd8 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd75],
          ["Better", ipd74],
          ["Good", ipd73],
          ["Average", ipd72],
          ["Poor", ipd7o],
        ],
        options: { title: "Food Service", pieHole: 0.4 },
      };

      this.ipd9 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd85],
          ["Better", ipd84],
          ["Good", ipd83],
          ["Average", ipd82],
          ["Poor", ipd8o],
        ],
        options: { title: "General Comfort and Cleanliness", pieHole: 0.4 },
      };

      this.ipd10 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd95],
          ["Better", ipd94],
          ["Good", ipd93],
          ["Average", ipd92],
          ["Poor", ipd9o],
        ],
        options: { title: "Laboratory Service", pieHole: 0.4 },
      };

      this.ipd11 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd105],
          ["Better", ipd104],
          ["Good", ipd103],
          ["Average", ipd102],
          ["Poor", ipd10o],
        ],
        options: { title: "Pharmacy Service", pieHole: 0.4 },
      };

      this.ipd12 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd115],
          ["Better", ipd114],
          ["Good", ipd113],
          ["Average", ipd112],
          ["Poor", ipd11o],
        ],
        options: { title: "Reception", pieHole: 0.4 },
      };

      this.ipd13 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd125],
          ["Better", ipd124],
          ["Good", ipd123],
          ["Average", ipd122],
          ["Poor", ipd12o],
        ],
        options: { title: "Room Service Facilities", pieHole: 0.4 },
      };

      this.ipd14 = {
        chartType: "PieChart",
        dataTable: [
          ["Feedback", "Recieved"],
          ["Excellent", ipd135],
          ["Better", ipd134],
          ["Good", ipd133],
          ["Average", ipd132],
          ["Poor", ipd13o],
        ],
        options: { title: "StaffCourtesy", pieHole: 0.4 },
      };
    } else {
      this.emailtemplateipd = `<table border="1">
<thead>
<tr>
<th>IPD Data</th>
<th>Excellent</th>
<th>Better</th>
<th>Good</th>
<th>Average</th>
<th>Poor</th>
</tr>
</thead>
<tbody>
<tr>
<td>1. Reception</td>
<td>${ipd115}</td>
<td>${ipd114}</td>
<td>${ipd113}</td>
<td>${ipd112}</td>
<td>${ipd11o}</td>
</tr>
<tr>
<td>2. Staff Courtesy</td>
<td>${ipd135}</td>
<td>${ipd134}</td>
<td>${ipd133}</td>
<td>${ipd132}</td>
<td>${ipd13o}</td>
</tr>
<tr>
<td>3. Ability to answer your Queries</td>
<td>${ipd15}</td>
<td>${ipd14}</td>
<td>${ipd13}</td>
<td>${ipd12}</td>
<td>${ipd1o}</td>
</tr>
<tr>
<td>4. General Comfort & Cleanliness</td>
<td>${ipd85}</td>
<td>${ipd84}</td>
<td>${ipd83}</td>
<td>${ipd82}</td>
<td>${ipd8o}</td>
</tr>

<tr>
<td>5. Laboratory Service</td>
<td>${ipd95}</td>
<td>${ipd94}</td>
<td>${ipd93}</td>
<td>${ipd92}</td>
<td>${ipd9o}</td>
</tr>
<tr>
<td>6. Pharmacy Service</td>
<td>${ipd105}</td>
<td>${ipd104}</td>
<td>${ipd103}</td>
<td>${ipd102}</td>
<td>${ipd10o}</td>
</tr>
<tr>
<td>7. Food Service</td>
<td>${ipd75}</td>
<td>${ipd74}</td>
<td>${ipd73}</td>
<td>${ipd72}</td>
<td>${ipd7o}</td>
</tr>
<tr>
<td>8. Admission Process</td>
<td>${ipd25}</td>
<td>${ipd24}</td>
<td>${ipd23}</td>
<td>${ipd22}</td>
<td>${ipd2o}</td>
</tr>
<tr>
<td>9. Discharge Process</td>
<td>${ipd65}</td>
<td>${ipd64}</td>
<td>${ipd63}</td>
<td>${ipd62}</td>
<td>${ipd6o}</td>
</tr>
<tr>
<td>10. Room Service & Facilities</td>
<td>${ipd125}</td>
<td>${ipd124}</td>
<td>${ipd123}</td>
<td>${ipd122}</td>
<td>${ipd12o}</td>
</tr>
<tr>
<td>11. Cost Vs Service</td>
<td>${ipd55}</td>
<td>${ipd54}</td>
<td>${ipd53}</td>
<td>${ipd52}</td>
<td>${ipd5o}</td>
</tr>
<tr>
<td>12. Care by Doctors</td>
<td>${ipd35}</td>
<td>${ipd34}</td>
<td>${ipd33}</td>
<td>${ipd32}</td>
<td>${ipd3o}</td>
</tr>
<tr>
<td>13. Care by Nurses</td>
<td>${ipd45}</td>
<td>${ipd44}</td>
<td>${ipd43}</td>
<td>${ipd42}</td>
<td>${ipd4o}</td>
</tr>
</tbody>
</table>
`;

      this.alertService.clear();
      let obj = {
        mes: this.maintemplate + this.emailtemplateopd + this.emailtemplateipd,
        email: this.reportSendForm.value.email,
      };
      this.userService
        .SendReport(obj)
        .pipe(first())
        .subscribe(
          (data) => {
            this.alertService.success("Report sent Successfully...");
            this.reportSendForm.reset();
          },
          (error) => {
            this.alertService.error(error);
          }
        );
    }
  }
}
