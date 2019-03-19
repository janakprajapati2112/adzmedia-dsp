import {
    Injectable,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Renderer2,
    Inject,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { Router } from "@angular/router";
import {
    Subject
} from 'rxjs';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    Input,
    Output,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    Directive
} from '@angular/core';
import {
    ModalDismissReasons,
    NgbDateStruct,
    NgbModal,
    NgbRatingConfig
} from "@ng-bootstrap/ng-bootstrap";
import {
    distinctUntilChanged,
    debounceTime,
    switchMap,
    tap
} from 'rxjs/operators'
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
    Http,
    RequestMethod,
    RequestOptions,
    Response,
    ResponseOptions,
    XHRBackend,
    Headers
} from "@angular/http";
import {
    ActivatedRoute
} from '@angular/router';
import {
    ScriptLoaderService
} from '../_services/script-loader.service';
import {
    ConfigService
} from '../_services/config.service';
import {
    ApplicationApiService
} from '../_services/api.service';
import {
    ToastrService
} from 'ngx-toastr';
import {
    Helpers
} from '../helpers';
import swal from 'sweetalert2';
import {
    Service
} from './service';

import * as moment from 'moment';
import { DaterangepickerComponent, DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-reports',
    templateUrl: './template/reports.component.html',
    encapsulation: ViewEncapsulation.None,

    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({ transform: 'translateY(100%)', opacity: 0 }),
                    animate('200ms', style({ transform: 'translateY(0)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'translateY(0)', opacity: 1 }),
                    animate('200ms', style({ transform: 'translateY(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})

@Injectable()

export class ReportsComponent implements OnInit, AfterViewInit {

    filterSelection: any = false;
    dimentionSelection: any = false;
    splitSelection: any = false;
    dValueSelection: any = false;
    filterDimentions: any = [];
    selectedDimentions: any = [];
    filterDimentionsValues: any = [];
    currentSelectedDimension: any = [];
    appLoading: any = false;
    query: any = '';
    q: any = '';
    sFilters: any = [];
    splitOpt: any = [];
    posX: any = 100;
    posY: any = 100;
    reportData: any = [];
    service: any;
    reportLoading: boolean = false;
    currentGraphSelection: string = "impressions";
    totalImpressions: any = 0;
    totalConversions: any = 0;
    totalBids: any = 0;
    totalWins: any = 0;
    totalSpend: any = 0;
    start: any;
    end: any;
    selectedDate: any = {
        startDate: moment(),
        endDate: moment()
    };

    maxDate: any = moment().format('MM-DD-YYYY')
    customRanges: any = [
        {
            text: 'Today', desc: 'Today', value: 'today',
            start: moment(),
            end: moment(),
            default: true
        },
        {
            text: 'Yesterday', desc: 'Yesterday', value: 'yesterday',
            start: moment().subtract(1, 'days'),
            end: moment().subtract(1, 'days'),
            default: true
        },
        {
            text: 'This month', desc: 'This month', value: 'thismonth',
            start: moment().startOf('month'),
            end: moment(),
            default: true
        },
        {
            text: 'Last Month', desc: 'Last Month', value: 'lastmonth',
            start: moment().subtract(1, 'month').startOf('month'),
            end: moment().subtract(1, 'month').endOf('month'),
        },
        {
            text: 'Last 3 Months', desc: 'Last 3 Months', value: 'lastmonth3',
            start: moment().subtract(3, 'month').startOf('month'),
            end: moment().subtract(1, 'month').endOf('month')
        },
        {
            text: 'Last 6 Months', desc: 'Last 6 Months', value: 'lastmonth6',
            start: moment().subtract(6, 'month').startOf('month'),
            end: moment().subtract(1, 'month').endOf('month')
        },
        {
            text: 'This Year', desc: 'This Year', value: 'thisyear',
            start: moment().startOf('year'),
            end: moment()
        },

    ];



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

    @ViewChild(DaterangepickerDirective) pickerDirective: DaterangepickerDirective;
    picker: DaterangepickerComponent;



    @ViewChildren('dynamic', {
        read: ViewContainerRef
    }) viewContainerRef: QueryList<ViewContainerRef>

    constructor(
        private _script: ScriptLoaderService,
        private _apis: ApplicationApiService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private toastr: ToastrService,
        private _configService: ConfigService,
        private http: Http,
        private cd: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        @Inject(Service) service,
    ) {
        this.service = service
    }

    ngOnInit() {

        this.start = moment().format('MM-DD-YYYY');
        this.end = moment().format('MM-DD-YYYY');
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
                } else {
                    this.selectSplitDimention({ id: "name", text: "Campaign Name" })
                }
            }

        );

    }

    ngAfterViewInit() {
        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default reports-page');
        this._apis.getReportDimensions().subscribe(response => {
            if (response.status == 1200) {
                this.filterDimentions = response.data;

            }
        });
        //    // this.updateGraph(this.currentGraphSelection);
        this.cd.detectChanges();
    }

    openFilterSelection(e) {
        var xPos;
        if (e.clientX > 1024) {
            xPos = e.clientX - 250;
        } else {
            xPos = e.clientX
        }
        this.posX = xPos - 10 + "px";
        this.posY = e.clientY + 10 + "px";

        this.filterSelection = true
        this.dimentionSelection = true;
        this.dValueSelection = false;

    }

    openSplitSelection(e) {
        var xPos;
        if (e.clientX > 1024) {
            xPos = e.clientX - 250;
        } else {
            xPos = e.clientX
        }
        this.posX = xPos - 10 + "px";
        this.posY = e.clientY + 10 + "px";
        this.splitSelection = true
        this.dimentionSelection = true;
        this.dValueSelection = false;
    }

    getFilterValues(d, e) {

        if (e) {
            var xPos;
            if (e.clientX > 1024) {
                xPos = e.clientX - 250;
            } else {
                xPos = e.clientX
            }
            this.posX = xPos - 10 + "px";
            this.posY = e.clientY + 10 + "px";

        }


        this.filterDimentionsValues = [];
        this.appLoading = true;
        this.currentSelectedDimension = d.id;

        var apiFilters: any = [{}];
        var index = this.sFilters.findIndex(function(v) {
            return v.id == d.id
        });

        if (index === -1) {
            for (var i = 0; i < this.sFilters.length; i++) {
                if (this.sFilters[i].values.length > 0) {
                    var k;
                    k = this.sFilters[i].id
                    apiFilters[0][k] = this.sFilters[i].values;
                }
            }
        } else {
            for (var i = 0; i < index; i++) {
                if (this.sFilters[i].values.length > 0) {
                    var k;
                    k = this.sFilters[i].id
                    apiFilters[0][k] = this.sFilters[i].values;
                }
            }
        }
        delete apiFilters[0][d.id]

        this._apis.getFilterDimentionValues(d.id, this.q, apiFilters[0], this.selectedDate).subscribe(response => {
            if (response.status == 1200) {
                this.filterDimentionsValues = response.data.split_by_data;
                this.appLoading = false;
            }
        })
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
    }

    onSearchChange() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {

            if (this.sFilters[i][0].values.length > 0) {
                var k;
                k = this.sFilters[i][0].id
                apiFilters[0][k] = this.sFilters[i][0].values;
            }
        }
        this._apis.getFilterDimentionValues(this.currentSelectedDimension, this.q, apiFilters[0], this.selectedDate).subscribe(response => {
            if (response.status == 1200) {
                this.filterDimentionsValues = response.data.split_by_data;
                this.appLoading = false;
            }
        })
    }

    hidePopup() {
        this.filterSelection = false
        this.dValueSelection = false;
        this.dimentionSelection = false;
        this.splitSelection = false;
    }
    goBackToDimensions() {
        this.filterSelection = true
        this.dimentionSelection = true;
        this.dValueSelection = false;
    }

    selectFilters(d) {
        var a = this.currentSelectedDimension;

        if (this.sFilters.filter(e => e.id === a).length > 0) {
            this.sFilters.filter(function(v) {
                if (v.id == a) {
                    if (!v.values.includes(d[a])) {
                        v.values.push(d[a])
                    } else {
                        var index = v.values.indexOf(d[a]);
                        if (index > -1) {
                            v.values.splice(index, 1);
                        }
                    }
                }
            });
        } else {
            let labelText;
            for (var i = 0; i < this.filterDimentions.length; i++) {
                if (this.filterDimentions[i].id == this.currentSelectedDimension) {
                    labelText = this.filterDimentions[i].text;
                }
            }

            var obj = {
                id: this.currentSelectedDimension,
                label: labelText,
                values: [d[a]],
            }
            this.sFilters.push(obj)
        }

        this.sFilters = this.sFilters.filter(function(v) {
            return v.values.length > 0;
        });
    }



    checkIfDimvalueExists(d) {

        var a = this.currentSelectedDimension;

        if (this.sFilters.length > 0) {
            var sel = this.sFilters.filter(function(v) {
                if (v.id == a) {
                    return v
                }
            });

            if (sel.length > 0) {
                var index = sel[0]["values"].indexOf(d[a]);
                return index;
            } else {
                return -1;
            }

        } else {
            return -1;
        }

    }
    arrToString(d) {
        return d.toString()
    }



    selectSplitDimention(d) {


        if (this.splitOpt.filter(e => e.id === d.id).length == 0) {
            this.splitOpt.push(d);
            if (this.splitOpt.length === 1) {
                this.getReport();
                console.log(1)
            } if (this.splitOpt.length === 0) {
                this.reportData = [];


            } else {
                // do nothing
            }
        } else {
            this.splitOpt = this.splitOpt.filter(function(obj) {
                return obj.id !== d.id;
            });


            if (this.splitOpt.length === 0) {
                this.reportData = [];
            } else {
                this.reportData = [];
                this.getReport();
                console.log(2);
            }

        }

        this.hidePopup();

    }

    getReport() {
        this.hidePopup();
        if (this.splitOpt.length === 0) {
            // this.updateGraph(this.currentGraphSelection);
            return false;
        }


        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        var split = this.splitOpt[0].id;
        this.reportData = [];
        this.reportLoading = true;
        this._apis.getReportData(split, apiFilters[0], this.selectedDate, 1, 20).subscribe(response => {
            if (response.status == 1200) {
                this.reportData = response.data.split_by_data;
                this.reportData.map(function(obj) {
                    obj.isCollapsed = true;
                    return obj;
                });
                this.totalImpressions = response.data.totalCount[0].impressions;
                this.totalConversions = response.data.totalCount[0].conversions;
                this.totalBids = response.data.totalCount[0].bids;
                this.totalWins = response.data.totalCount[0].wins;
                this.totalSpend = response.data.totalCount[0].spend;
                this.reportLoading = false;
                //this.cd.detectChanges();
            }
        });
    }

    loadmore() {
        var page = (this.reportData.length / 20) + 1;
        if (this.splitOpt.length === 0) {
            // this.updateGraph(this.currentGraphSelection);
            return false;
        }


        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        var split = this.splitOpt[0].id;
        // this.reportData=[];
        this.reportLoading = true;
        this._apis.getReportData(split, apiFilters[0], this.selectedDate, page, 20).subscribe(response => {
            if (response.status == 1200) {
                response.data.split_by_data.map(function(obj) {
                    obj.isCollapsed = true;
                    return obj;
                });
                if (response.data.split_by_data.length > 0) {

                    for (var i = 0; i < response.data.split_by_data.length; i++) {

                        this.reportData.push(response.data.split_by_data[i])
                    }
                }


                this.reportLoading = false;
                //this.cd.detectChanges();
            }
        });
    }


    checkIfHaveMoreSplits(c) {
        if (this.splitOpt.length > 0) {
            var index = this.splitOpt.findIndex(function(v) {
                return v.id == c
            })

            if (typeof (this.splitOpt[index + 1]) != "undefined") {
                return this.splitOpt[index + 1];
            } else {
                return 0;
            }
        }

    }

    splitData(obj, cSplit, sF, splitOptions, index, rowData, selectedDate) {
        var nextSplit = this.checkIfHaveMoreSplits(cSplit);
        this.service.setRootViewContainerRef(this.viewContainerRef.toArray()[index]);
        this.service.addDynamicComponent(obj, nextSplit, sF, splitOptions, rowData, selectedDate);
    }

    removeDynamicComponent(rowData, index) {
        this.viewContainerRef.toArray()[index].clear();
        rowData.isCollapsed = true;
    }

    rowWiseFilterObj(row, split) {
        var arr = [];
        var obj = {
            id: split,
            label: split,
            values: [row[split]]
        }
        arr.push(obj);

        return arr;

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

    altrows(firstcolor, secondcolor) {

        var tableElements = document.getElementsByClassName("report-row");
        for (var j = 0; j < tableElements.length; j++) {
            if (j % 2 == 0) {
                (<any>tableElements[j]).style.backgroundColor = firstcolor;
            }
            else {
                (<any>tableElements[j]).style.backgroundColor = secondcolor;
            }

        }

    }

    updateFilters(d, o) {
        if (o === "s") {
            this.splitOpt = this.splitOpt.filter(function(obj) {
                return obj.id !== d.id;
            });
            if (this.splitOpt.length > 0) {
                this.getReport();
            } else {
                this.reportData = [];
            }
        }
        if (o === "d") {
            this.sFilters = this.sFilters.filter(function(obj) {
                return obj.id !== d.id;
            });

            if (this.sFilters.length > 0) {
                this.getReport();
            } else {
                //this.reportData = [];
            }

        }
    }

    openDatePicker(e) {
        this.pickerDirective.open(e);
    }


    updateGraph(t) {

        this.currentGraphSelection = t;
        var apiFilters: any = [{}];


        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values;
            }
        }

        this.reportLoading = true;
        this._apis.getReportGraph(t, apiFilters[0], this.selectedDate).subscribe(response => {
            if (response.status == 1200) {
                this.chartOptions = {
                    chart: {
                        type: "spline"
                    },
                    title: {
                        text: t
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

    updateReport(e) {
        this.selectedDate = {
            startDate: e.start,
            endDate: e.end
        }
        this.getReport()
    }
}