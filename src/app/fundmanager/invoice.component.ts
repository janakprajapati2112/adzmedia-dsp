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
import { Router, ActivatedRoute } from "@angular/router";
import {
    ApplicationApiService
} from '../_services/api.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './template/invoice.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class InvoiceComponent implements OnInit, AfterViewInit {

    amount: any = 0;
    handler: any;
    Percent: any = 3.4;
    Fixed: any = 0.50;

    email: any;
    trId: any;
    status: any;
    time: any;
    trFee: any;
    total: any;



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


    constructor(private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private http: Http,
        private _apis: ApplicationApiService,
        private cd: ChangeDetectorRef,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute


    ) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        let id = this.activatedRoute.snapshot.params['id'];
        this._apis.getInvoice(id).subscribe(
            res => {
                if (res.status == 1200) {

                    this.amount = res.data.amount;
                    this.email = res.data.email;
                    this.trId = res.data.tran_id;
                    this.time = res.data.time;
                    this.trFee = res.data.transactionFee;
                    this.total = res.data.total;

                } else {

                    let str: any = '';
                    let errorList = res.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.toastr.error(str, 'Error');
                }
            },

            error => {

            }
        );

    }
    addFee(amount) {
        let _fee = this.fees["USD"];
        let amnt = parseFloat(amount);
        let total = (amnt + parseFloat(_fee.Fixed)) / (1 - parseFloat(_fee.Percent) / 100);
        let fee = total - amnt;
        return total * 100;
    }
}
