import {
    Injectable
} from '@angular/core';

import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, Directive, ChangeDetectorRef } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { FormBuilder } from "@angular/forms";
import { ScriptLoaderService } from '../_services/script-loader.service';
import { Helpers } from '../helpers';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from "@angular/router";
import {
    ApplicationApiService
} from '../_services/api.service';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
@Component({
    selector: 'app-fundmanager',
    templateUrl: './template/addfund.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class FundmanagerComponent implements OnInit, AfterViewInit {

    amount: any = 0;
    handler: any;
    Percent: any = 3.4;
    Fixed: any = 0.50;

    fees: any = {
        USD: { Percent: 2.9, Fixed: 0.30 },
        GBP: { Percent: 2.4, Fixed: 0.20 },
        EUR: { Percent: 2.4, Fixed: 0.24 },
        CAD: { Percent: 2.9, Fixed: 0.30 },
        AUD: { Percent: 2.9, Fixed: 0.30 },
        NOK: { Percent: 2.9, Fixed: 2 },
        DKK: { Percent: 2.9, Fixed: 1.8 },
        SEK: { Percent: 2.9, Fixed: 1.8 },
        JPY: { Percent: 3.6, Fixed: 0 },
        MXN: { Percent: 3.6, Fixed: 3 }
    };

    private stripeCheckoutHandler: StripeCheckoutHandler;
    constructor(private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private http: Http,
        private _apis: ApplicationApiService,
        private cd: ChangeDetectorRef,
        private toastr: ToastrService,
        private router: Router,
        private stripeCheckoutLoader: StripeCheckoutLoader
    ) {

    }

    ngOnInit() {
        //this._script.loadScripts('head',['https://checkout.stripe.com/checkout.js']);

  	/*this.handler = StripeCheckout.configure({
      key: "pk_test_DczdBlXcTo4t9zlsbG7S5ayh",
      locale: 'auto',
      token: token => {
        //this.paymentSvc.processPayment(token, this.amount)
      }
    });*/
    }

    ngAfterViewInit() {
        this.stripeCheckoutLoader.createHandler({
            key: 'pk_test_STV6nHHzFdlHVQ9SZFel04lM',
            token: (token) => {
                this._apis.sendPayment(token.id, this.amount, token.email, this.amount).subscribe(
                    data => {
                        if (data.status == "success") {
                            this.toastr.success("Payment process sucessfully completed", 'Success');
                            setTimeout(() => {
                                this.router.navigate(['/invoice/' + data.adz_tid]);
                            }, 3000);  //5s
                        } else {

                            let str: any = '';
                            let errorList = data.errors;
                            for (let i in errorList) {
                                str += errorList[i] + "<br>";
                            }
                            this.toastr.error(str, 'Error');
                        }
                    },

                    error => {

                    }
                );
            },
        }).then((handler: StripeCheckoutHandler) => {
            this.stripeCheckoutHandler = handler;
        });
    }


    addFee(amount) {
        let _fee = this.fees["USD"];
        let amnt = parseFloat(amount);
        let total = (amnt + parseFloat(_fee.Fixed)) / (1 - parseFloat(_fee.Percent) / 100);
        let fee = total - amnt;
        return total * 100;
    }

    handlePayment() {
        this.stripeCheckoutHandler.open({
            name: 'MobileAdz Pte. Ltd',
            description: 'Advertiser Payment',
            amount: (this.addFee(this.amount)),
            currency: 'usd',
            zipCode: false,
            locale: "auto"
        });
    }

    updateAmount(amt) {
        this.amount = amt;
    }

}
