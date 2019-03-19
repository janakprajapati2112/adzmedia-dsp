import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { LoginCustom } from './_helpers/login-custom';
import { Helpers } from '../helpers';

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    model: any = {};
    loading = false;
    errors = [];
    returnUrl: string;

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.model.remember = true;
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/demo2/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
    }

    signin() {
        this.loading = true;
        this.errors = [];
        this._authService.login(this.model.email, this.model.password).subscribe(

            data => {
                if (data.success == true) {
                    this._router.navigate([this.returnUrl]);
                }
                else {

                    let str: any = '';
                    let errorList = data.errors;
                    let errorMsg = [];
                    for (let i in errorList) {
                        errorMsg.push(errorList[i][0])
                    }
                    this.showAlert('alertSignin');
                    this._alertService.error(errorMsg);
                    this.loading = false;
                }

            },
            error => {
                this.showAlert('alertSignin');
                let errorList = JSON.parse(error._body);
                let errorMsg = [];
                for (let i in errorList.errors) {
                    errorMsg.push(errorList.errors[i])
                }
                this._alertService.error(errorMsg);
                this.loading = false;
            });
    }

    signup() {
        this.loading = true;
        this._userService.create(this.model).subscribe(
            data => {
                if (data.success == true) {
                    this.showAlert('alertSignin');
                    this._alertService.success([
                        'You are successfully registerd with us we will contact you'],
                        true);
                    this.loading = false;
                    LoginCustom.displaySignInForm();
                    this.model = {};
                }
                else {

                    let str: any = '';
                    let errorList = data.errors;
                    let errorMsg = [];
                    for (let i in errorList) {
                        errorMsg.push(errorList[i])
                    }

                    this.showAlert('alertSignup');
                    this._alertService.error(errorMsg);
                    this.loading = false;
                }
            },
            error => {
                this.showAlert('alertSignup');
                let errorList = JSON.parse(error._body);

                let errorMsg = [];
                for (let i in errorList.errors) {
                    errorMsg.push(errorList.errors[i])
                }
                this._alertService.error(errorMsg);
                this.loading = false;
            });
    }

    forgotPass() {
        this.loading = true;
        this._userService.forgotPassword(this.model.email).subscribe(
            data => {


                this.showAlert('alertSignin');
                this._alertService.success(
                    ['Cool! Password recovery instruction has been sent to your email.'],
                    true);
                this.loading = false;
                LoginCustom.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertForgotPass');
                let errorList = JSON.parse(error._body);

                let errorMsg = [];
                for (let i in errorList.errors) {
                    errorMsg.push(errorList.errors[i])
                }
                this._alertService.error(errorMsg);
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}