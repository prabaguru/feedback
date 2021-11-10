import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '@/_models';
import {AlertService, UserService, AuthenticationService } from '@/_services';
import * as $ from 'jquery';
import { GoogleChartInterface } from 'ng2-google-charts';
@Component({ templateUrl: 'Performance.component.html' })
export class performanceComponent implements OnInit {
currentUser: User;
appfeedbackdata:any=[];
ChartFlag:boolean=false;
chartRowCount;
public pieChart: GoogleChartInterface;
    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
this.alertService.clear();
    }

    ngOnInit() {
 this.getFeedbackapp();
        
    }



getChart(){
    let data = this.appfeedbackdata;
    this.chartRowCount = this.appfeedbackdata.length;
    if(this.chartRowCount>0){
     this.ChartFlag=true;
        this.pieChart = {
  chartType: 'PieChart',
  dataTable: [
    ['Feedback', 'Recieved'],
    ['Excellent',data.filter(item => item.rating == 1).length],
['Better',   data.filter(item => item.rating == 2).length],
['Good',     data.filter(item => item.rating == 3).length],
['Average',  data.filter(item => item.rating == 4).length],
['Poor',     data.filter(item => item.rating == 5).length]
  ],
  options: {width: 500, pieHole:0.4,'title': 'App Performance Feedback',pieSliceText: 'value'},
};
}
}


getFeedbackapp(){
    this.appfeedbackdata=null;
this.alertService.clear();
this.userService.GetAllAPPerformance()
    .pipe(first())
    .subscribe(data => {
        this.appfeedbackdata = data;
        this.getChart();
    },
    error => {
        this.alertService.error(error);
    });
}


}

