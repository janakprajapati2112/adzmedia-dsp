import {
    Injectable
} from '@angular/core';
import { Router } from "@angular/router";
import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, Directive, ChangeDetectorRef } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { FormBuilder } from "@angular/forms";
import { ScriptLoaderService } from '../_services/script-loader.service';
import { Helpers } from '../helpers';
import { ToastrService } from 'ngx-toastr';

import {
    ApplicationApiService
} from '../_services/api.service';

import * as moment from 'moment';
import { DaterangepickerComponent, DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as Highcharts from 'highcharts';
import swal from 'sweetalert2';

@Component({
    selector: 'app-dashboard',
    templateUrl: './template/dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    datasource: Campaigns[];
    campaigns: Campaigns[];
    totalRecords: number;
    cols: any[];
    model: any = {};
    loading: any = false;
    statusOptions: any = [];
    selectedStatus: any = [];

    service: any;
    reportLoading: boolean = false;
    currentGraphSelection: string = "impressions";

    start: number = 0;
    limit: number = 25;
    sortBy: string = "id";
    sortOrder: any = -1;

    impressions: number = 0;
    conversions: number = 0;
    cost: number = 0;
    wins: number = 0;
    rev_payout: number = 0;
    bids: number = 0;



    selectedDate: any = {
        endDate: moment(),
        startDate: moment()
    };
    showRangeLabelOnInput: boolean = true;
    alwaysShowCalendars: boolean = true;
    keepCalendarOpeningWithRange: boolean = true;
    ranges: any = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
    invalidDates: moment.Moment[] = [];

    isInvalidDate = (m: moment.Moment) => {
        return this.invalidDates.some(d => d.isSame(m, 'day'))
    }


    // chart

    Highcharts = Highcharts; // required
    chartConstructor = 'chart'; // optional string, defaults to 'chart'
    chartOptions = {
        chart: {
            type: "spline"
        },
        title: {
            text: "Impressions"
        },

        plotOptions: {
            area: {
                fillColor: "rgba(92, 205, 222,0.2)",
                lineColor: "#5ccdde",

            },
            series: {
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 1,
                    lineColor: null // inherit from series
                },
                fillOpacity: 0.5
            }
        },

        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Time'
            }

        },
        yAxis: {
            title: {
                text: "Impression"
            },

        },

        tooltip: {
            enabled: true
        },

        series: [{
            name: "Impressions",
            data: [],
            type: "spline"
        }]
    };


    constructor(
        private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private http: Http,
        private _apis: ApplicationApiService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this._apis.verify().subscribe(
            data => {
                if (data.status != 1200) {
                    swal({
                        position: 'center',
                        type: 'error',
                        title: 'Your session is expired please login again to continue',
                        showConfirmButton: false,
                        timer: 1500,
                        onClose: () => {
                            this.router.navigate(['/logout'])
                        }
                    });
                }
            }

        );
        this.statusOptions = [
            { id: '999', text: 'All' },
            { id: '2', text: 'Under Review' },
            { id: '1', text: 'Active' },
            { id: '4', text: 'Paused' },
            { id: '0', text: 'Disabled' }
        ];

        this.selectedStatus = {
            id: '1',
            text: 'Active'
        };

        this.updateGraph(this.currentGraphSelection);
        this.cd.detectChanges();
    }

    ngAfterViewInit() {
        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default reports-page');

        this.cd.detectChanges();
    }

    loadCampaigns() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        let data = {
            start: this.start,
            limit: this.limit,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            status: this.selectedStatus.id
        };
        this.loading = true;
        this._apis.loadCampaignList(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.datasource = data.response.data;
                    this.campaigns = this.datasource;
                    this.totalRecords = data.response.total;
                    this.loading = false;
                }
                else {
                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    // this.toastr.error(str, 'Error');
                    this.loading = false;
                }
                this.loading = false;

            },

            error => {

            }
        );
    }


    loadCampaignsLazy(event: LazyLoadEvent) {
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
            sortBy = "id";
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
        this._apis.loadCampaignList(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.datasource = data.response.data;
                    this.campaigns = this.datasource;
                    this.totalRecords = data.response.total;
                    this.loading = false;
                }
                else {
                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    // this.toastr.error(str, 'Error');
                    this.loading = false;
                }
                this.loading = false;

            },

            error => {

            }

        );
    }

    updateCampaignTable(status) {
        this.selectedStatus = status;
        this.loadCampaigns();
    }

    updateGraph(t) {

        this.currentGraphSelection = t;
        var apiFilters: any = [{}];

        this.reportLoading = true;
        this._apis.getReportGraph(t, apiFilters[0], this.selectedDate).subscribe(response => {
            if (response.status == 1200) {
                this.impressions = response.total.impressions;
                this.conversions = response.total.conversions;
                this.cost = response.total.spend;
                this.bids = response.total.bids;
                this.wins = response.total.wins;
                this.chartOptions = {
                    chart: {
                        type: "spline"
                    },
                    title: {
                        text: t.toUpperCase()
                    },

                    plotOptions: {
                        area: {
                            fillColor: "rgba(92, 205, 222,0.2)",
                            lineColor: "#5ccdde",

                        },
                        series: {
                            marker: {
                                fillColor: '#FFFFFF',
                                lineWidth: 1,
                                lineColor: null // inherit from series
                            },
                            fillOpacity: 0.5
                        }
                    },

                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%e. %b',
                            year: '%b'
                        },
                        title: {
                            text: 'Time'
                        }

                    },
                    yAxis: {
                        title: {
                            text: t
                        },

                    },

                    tooltip: {
                        enabled: true
                    },

                    series: [{
                        name: t,
                        data: response.data,
                        type: "spline"
                    }]
                };

                this.reportLoading = false;
            }
        });


    }

    updateCampaignStatus(s, c) {
        let obj = {
            cid: c,
            status: s
        };
        this.loading = true;
        this._apis.updateCampaign(obj).subscribe(
            data => {
                if (data.status == 1200) {
                    if (s == 0) {
                        this.toastr.success("Campaign deleted successfully", 'Success');
                    } else {
                        this.toastr.success("Campaign status updated successfully", 'Success');
                    }

                    this.loading = false;
                    this.loadCampaigns();
                }

                else {
                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.toastr.error(str, 'Error');
                    this.loadCampaigns();
                    this.loading = false;
                }
            }
        );


    }

    cloneCampaign(c) {
        let obj = {
            cid: c
        };
        this.loading = true;
        this._apis.cloneCampaign(obj).subscribe(
            data => {
                if (data.status == 1200) {
                    this.loading = false;
                    this.toastr.success(data.message, "success");
                    this.router.navigate(['/edit-campaign', data.campaign_id]);

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
            }
        );


    }

    convertToDecimals(input, decimals) {
        var exp, rounded,
            suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];


        if (input < 1000) {
            return parseFloat(input).toFixed(2);;
        }

        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
    }


}

export interface Campaigns {
    id?;
    name?;
    totalbudget?;
    dailtybudget?;
    dailyspend?;
    bid?;
    status?;
    createdtime?;
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
