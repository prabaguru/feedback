import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ValidateEqualModule } from "ng-validate-equal";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { appRoutingModule } from "./app.routing";
import { JwtInterceptor, ErrorInterceptor } from "./_helpers";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { editUserComponent } from "./register/edit";
import { UserRegisterComponent } from "./userregister";
import { customerComponent } from "./customer";
import { opdFBComponent } from "./opdfeedback";
import { ipdFBComponent } from "./ipdfeedback";
import { AlertComponent } from "./_components";
import { HistoryComponent } from "./history";
import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { LoaderComponent } from "./loader/loader.component";
import { performanceComponent } from "./performance/performance.component";
import { notificationsComponent } from "./notifications/notifications.component";
import { addComponent } from "./notifications/add/add.component";
import { editComponent } from "./notifications/edit/edit.component";

/* services */
import { LoaderInterceptorService } from "./_services/loader-interceptor.service";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    appRoutingModule,
    AngularFontAwesomeModule,
    ValidateEqualModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    Ng2GoogleChartsModule,
    CKEditorModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    editUserComponent,
    UserRegisterComponent,
    customerComponent,
    opdFBComponent,
    ipdFBComponent,
    AlertComponent,
    HistoryComponent,
    LoaderComponent,
    performanceComponent,
    notificationsComponent,
    addComponent,
    editComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
