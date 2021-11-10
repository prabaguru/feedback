import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class sharedDataService {
private sharedDataInfo: any = {};

constructor() {
}


setData(typeofData: any, value: any) {
this.sharedDataInfo[typeofData] = value;
}

getData(key: any) {
return this.sharedDataInfo[key];
}
deleteData(key: any) {
delete this.sharedDataInfo[key];
}
}