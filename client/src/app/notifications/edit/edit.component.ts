﻿import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";

import {
  AlertService,
  UserService,
  AuthenticationService,
  sharedDataService,
} from "@/_services";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { EDITORCONFIG } from "../editor-config";
@Component({
  templateUrl: "edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class editComponent implements OnInit {
  editForm: FormGroup;
  loading = false;
  submitted = false;
  public Editor = ClassicEditor;
  config = EDITORCONFIG;
  editData: any;
  constructor(
    private formBuilder: FormBuilder,
    private shareData: sharedDataService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.alertService.clear();
    this.editData = this.shareData.getData("editdata");
    console.log(this.editData);
    this.editForm = this.formBuilder.group({
      templatename: [this.editData.templatename, Validators.required],
      content: [this.editData.content, Validators.required],
      id: [this.editData._id, []],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editForm.controls;
  }

  onSubmit(event): void {
    this.submitted = true;
    //console.log(this.editForm.value);

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .updateNotifications(this.editForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Updated successfully", true);
          this.router.navigate(["/notifications"]);
          this.loading = false;
          this.resetForm();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  resetForm() {
    this.submitted = false;
    this.editForm.reset();
  }
}
