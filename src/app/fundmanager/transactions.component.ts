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

@Component({
    selector: 'app-transactions',
    templateUrl: './template/view-transaction.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TransactionsComponent implements OnInit, AfterViewInit {

    datasource: Transactions[];
    transactions: Transactions[];
    totalRecords: number;
    cols: any[];
    model: any = {};
    loading: any = false;
    statusOptions: any = [];
    selectedStatus: any = [];

    start: number = 0;
    limit: number = 25;
    sortBy: string = "id";
    sortOrder: any = -1;


    constructor(private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private http: Http,
        private _apis: ApplicationApiService,
        private cd: ChangeDetectorRef,
        private toastr: ToastrService,
        private router: Router
    ) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default reports-page');

        this.cd.detectChanges();
    }

    loadTransactionsLazy(event: LazyLoadEvent) {
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        this.loading = true;
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let sortBy;
        let sortOrder;

        if (!event.sortField) {
            sortBy = "time";
            sortOrder = -1
        } else {
            sortBy = event.sortField,
                sortOrder = event.sortOrder
        }

        let data = {
            start: event.first,
            limit: event.rows,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: event.globalFilter,
            status: this.selectedStatus.id

        };

        this.start = event.first;
        this.limit = event.rows;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;

        this._apis.loadTransactionList(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.datasource = data.response.data;
                    this.transactions = this.datasource;
                    this.totalRecords = data.response.total;
                    this.loading = false;
                }
                else {
                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.toastr.error(str, 'Error');
                    this.loading = false;
                }
                this.loading = false;

            },

            error => {

            }

        );
    }


}
export interface Transactions {
    id?;
    status?;
    amount?;
    time?;
}

export interface SortMeta {
    field: string;
    order: number;
}
export interface FilterMetadata {
    value?: any;
    matchMode?: string;
}
export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: { [s: string]: FilterMetadata; };
    globalFilter?: any;
}