import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Injectable
} from '@angular/core';

import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, Directive, ChangeDetectorRef } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { FormBuilder } from "@angular/forms";
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

import { ToastrService } from 'ngx-toastr';

import {
    ApplicationApiService
} from '../../../../_services/api.service';

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {


    oldPassword: string = '123';
    newPassword: string = '1234';
    confirmPassword: string = '1234';
    loading: any = false;

    constructor(
        private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private http: Http,
        private _apis: ApplicationApiService,
        private cd: ChangeDetectorRef,
        private toastr: ToastrService
    ) {

    }
    ngOnInit() {

    }

    updatePassword() {

        let errorStr = '';
        let flag = 0;
        if (this.oldPassword == '' || this.oldPassword == null) {
            errorStr += "Please enter old password <br>"
            flag = 1;
        }
        if (this.newPassword == '' || this.newPassword == null) {
            errorStr += "Please enter new password <br>";
            flag = 1;
        }
        if (this.confirmPassword == '' || this.confirmPassword == null) {
            errorStr += "Please enter confirm password <br>";
            flag = 1;
        }

        if (this.confirmPassword != this.newPassword) {
            errorStr += "New password and confirm password does not match <br>";
            flag = 1;
        }

        if (flag == 1) {
            this.toastr.error(errorStr, 'Error');
            return false;
        } else {
            this.loading = true;
            var obj = {
                "old_password": this.oldPassword,
                "new_password": this.newPassword,
                "new_password_confirmation": this.confirmPassword,
            }

            this._apis.changePassword(obj).subscribe(
                data => {
                    if (data.success == true) {
                        this.toastr.success("Your password updated successfully", 'Success');
                    } else {
                        let str: any = '';
                        let errorList = data.error;
                        for (let i in errorList) {
                            str += errorList[i] + "<br>";
                        }
                        this.toastr.error(str, 'Error');

                    }
                    this.loading = false;
                },
                error => {
                    if (error.status == 401) {
                        this.toastr.error("Please enter all passwords correctly", 'Error');
                        this.loading = false;
                    }
                }


            );
        }
    }

}