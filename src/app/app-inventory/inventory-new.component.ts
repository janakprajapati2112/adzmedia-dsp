import {
    Injectable,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
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

import {
    Http,
    RequestMethod,
    RequestOptions,
    Response,
    ResponseOptions,
    XHRBackend,
    Headers
} from "@angular/http";
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
    selector: 'app-app-inventory',
    templateUrl: './template/inventory-new.component.html',
    encapsulation: ViewEncapsulation.None,
})

@Injectable()
export class AppInventoryComponent implements OnInit, AfterViewInit {

    id: any = '';
    filterExchanges: any = [];
    sites: any = [];
    filterExchangesData: any = [];
    apps: any = [];
    selectedAppList: any = [];
    readonlyExchanges = false;


    page: number = 1;
    limit: number = 50;


    loading: any = false;
    appLoading: any = false;
    filterLoading: any = false;

    listFlag: any = 0;

    model: any = {};
    modalReference: any;
    closeResult: string;

    totalExchangeApps: any = 'N/A';
    totalExchangeImpression: any = 'N/A';
    filterSelection: any = false;
    dimentionSelection: any = false;
    splitSelection: any = false;
    dValueSelection: any = false;
    filterDimentions: any = [];
    selectedDimentions: any = [];
    filterDimentionsValues: any = [];
    currentSelectedDimension: any = [];

    availableFilters: any = [];


    sFilters: any = [];
    posX: any = 100;
    posY: any = 100;

