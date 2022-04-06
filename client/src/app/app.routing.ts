import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { editUserComponent } from "./register/edit";
import { UserRegisterComponent } from "./userregister";
import { customerComponent } from "./customer";
import { opdFBComponent } from "./opdfeedback";
import { ipdFBComponent } from "./ipdfeedback";
import { AuthGuard } from "./_helpers";
import { HistoryComponent } from "./history";
import { performanceComponent } from "./performance";
import { notificationsComponent } from "./notifications";
const routes: Routes = [
  { path: "", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "updateUser",
    component: editUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "userregister",
    component: UserRegisterComponent,
    canActivate: [AuthGuard],
  },
  { path: "sendsms", component: customerComponent, canActivate: [AuthGuard] },
  {
    path: "notifications",
    component: notificationsComponent,
    canActivate: [AuthGuard],
  },
  { path: "opdfeedback", component: opdFBComponent },
  { path: "ipdfeedback", component: ipdFBComponent },
  { path: "history", component: HistoryComponent },
  { path: "performance", component: performanceComponent },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

export const appRoutingModule = RouterModule.forRoot(routes, { useHash: true });
