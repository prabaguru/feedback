import { Injectable } from "@angular/core";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@environments/environment";
import { User } from "@/_models";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  //notifications

  sendSms(data: any) {
    return this.http.post(`${environment.apiUrl}/performance/sendSMS`, data);
  }

  createNotifications(payload) {
    return this.http.post(
      `${environment.apiUrl}/notifications/create`,
      payload
    );
  }
  updateNotifications(payload) {
    return this.http.put(`${environment.apiUrl}/notifications/update`, payload);
  }
  getAllNotificationsById(searchParams) {
    const options = { params: new HttpParams({ fromString: searchParams }) };
    return this.http.get(
      `${environment.apiUrl}/notifications/getNotificationsById`,
      options
    );
  }

  getNotificationById(searchParams: string) {
    const params = new HttpParams().append("id", searchParams);
    return this.http.get(`${environment.apiUrl}/notifications/getById`, {
      params,
    });
  }

  getAllNotificationsByIdNoJwt(searchParams: string) {
    const params = new HttpParams().append("id", searchParams);
    return this.http.get(
      `${environment.apiUrl}/notifications/getNotificationsByIdNoJwt`,
      {
        params,
      }
    );
  }

  //registerForNotifications
  createRegNotifications(payload) {
    return this.http.post(
      `${environment.apiUrl}/regnotifications/create`,
      payload
    );
  }

  getRegNotificationById(searchParams: string) {
    const params = new HttpParams().append("id", searchParams);
    return this.http.get(`${environment.apiUrl}/regnotifications/getById`, {
      params,
    });
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  CallWAppMBird(user: User) {
    return this.http.post(`${environment.apiUrl}/users/callWhataapmB`, user);
  }

  getAllByIdWeis(searchParams: string) {
    //const headers = new HttpHeaders().append('header', 'value');
    const params = new HttpParams().append("id", searchParams);
    return this.http.get(`${environment.apiUrl}/users/getByIdWeis`, { params });
  }

  getAllById(searchParams) {
    const options = { params: new HttpParams({ fromString: searchParams }) };
    return this.http.get<User[]>(
      `${environment.apiUrl}/users/getById`,
      options
    );
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  SendReport(mes) {
    return this.http.put(`${environment.apiUrl}/users/Sendreport`, mes);
  }

  update(user) {
    return this.http.put(`${environment.apiUrl}/users/update`, user);
  }

  updateSingle(id) {
    return this.http.put(`${environment.apiUrl}/users/sdelete`, { id: id });
  }

  updateAllStatus(id, flag) {
    return this.http.put(`${environment.apiUrl}/users/updateAllStatus`, {
      id: id,
      flag: flag,
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
  sendSMSandRegister(param) {
    return this.http.post(
      `${environment.apiUrl}/customers/registerCustomers`,
      param
    );
  }
  sendSMS(param) {
    return this.http.post(`${environment.apiUrl}/sendsms/sendsms`, param);
  }
  opdFeedBack(param) {
    return this.http.post(`${environment.apiUrl}/opd/opdFeedback`, param);
  }
  getAllByOpdFbk(searchParams: string) {
    const params = new HttpParams().append("id", searchParams);
    return this.http.get(`${environment.apiUrl}/opd/getById`, { params });
  }
  ipdFeedBack(param) {
    return this.http.post(`${environment.apiUrl}/ipd/ipdFeedback`, param);
  }
  getAllByIpdFbk(searchParams: string) {
    const params = new HttpParams().append("id", searchParams);
    return this.http.get(`${environment.apiUrl}/ipd/getById`, { params });
  }

  APPerformance(params) {
    return this.http.post(
      `${environment.apiUrl}/performance/appPerformance`,
      params
    );
  }

  GetAllAPPerformance() {
    return this.http.get(
      `${environment.apiUrl}/performance/getAllappPerformance`
    );
  }
}
