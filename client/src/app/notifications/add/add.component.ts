import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { first } from "rxjs/operators";

import { AlertService, UserService, AuthenticationService } from "@/_services";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  templateUrl: "add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class addComponent implements OnInit {
  addForm: FormGroup;
  loading = false;
  submitted = false;
  public Editor = ClassicEditor;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.alertService.clear();
    this.addForm = this.formBuilder.group({
      templatename: ["", Validators.required],
      content: ["", Validators.required],
      hospital_id: [this.authenticationService.currentUserValue._id, []],
      hospital_name: [
        this.authenticationService.currentUserValue.firstName,
        [],
      ],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addForm.controls;
  }

  onSubmit(event): void {
    this.submitted = true;
    //console.log(this.addForm.value);

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .createNotifications(this.addForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Created successfully", true);
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
    this.addForm.reset();
  }
  onReady(eventData) {
    eventData.plugins.get("FileRepository").createUploadAdapter = function (
      loader
    ) {
      // console.log("loader : ", loader);
      // console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }
}

export class UploadAdapter {
  private loader;
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          var myReader = new FileReader();
          myReader.onloadend = (e) => {
            resolve({ default: myReader.result });
          };

          myReader.readAsDataURL(file);
        })
    );
  }
}