    selectedAppListType: any = [];
    appListTypes: any = [];
    appListName: string = '';

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
    ) { }

    ngOnInit() {

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });


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



        this.filterDimentions = [
            {
                id: "exchange",
                text: "Exchange"
            },
            {
                id: "country",
                text: "Countries"
            },
            {
                id: "carriers",
                text: "Carriers"
            },
            {
                id: "os",
                text: "Operating System"
            },
            {
                id: "osver",
                text: "OS Version"
            },
            {
                id: "networktype",
                text: "Network Type"
            },
            {
                id: "creativesize",
                text: "Creative Size"
            }

        ]
        this.appListTypes = [{
            "id": "0",
            "text": "Whitelist"
        },
        {
            "id": "1",
            "text": "BlackList"
        }];


        this.id = this.activatedRoute.snapshot.params['id'];
        if (typeof (this.id) != "undefined") {

            if (this.id != '' || this.id != null) {
                this._apis.getUserSingleAppListData(this.id).subscribe(response => {
                    if (response.status == 1200) {
                        this.filterExchanges = response.data.exchangeId;
                        var updatedapplist = response.data.apps;

                        var obj = {
                            id: "exchange",
                            label: "Exchange",
                            values: [response.data.exchangeId]
                        }
                        this.sFilters.push(obj);

                        if (updatedapplist.length != 0) {
                            for (var i = 0; i < updatedapplist.length; i++) {
                                updatedapplist[i].sid = "" + updatedapplist[i].sid + "";
                                updatedapplist[i].appName = updatedapplist[i].appName;
                                this.selectedAppList.push(updatedapplist[i])
                            }
                        }

                        this.loadApps();
                    }
                    else {

                        let str: any = '';
                        let errorList = response.errors;
                        for (let i in errorList) {
                            str += errorList[i] + "<br>";
                        }

                        this.toastr.error(str, 'Error');
                        return false;
                    }
                },
                    error => {
                        swal({
                            position: 'center',
                            type: 'error',
                            title: 'Unable  to load application list due to unknown error',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return false;
                    }

                );
            }

        } else {
            this.id = '';
        }


        this.cd.detectChanges();
    }

    ngAfterViewInit() {
        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
        this.cd.detectChanges();
    }

    convertToDecimals(input, decimals) {
        var exp, rounded,
            suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];


        if (input < 1000) {
            return input;
        }

        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
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

        this.currentSelectedDimension = d;
        this.filterSelection = true;
        this.dValueSelection = true;
        this.dimentionSelection = false;
        if (d.id == "exchange") {
            this.loadExchanges(e)

        } else if (d.id == "country") {
            this.loadCountry()

        } else if (d.id == "carriers") {
            this.loadCarriers()

        } else if (d.id == "os") {
            this.loadOS()

        } else if (d.id == "osver") {
            this.loadOSVersion()
        } else if (d.id == "networktype") {
            this.loadNetworkType()
        } else if (d.id == "creativesize") {
            this.loadCreativeSize()
        }
    }

    onSearchChange() {


    }
    updateFilters(d, o) {

        if (d.id == "exchange") {
            this.sFilters = [];
            this.apps = [];
        } else if (d.id == "country") {
            this.sFilters = this.sFilters.filter(function(obj) {
                return obj.id !== d.id;
            });
            this.sFilters = this.sFilters.filter(function(obj) {
                return obj.id !== "carriers";
            });
            this.loadApps();
        } else if (d.id == "os") {
            this.sFilters = this.sFilters.filter(function(obj) {
                return obj.id !== d.id;
            });
            this.sFilters = this.sFilters.filter(function(obj) {
                return obj.id !== "osver";
            });
            this.loadApps();

        } else {
            this.sFilters = this.sFilters.filter(function(obj) {
                return obj.id !== d.id;
            });
            this.loadApps();
        }



    }

    arrToString(d) {
        return d.toString()
    }

    loadExchanges(e) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });

        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "exchange";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;
        this._apis.getExchanges(options).subscribe(response => {
            if (response.status == 200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });

    }
    loadCountry() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }


        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        }


        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "country";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;



        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        delete apiFilters[0].country;
        this._apis.getExchangeCountries(apiFilters[0]).subscribe(response => {
            if (response.status == 1200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });

    }
    loadCarriers() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        } else if (!apiFilters[0].country) {
            this.toastr.error("Please select country to continue", "Error");
            return false;
        }

        apiFilters[0].exchange = apiFilters[0].exchange.toString();

        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "carriers";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;


        delete apiFilters[0].carriers;

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });

        this._apis.getExchangeCarriers('', options, apiFilters[0]).subscribe(response => {
            if (response.status == 1200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });
    }
    loadOS() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        }

        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "os";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;




        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        delete apiFilters[0].os;

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });


        this._apis.getExchangeOperatingSystems(options, apiFilters[0]).subscribe(response => {
            if (response.status == 1200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });
    }
    loadOSVersion() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        } else if (!apiFilters[0].os) {
            this.toastr.error("Please select os to continue", "Error");
            return false;
        }

        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "osver";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;



        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        delete apiFilters[0].osver;

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });

        this._apis.getExchangeOperatingSystemVersion('', options, apiFilters[0]).subscribe(response => {
            if (response.status == 1200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });

    }
    loadNetworkType() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        }

        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "osver";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;



        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        delete apiFilters[0].networktype;
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });


        this._apis.getNetworkType(options, apiFilters[0]).subscribe(response => {
            if (response.status == 1200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });

    }

    loadCreativeSize() {

        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        }

        this.filterDimentionsValues = [];
        this.currentSelectedDimension = "creativesize";
        this.filterSelection = true
        this.dValueSelection = true;
        this.dimentionSelection = false;
        this.availableFilters = [];
        this.filterLoading = true;



        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });

        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        delete apiFilters[0].osver;


        this._apis.getCreativeSizes(options, apiFilters[0]).subscribe(response => {
            if (response.status == 1200) {
                this.availableFilters = response.data;
                this.filterLoading = false;
            }
        });

    }
    loadAppName() {

    }
    selectFilters(d) {
        var a = this.currentSelectedDimension;
        if (this.sFilters.filter(e => e.id === a).length > 0) {
            this.sFilters.filter(function(v) {
                if (v.id == a) {
                    if (!v.values.includes(d)) {
                        if (a == "exchange") {
                            v.values = [d];
                        } else {
                            v.values.push(d)
                        }

                    } else {
                        var index = v.values.indexOf(d);
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
                values: [d],
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
                var index = sel[0]["values"].indexOf(d);
                return index;
            } else {
                return -1;
            }

        } else {
            return -1;
        }

    }


    loadApps() {
        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        if (!apiFilters[0].exchange) {
            this.toastr.error("Please select exchange to continue", "Error");
            return false;
        }
        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });

        this.page = 1;
        this.limit = 50;
        this.apps = [];
        this.appLoading = true;
        this._apis.getExchangeApps(options, apiFilters[0], this.page, this.limit).subscribe(
            data => {
                if (data.status == 200) {
                    this.apps = this.apps.concat(data.data.applist)
                    this.totalExchangeApps = this.convertToDecimals(data.data.totalAppCount, 2);
                    this.totalExchangeImpression = this.convertToDecimals(data.data.totalImpressionCount, 2);
                    this.appLoading = false;
                    this.hidePopup();

                } else {

                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.appLoading = false;
                    this.toastr.error(str, 'Error');
                    this.hidePopup();
                    return false;
                }

            },
            error => {
                swal({
                    position: 'center',
                    type: 'error',
                    title: 'Unable  to load application list due to unknown error',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.appLoading = false;
                this.hidePopup();
                return false;
            });

    }

    onScroll() {


        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({
            headers: headers
        });

        this.page = this.page + 1;
        this.limit = 50;
        this.appLoading = true;
        var apiFilters: any = [{}];
        for (var i = 0; i < this.sFilters.length; i++) {
            if (this.sFilters[i].values.length > 0) {
                var k;
                k = this.sFilters[i].id
                apiFilters[0][k] = this.sFilters[i].values
            }
        }

        apiFilters[0].exchange = apiFilters[0].exchange.toString();
        this._apis.getExchangeApps(options, apiFilters[0], this.page, this.limit).subscribe(
            data => {
                if (data.status == 200) {
                    this.apps = this.apps.concat(data.data.applist)
                    this.appLoading = false;
                    this.totalExchangeApps = this.convertToDecimals(data.data.totalAppCount, 2);
                    this.totalExchangeImpression = this.convertToDecimals(data.data.totalImpressionCount, 2);
                } else {

                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }

                    this.toastr.error(str, 'Error');
                    this.appLoading = false;
                    return false;
                }

            },
            error => {
                swal({
                    position: 'center',
                    type: 'error',
                    title: 'Unable  to load application list due to unknown error',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.appLoading = false;
                return false;
            });
    }

    onScrollUp() {
        return false;
    }

    updateAppList(app) {
        var v = app;

        var found = this.selectedAppList.some(function(el) {
            return v.sid.toString() === el.sid.toString();
        });

        if (found) {
            var index = this.selectedAppList.map(function(x) { return x.sid; }).indexOf(v.sid);

            if (index > -1) {
                this.selectedAppList.splice(index, 1);
            }
        } else {
            this.selectedAppList.push(v);
        }



    }

    checkApplistState(app, ex) {
        var v = app;
        if (this.selectedAppList.length > 0) {
            var found = this.selectedAppList.some(function(el) {
                return v.toString() === el.sid.toString();
            });

            if (found) {
                return 1;
            } else {
                return -1;
            }
        } else {
            return -1;
        }

    }

    hidePopup() {
        this.filterSelection = false
        this.dValueSelection = false;
        this.dimentionSelection = false;
        // this.splitSelection = false;  
    }
    goBackToDimensions() {
        this.filterSelection = true
        this.dimentionSelection = true;
        this.dValueSelection = false;
    }

    viewAppList(content) {
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {

        }, (reason) => {


        });

    }

    addNewAppList(content, blacklist) {

        if (this.selectedAppList.length == 0) {
            this.toastr.error("You can not create Blacklist/Whitelist without adding apps", 'Error');
            return false;
        }

        this.modalReference = this.modalService.open(content);
        this.listFlag = blacklist;
        this.modalReference.result.then((result) => {

        }, (reason) => {


        });

    }

    createNewAppList() {
        var error = '';
        var flag = 0;

        if (this.appListName == '') {
            error += "Please enter applist name<br>";
            flag = 1;
        }

        var selectedApps: any = [];
        if (this.selectedAppList.length == 0) {
            error += "Please select atleast one app<br>";
            flag = 1;
        } else {
            for (var i = 0; i < this.selectedAppList.length; i++) {

                selectedApps.push(this.selectedAppList[i].sid)
            }
        }

        if (flag == 1) {
            this.toastr.error(error, 'Error');
            return false;
        } else {

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
            let options = new RequestOptions({
                headers: headers
            });

            let formData: FormData = new FormData();
            this.loading = true;

            formData.append("name", this.appListName);
            formData.append("blacklist", this.listFlag);
            formData.append("appId", selectedApps);

            this._apis.createAppList(formData, options).subscribe(
                data => {
                    if (data.status == 1200) {
                        this.loading = false;
                        this.modalReference.close();
                        swal({
                            position: 'center',
                            type: 'success',
                            title: 'Your applist successfully created',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.appListName = '';
                        this.listFlag = 0;
                        this.selectedAppList = [];
                        return true;
                    } else {
                        let str: any = '';
                        let errorList = data.errors;
                        for (let i in errorList) {
                            str += errorList[i] + "<br>";
                        }

                        this.toastr.error(str, 'Error');
                        this.loading = false;
                        this.modalReference.close();
                        return false;
                    }
                },
                error => {
                    swal({
                        position: 'center',
                        type: 'error',
                        title: 'Unable to create list due to unknown error',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.modalReference.close();
                    this.loading = false;
                    return false;
                }


            );

        }
    }

    updateUserAppList() {

        var error = '';
        var flag = 0;

        var selectedApps: any = [];
        if (this.selectedAppList.length == 0) {
            error += "Please select atleast one app<br>";
            flag = 1;
        } else {
            for (var i = 0; i < this.selectedAppList.length; i++) {

                selectedApps.push(this.selectedAppList[i].sid)
            }
        }

        if (flag == 1) {
            this.toastr.error(error, 'Error');
            return false;
        } else {

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
            let options = new RequestOptions({
                headers: headers
            });

            let formData: FormData = new FormData();
            this.loading = true;

            //  formData.append("name", this.appListName);
            //  formData.append("blacklist", this.listFlag);
            formData.append("appId", selectedApps);
            formData.append("id", this.id);

            this._apis.updateUserAppList(formData, options).subscribe(
                data => {
                    if (data.status == 1200) {
                        this.loading = false;

                        swal({
                            position: 'center',
                            type: 'success',
                            title: 'Your applist successfully updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return true;
                    } else {
                        let str: any = '';
                        let errorList = data.errors;
                        for (let i in errorList) {
                            str += errorList[i] + "<br>";
                        }

                        this.toastr.error(str, 'Error');
                        this.loading = false;

                        return false;
                    }
                },
                error => {
                    swal({
                        position: 'center',
                        type: 'error',
                        title: 'Unable to update list due to unknown error',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.loading = false;

                    return false;
                }


            );

        }

    }

}
