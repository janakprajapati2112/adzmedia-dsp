import {
    Injectable, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, Directive } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { distinctUntilChanged, debounceTime, switchMap, tap } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { Creatives } from '../creatives/domain/creatives';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { ConfigService } from '../_services/config.service';
import { CampaignOperationsService } from './_services/campaignoperations.service';
import { ToastrService } from 'ngx-toastr';
import { Helpers } from '../helpers';
import { ValidationHelper } from './_helpers/validation-helper';
import { MovingDirection } from 'angular-archwizard';
import swal from 'sweetalert2';
import {
    ApplicationApiService
} from '../_services/api.service';

@Component({
    selector: 'app-editcampaign',
    templateUrl: './template/editcampaign.component.html',
    encapsulation: ViewEncapsulation.None,
})

@Injectable()
export class EditcampaignComponent implements OnInit, AfterViewInit {

    datasource: Creatives[];
    creatives: Creatives[];
    totalRecords: number;
    cols: any[];
    model: any = {};
    modalReference: any;
    closeResult: string;
    id: any;
    //step 1 variables
    campaignId: string = '';
    campaignName: string = '';
    campaignAdDomain: string = '';
    campaignCreatives: string = '';
    campaignSelectedCreatives: any = [];
    campaignType: any;
    campaignDailyBudget: any;
    campaignMaxBid: string = '';
    campaignTotalBudget: string = '';
    campaignFrequencyCap: string = '';
    campaignCategories: any;
    campaignEcpx: any;


    // step 2 variables
    campaignCountries: any = [];
    campaignCities: any = [];
    campaignCarriers: any = [];
    campaignNetworkTypes: any = [];
    campaignTrafficTypes: any = [];
    campaignBuyingOption: any;
    campaignOperatingSystem: any = [];
    campaignOperatingSystemVersion: any = [];
    campaignDeviceTypes: any = [];
    campaignManuFacturer: any = [];
    campaignDevices: any = [];
    campaignBrowser: any = [];
    campaignGender: any = [];
    campaignTimeZone: any;
    campaignDayParting: any = [];
    campaignTargetingCategories: any = [];
    campaignIntrests: any = [];
    campaignByTrafficByDevice: any = 'on';
    campaignBuyingStrategy: any = "2"
    campaignExchanges: any = [];
    campaignExchangesData: any = [];


    campaignCitiesOpt: any = "all";
    campaignCarriersOpt: any = "all";
    campaignOperatingSystemOpt: any = "all";
    campaignOperatingVersionOpt: any = "all";
    campaignManuFacturerOpt: any = 'all';
    campaignDevicesOpt: any = 'all';
    campaignBrowserOpt: any = 'all';
    campaignTargetingCategoriesOpt: any = 'all';
    campaignTargetingIntrestsOpt: any = 'all';



    campaignCountryData: any = [];
    campaignCityData: any = [];
    campaignCarrierData: any = [];
    campaignOperatingSystemData: any = [];
    campaignOperatingSystemVersionData: any = [];
    campaignManuFacturerData: any = [];
    campaignDeviceTypeData: any = [];
    campaignDevicesData: any = [];
    campaignBrowserData: any = [];
    campaignTargetingCategoriesData: any = [];
    campaignTargetingIntrestsData: any = [];
    campaignCategoriesData: any = [];
    campaignNetworkTypeData: any = [];
    campaignTimeZoneData: any = [];


    tableCreativePreview: any;

    //variables for creative filters
    creativeTypes: any = [];
    creativeSizes: any = [];
    creativeStatus: any = [];
    creativeTypesForFilter = [];

    filterCreativeName: string;
    filterCreativeNameSize: string;
    filterCreativeStatus: string;
    filterCreativeTypes: string;

    apps: any = [];

    countryTypeahead = new Subject<string>();
    countriesLoading = false;
    cityTypeahead = new Subject<string>();
    cityLoading = false;
    opTypeahead = new Subject<string>();
    opLoading = false;
    mfTypeahead = new Subject<string>();
    mfLoading = false;
    deviceTypeahead = new Subject<string>();
    deviceLoading = false;
    osVersionDisabled = 0;

    loading = false;


    //dayparting row and column variables

    dayPartingDataCountByRow: any = {

        dayparting_table_1_row_1: 0,
        dayparting_table_1_row_2: 0,
        dayparting_table_1_row_3: 0,
        dayparting_table_1_row_4: 0,
        dayparting_table_1_row_5: 0,
        dayparting_table_1_row_6: 0,
        dayparting_table_1_row_7: 0,


        dayparting_table_1_col_1: 0,
        dayparting_table_1_col_2: 0,
        dayparting_table_1_col_3: 0,
        dayparting_table_1_col_4: 0,
        dayparting_table_1_col_5: 0,
        dayparting_table_1_col_6: 0,
        dayparting_table_1_col_7: 0,
        dayparting_table_1_col_8: 0,
        dayparting_table_1_col_9: 0,
        dayparting_table_1_col_10: 0,
        dayparting_table_1_col_11: 0,
        dayparting_table_1_col_12: 0,

        dayparting_table_2_row_1: 0,
        dayparting_table_2_row_2: 0,
        dayparting_table_2_row_3: 0,
        dayparting_table_2_row_4: 0,
        dayparting_table_2_row_5: 0,
        dayparting_table_2_row_6: 0,
        dayparting_table_2_row_7: 0,


        dayparting_table_2_col_1: 0,
        dayparting_table_2_col_2: 0,
        dayparting_table_2_col_3: 0,
        dayparting_table_2_col_4: 0,
        dayparting_table_2_col_5: 0,
        dayparting_table_2_col_6: 0,
        dayparting_table_2_col_7: 0,
        dayparting_table_2_col_8: 0,
        dayparting_table_2_col_9: 0,
        dayparting_table_2_col_10: 0,
        dayparting_table_2_col_11: 0,
        dayparting_table_2_col_12: 0,


        dayparting_table_3_row_1: 0,
        dayparting_table_3_row_2: 0,
        dayparting_table_3_row_3: 0,
        dayparting_table_3_row_4: 0,
        dayparting_table_3_row_5: 0,
        dayparting_table_3_row_6: 0,
        dayparting_table_3_row_7: 0,


        dayparting_table_3_col_1: 0,
        dayparting_table_3_col_2: 0,
        dayparting_table_3_col_3: 0,
        dayparting_table_3_col_4: 0,
        dayparting_table_3_col_5: 0,
        dayparting_table_3_col_6: 0,
        dayparting_table_3_col_7: 0,
        dayparting_table_3_col_8: 0,
        dayparting_table_3_col_9: 0,
        dayparting_table_3_col_10: 0,
        dayparting_table_3_col_11: 0,
        dayparting_table_3_col_12: 0,

        dayparting_table_4_row_1: 0,
        dayparting_table_4_row_2: 0,
        dayparting_table_4_row_3: 0,
        dayparting_table_4_row_4: 0,
        dayparting_table_4_row_5: 0,
        dayparting_table_4_row_6: 0,
        dayparting_table_4_row_7: 0,


        dayparting_table_4_col_1: 0,
        dayparting_table_4_col_2: 0,
        dayparting_table_4_col_3: 0,
        dayparting_table_4_col_4: 0,
        dayparting_table_4_col_5: 0,
        dayparting_table_4_col_6: 0,
        dayparting_table_4_col_7: 0,
        dayparting_table_4_col_8: 0,
        dayparting_table_4_col_9: 0,
        dayparting_table_4_col_10: 0,
        dayparting_table_4_col_11: 0,
        dayparting_table_4_col_12: 0
    }


    constructor(
        private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private toastr: ToastrService,
        private _campaignOperations: CampaignOperationsService,
        private _configService: ConfigService,
        private http: Http,
        private cd: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _apis: ApplicationApiService
    ) {

    }

    ngOnInit() {


        this.campaignType = "1";
        this.creativeTypes = [
            { id: 1, name: "Image Creatives" },
            { id: 2, name: "Richmedia Creatives" },
            //{ id: 3, name: "Video Creatives" },
            { id: 4, name: "Native Creatives" }
        ];
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
        this.creativeSizes = [
            { "id": "1", "name": "320X50" },
            { "id": "2", "name": "320X250" },
            { "id": "3", "name": "240X80" },
            { "id": "4", "name": "560X60" },
            { "id": "5", "name": "680X120" },
            { "id": "6", "name": "720X160" },
            { "id": "7", "name": "320X480" },
            { "id": "8", "name": "300X250" },
            { "id": "9", "name": "300X50" },
            { "id": "10", "name": "120X20" },
            { "id": "11", "name": "480X320" },
            { "id": "12", "name": "0X0" }
        ];

        this.creativeStatus = [
            { id: "999", name: "All" },
            { id: "0", name: "Under Review" },
            { id: "1", name: "Active" },
            //{ id: "2", name: "Deleted" }
        ];

        this.creativeTypesForFilter = [
            { id: 2, name: "Image Creatives" },
            { id: 3, name: "Richmedia Creatives" },
            { id: 4, name: "Native Creatives" }
        ];

        this.campaignCategoriesData = this._configService.getCategoriesApiData();

        //this.campaignCountryData = this._configService.getCountries();
        this.campaignNetworkTypeData = this._configService.getNetworkTypes();

        this.cols = [
            { field: 'id', header: '#' },
            { field: 'link', header: 'Preview' },
            { field: 'type', header: 'Type' },
            { field: 'id', header: 'Action' }
        ];

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let data = {
            start: 0,
            limit: 10,
            sortBy: "id",
            sortOrder: -1
        };
        this.loading = true;
        this._campaignOperations.getCreatives(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.datasource = data.response.data;
                    this.creatives = this.datasource;
                    this.totalRecords = data.response.total;

                }
                else {
                    let str: any = '';
                    let errorList = data.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.toastr.error(str, 'Error');

                }
                this.loading = false;

            },

            error => {

            }
        );

        this._campaignOperations.getOperatingSystems(options).subscribe(response => {
            if (response.status == 1200) {
                this.campaignOperatingSystemData = response.data;
            }
        }
        );

        this._campaignOperations.getBrowsers(options).subscribe(response => {
            if (response.status == 1200) {
                this.campaignBrowserData = response.data;
            }
        }
        );

        this._campaignOperations.getCategories(options).subscribe(response => {
            if (response.status == 1200) {
                this.campaignTargetingCategoriesData = response.data;

            }
        }
        );

        this._campaignOperations.getTimeZone(options).subscribe(response => {
            if (response.status == 1200) {
                this.campaignTimeZoneData = response.data;

            }
        });

        this._campaignOperations.getUserAppList().subscribe(response => {
            if (response.status == 1200) {
                this.campaignExchangesData = response.data;
            }
        });
    }

    ngAfterViewInit() {
        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');
        this.loadCountries();
        this.loadCities();
        this.loadOperators();
        this.loadManufacturer();
        this.loadDevices();

        this.loading = true;

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        this.id = this.activatedRoute.snapshot.params['id'];
        this._campaignOperations.getCampaignData(this.id, options).subscribe(
            data => {
                if (data.status == 1200) {
                    let response = JSON.parse(data.data);

                    if (ValidationHelper.isEmpty(response.campaign_details.campaign_name) == false) {
                        this.campaignName = response.campaign_details.campaign_name;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.ad_domain) == false) {
                        this.campaignAdDomain = response.campaign_details.ad_domain;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.campaign_type) == false) {
                        this.campaignType = response.campaign_details.campaign_type;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.daily_budget) == false) {
                        this.campaignDailyBudget = response.campaign_details.daily_budget;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.max_bid) == false) {
                        this.campaignMaxBid = response.campaign_details.max_bid;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.total_budget) == false) {
                        this.campaignTotalBudget = response.campaign_details.total_budget;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.freq_capping) == false) {
                        this.campaignFrequencyCap = response.campaign_details.freq_capping;
                    }
                    if (ValidationHelper.isEmpty(response.campaign_details.category) == false) {
                        this.campaignCategories = response.campaign_details.category.split(",");
                    }

                    if (response.campaign_details.creative_id.length > 0) {
                        this.campaignSelectedCreatives = response.campaign_details.creative_id;
                    }



                    if ((ValidationHelper.isEmpty(response.campaign_targeting.countries) == false) && response.campaign_targeting.countries.length > 0) {
                        this.campaignCountries = response.campaign_targeting.countries;
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_city_other_data) == false) && response.campaign_targeting.campaign_city_other_data.length > 0) {
                        this.campaignCities = response.campaign_targeting.campaign_city_other_data;
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_carrier_other_data) == false) && response.campaign_targeting.campaign_carrier_other_data.length > 0) {
                        this.campaignCarriers = response.campaign_targeting.campaign_carrier_other_data;
                    }


                    this.campaignNetworkTypes = response.campaign_targeting.network_type;

                    if (response.campaign_targeting.network_type == "all") {
                        this.campaignNetworkTypes = ["wifi", "cellular"]
                    } else {
                        this.campaignNetworkTypes = response.campaign_targeting.network_type.split(",");
                    }


                    this.campaignTrafficTypes = response.campaign_targeting.traffic_type;

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_os_other_data) == false) && response.campaign_targeting.campaign_os_other_data.length > 0) {
                        this.campaignOperatingSystem = response.campaign_targeting.campaign_os_other_data;
                    }



                    var osver = [];
                    this.campaignOperatingSystem.forEach(item => {
                        osver.push(item.id);
                    });

                    let headers = new Headers();
                    headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
                    let options = new RequestOptions({ headers: headers });
                    this.osVersionDisabled = 1;
                    this._campaignOperations.getOperatingSystemVersion(osver.toString(), options).subscribe(response => {
                        if (response.status == 1200) {
                            this.campaignOperatingSystemVersionData = this.campaignOperatingSystemVersionData.concat(response.data);
                            this.osVersionDisabled = 0;

                        }
                    }
                    );

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_osv_other_data) == false) && response.campaign_targeting.campaign_osv_other_data.length > 0) {
                        this.campaignOperatingSystemVersion = response.campaign_targeting.campaign_osv_other_data;
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_manufacturer_other_data) == false) && response.campaign_targeting.campaign_manufacturer_other_data.length > 0) {
                        this.campaignManuFacturer = response.campaign_targeting.campaign_manufacturer_other_data;
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_devices_other_data) == false) && response.campaign_targeting.campaign_devices_other_data.length > 0) {
                        this.campaignDevices = response.campaign_targeting.campaign_devices_other_data;
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_browser_other_data) == false) && response.campaign_targeting.campaign_browser_other_data.length > 0) {
                        this.campaignBrowser = response.campaign_targeting.campaign_browser_other_data;
                    }


                    if ((ValidationHelper.isEmpty(response.campaign_targeting.inventory_lists) == false) && response.campaign_targeting.inventory_lists.length > 0) {

                        console.log(response.campaign_targeting.inventory_lists)
                        this.campaignExchanges = response.campaign_targeting.inventory_lists;
                        console.log(this.campaignExchanges);

                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.campaign_categories_other_data) == false) && response.campaign_targeting.campaign_categories_other_data.length > 0) {
                        this.campaignTargetingCategories = response.campaign_targeting.campaign_categories_other_data;

                    }


                    if ((ValidationHelper.isEmpty(response.campaign_targeting.timezone) == false)) {
                        this.campaignTimeZone = response.campaign_targeting.timezone;
                    }


                    this.campaignGender = response.campaign_targeting.gender;

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.day_parting) == false)) {
                        this.campaignDayParting = response.campaign_targeting.day_parting.split(",");
                    }




                    if ((ValidationHelper.isEmpty(response.campaign_targeting.device_identification) == false)) {
                        this.campaignByTrafficByDevice = response.campaign_targeting.device_identification;
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.buying_strategy) == false)) {
                        this.campaignBuyingStrategy = response.campaign_targeting.buying_strategy.toString();
                    }

                    if ((ValidationHelper.isEmpty(response.campaign_targeting.raw_day_parting_obj) == false)) {
                        this.dayPartingDataCountByRow = JSON.parse(response.campaign_targeting.raw_day_parting_obj);
                    }



                    //  console.log(this.dayPartingDataCountByRow)


                    this.campaignCitiesOpt = response.campaign_targeting.campaign_city_option;

                    this.campaignCarriersOpt = response.campaign_targeting.campaign_carrier_option;

                    this.campaignOperatingSystemOpt = response.campaign_targeting.campaign_os_option;

                    this.campaignOperatingVersionOpt = response.campaign_targeting.campaign_osv_option;

                    this.campaignManuFacturerOpt = response.campaign_targeting.campaign_manufacturers_option;

                    this.campaignDevicesOpt = response.campaign_targeting.campaign_devices_option;

                    this.campaignBrowserOpt = response.campaign_targeting.campaign_browser_option;

                    this.campaignTargetingCategoriesOpt = response.campaign_targeting.campaign_categories_option;

                    this.loading = false;

                }
                else {

                    if (data.status == 1404) {
                        swal({
                            position: 'center',
                            type: 'error',
                            title: 'Campaign does not exists',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    else {
                        let str: any = '';
                        let errorList = data.errors;
                        for (let i in errorList) {
                            str += errorList[i] + "<br>";
                        }
                        this.toastr.error(str, 'Error');
                    }

                    this.loading = false;
                }
                this.loading = false;
            },

            error => {

            }
        );



    }

    checkForm(): boolean {
        return true;
    }

    loadCreativesModal(content) {

        this.loading = true;
        this.modalReference = this.modalService.open(content, { size: 'lg' });
        this.modalReference.result.then((result) => {

        }, (reason) => {

        });
    }


    loadCreativeTable() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        let name = '';
        let size = '';
        let status = '';
        let type = '';
        let filter = {
            name: '',
            size: '',
            status: '',
            type: ''
        };
        if (this.filterCreativeName != '') {
            filter.name = this.filterCreativeName;
        }
        if (this.filterCreativeNameSize != '') {
            filter.size = this.filterCreativeNameSize;
        }
        if (this.filterCreativeStatus != '') {
            filter.status = this.filterCreativeStatus;
        }
        if (this.filterCreativeTypes != '') {
            filter.type = this.filterCreativeTypes;
        }

        let data = {
            start: 0,
            limit: 10,
            sortBy: "id",
            sortOrder: -1,
            filters: filter
        };
        this.loading = true;
        this._campaignOperations.getCreatives(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.datasource = data.response.data;
                    this.creatives = this.datasource;
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

    viewCreativePreview(content, link) {
        this.tableCreativePreview = link;
        this.modalReference = this.modalService.open(content, {
            windowClass: 'z-index3001',
            backdropClass: 'z-index3000'
        });
        this.modalReference.result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    openDayPartingModal(content) {
        this.modalReference = this.modalService.open(content, {
            windowClass: 'timediv',

        });
        this.modalReference.result.then((result) => {
            // this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    updateCreativeSelection(value) {
        var index = this.campaignSelectedCreatives.indexOf(value);
        if (index === -1) {
            this.campaignSelectedCreatives.push(value);
        } else {
            this.campaignSelectedCreatives.splice(index, 1);
        }

        console.log(this.campaignSelectedCreatives)
    }

    loadCreativesLazy(event: LazyLoadEvent) {

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


        let name = '';
        let size = '';
        let status = '';
        let type = '';
        let filter = {
            name: '',
            size: '',
            status: '',
            type: ''
        };
        if (this.filterCreativeName != '') {
            filter.name = this.filterCreativeName;
        }
        if (this.filterCreativeNameSize != '') {
            filter.size = this.filterCreativeNameSize;
        }
        if (this.filterCreativeStatus != '') {
            filter.status = this.filterCreativeStatus;
        }
        if (this.filterCreativeTypes != '') {
            filter.type = this.filterCreativeTypes;
        }

        let data = {
            start: event.first,
            limit: event.rows,
            sortBy: sortBy,
            sortOrder: sortOrder,
            filters: filter
        };
        this.loading = true;
        this._campaignOperations.getCreatives(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.datasource = data.response.data;
                    this.creatives = this.datasource;
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


            },

            error => {

            }

        );
    }




    selectNetworkType(value) {

        var index = this.campaignNetworkTypes.indexOf(value);
        if (index === -1) {
            this.campaignNetworkTypes.push(value);
        } else {
            this.campaignNetworkTypes.splice(index, 1);
        }

    }


    selectTrafficTypes(value) {
        var index = this.campaignTrafficTypes.indexOf(value);
        if (index === -1) {
            this.campaignTrafficTypes.push(value);
        } else {
            this.campaignTrafficTypes.splice(index, 1);
        }
    }


    selectGender(value) {
        if (value == 7 && this.campaignGender.length < 3) {
            var index = this.campaignGender.indexOf(1);
            if (index === -1) {
                this.campaignGender.push(1);
            }
            var index = this.campaignGender.indexOf(2);
            if (index === -1) {
                this.campaignGender.push(2);
            }
            var index = this.campaignGender.indexOf(3);
            if (index === -1) {
                this.campaignGender.push(3);
            }

        } else if (value == 7 && this.campaignGender.length == 3) {
            this.campaignGender = [];
        } else {
            var index = this.campaignGender.indexOf(value);
            if (index === -1) {
                this.campaignGender.push(value);
            } else {
                this.campaignGender.splice(index, 1);
            }
        }

    }

    loadCountries() {
        this.countryTypeahead.pipe(
            tap(() => this.countriesLoading = true),
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(term => this._campaignOperations.getCountries(term)),
        ).subscribe(x => {
            this.campaignCountryData = x;
            this.countriesLoading = false;
            this.cd.markForCheck();
        }, () => {
            this.campaignCountryData = [];
        });
    }

    loadCities() {
        this.cityTypeahead.pipe(
            tap(() => this.cityLoading = true),
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(term => this._campaignOperations.getCities(term, this.campaignCountries)),
        ).subscribe(x => {
            this.campaignCityData = x;
            this.cityLoading = false;
            this.cd.markForCheck();
        }, () => {
            this.campaignCityData = [];
        });
    }

    loadOperators() {
        this.opTypeahead.pipe(
            tap(() => this.opLoading = true),
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(term => this._campaignOperations.getOperators(term, this.campaignCountries)),
        ).subscribe(x => {
            this.campaignCarrierData = x;
            this.opLoading = false;
            this.cd.markForCheck();
        }, () => {
            this.campaignCarrierData = [];
        });
    }

    loadManufacturer() {
        this.mfTypeahead.pipe(
            tap(() => this.mfLoading = true),
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(term => this._campaignOperations.getManufacturer(term)),
        ).subscribe(x => {
            this.campaignManuFacturerData = x;
            this.mfLoading = false;
            this.cd.markForCheck();
        }, () => {
            this.campaignManuFacturerData = [];
        });
    }

    loadDevices() {

        this.deviceTypeahead.pipe(
            tap(() => this.deviceLoading = true),
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(term => this._campaignOperations.getDevices(term)),
        ).subscribe(x => {
            this.campaignDevicesData = x;
            this.deviceLoading = false;
            this.cd.markForCheck();
        }, () => {
            this.campaignDevicesData = [];
        });
    }

    removeCitiesFromArray() {

    }

    countriesRemove(e) {
        let country = e.value.id;
        let tempCities = [];
        let tempCarriers = [];

        for (var i = 0; i < this.campaignCities.length; i++) {
            if (country.toUpperCase() != this.campaignCities[i].id.split("_")[0]) {
                tempCities.push(this.campaignCities[i]);
            }
        }

        this.campaignCities = tempCities;

        for (var i = 0; i < this.campaignCarriers.length; i++) {
            if (country.toUpperCase() != this.campaignCarriers[i].id.split("_")[0]) {
                tempCarriers.push(this.campaignCarriers[i]);
            }
        }

        this.campaignCarriers = tempCarriers;

    }
    countriesClear() {
        this.campaignCities = [];
        this.campaignCarriers = [];
    }


    onOperatingSystemAdd(e) {
        let osid = e.id;
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        this.osVersionDisabled = 1;
        this._campaignOperations.getOperatingSystemVersion(osid, options).subscribe(response => {
            if (response.status == 1200) {
                this.campaignOperatingSystemVersionData = this.campaignOperatingSystemVersionData.concat(response.data);
                this.osVersionDisabled = 0;

            }
        }
        );
    }
    onOperatingSystemRemove(e) {
        let os = e.value.id;
        let tempOsVersionData = [];
        let tempOsVersion = [];



        for (var i = 0; i < this.campaignOperatingSystemVersionData.length; i++) {
            if (os != this.campaignOperatingSystemVersionData[i].id.split("_")[1]) {
                console.log(os + "----" + this.campaignOperatingSystemVersionData[i])
                tempOsVersionData.push(this.campaignOperatingSystemVersionData[i]);
            }
        }

        for (var i = 0; i < this.campaignOperatingSystemVersion.length; i++) {
            if (os != this.campaignOperatingSystemVersion[i].id.split("_")[1]) {
                tempOsVersion.push(this.campaignOperatingSystemVersion[i]);
            }
        }
        this.campaignOperatingSystemVersionData = tempOsVersionData;
        this.campaignOperatingSystemVersion = tempOsVersion;
    }

    updateSelectControls(controlName) {
        if (controlName == "city") {
            this.campaignCities = [];
        }
        if (controlName == "op") {
            this.campaignCarriers = [];
        }
        if (controlName == "os") {
            this.campaignOperatingSystem = [];
            this.campaignOperatingSystemVersionData = [];
            this.campaignOperatingSystemVersion = [];
        }
        if (controlName == "osver") {
            this.campaignOperatingSystemVersion = [];
        }
        if (controlName == "maker") {
            this.campaignManuFacturer = [];
        }
        if (controlName == "device") {
            this.campaignDevices = [];
        }
        if (controlName == "browser") {
            this.campaignBrowser = [];
        }
        if (controlName == "category") {
            this.campaignTargetingCategories = [];
        }
    }



    selectDayPartingRow(table, i, elem) {
        let x = (<any>document.getElementById(table));
        let row = x.rows[i].cells;

        var flag = true;
        var selectAllCb = (<any>document.getElementById(elem));


        if (selectAllCb.checked == false) {
            flag = false;
        }
        var rowCheckboxCount = table + "_" + "row" + "_" + i;



        for (i = 1; i < 13; i++) {
            var id = row[i].querySelectorAll("input[type='checkbox']")[0].getAttribute("ID");
            var value = (<any>document.getElementById(id)).value;

            if (flag == true) {
                if (this.campaignDayParting.indexOf(value) == -1) {
                    this.campaignDayParting.push(value);
                    this.dayPartingDataCountByRow[rowCheckboxCount] = this.dayPartingDataCountByRow[rowCheckboxCount] + 1;

                    this.dayPartingDataCountByRow[table + "_" + "col" + "_" + i] = this.dayPartingDataCountByRow[table + "_" + "col" + "_" + i] + 1;
                }
            }
            else {
                var index = this.campaignDayParting.indexOf(value);
                if (index > -1) {
                    this.campaignDayParting.splice(index, 1);
                    this.dayPartingDataCountByRow[rowCheckboxCount] = this.dayPartingDataCountByRow[rowCheckboxCount] - 1;

                    this.dayPartingDataCountByRow[table + "_" + "col" + "_" + i] = this.dayPartingDataCountByRow[table + "_" + "col" + "_" + i] - 1;
                }
            }
            (<any>document.getElementById(id)).checked = flag;
        }

    }

    selectDayPartingColumn(table, colno, elem) {
        var tbl = table;
        var table = (<any>document.getElementById(table))
        var flag = true;
        var selectAllCb = (<any>document.getElementById(elem));
        if (selectAllCb.checked == false) {
            flag = false;
        }

        var colCheckboxCount = tbl + "_" + "col" + "_" + colno;
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (j == colno) {
                    if (col.querySelectorAll("input[type='checkbox'].daypartingckbox").length > 0) {
                        var id = col.querySelectorAll("input[type='checkbox']")[0].getAttribute("ID");

                        var elementstatus = (<any>document.getElementById(id));
                        var value = (<any>document.getElementById(id)).value;
                        if (flag == true) {

                            if (this.campaignDayParting.indexOf(value) == -1) {
                                this.campaignDayParting.push(value);
                                this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + colno] = this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + colno] + 1;
                                this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] = this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] + 1;
                            } else {
                            }
                        }
                        else {
                            var index = this.campaignDayParting.indexOf(value);

                            if (index > -1) {
                                this.campaignDayParting.splice(index, 1);
                                this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + colno] = this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + colno] - 1;
                                this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] = this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] - 1;
                            }
                        }

                        (<any>document.getElementById(id)).checked = flag;
                    }


                }
            }



        }

    }

    selectAllDayPartingOptions(table, elem) {
        var tbl = table;
        var table = (<any>document.getElementById(table))
        var selectAllCb = (<any>document.getElementById(elem));
        var flag = true;
        if (selectAllCb.checked == false) {
            flag = false;
        }

        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (col.querySelectorAll("input[type='checkbox'].daypartingckbox").length > 0) {
                    var id = col.querySelectorAll("input[type='checkbox']")[0].getAttribute("ID");
                    var value = (<any>document.getElementById(id)).value;

                    /*   if(flag == true) {
                          if( this.campaignDayParting.indexOf(value) == -1) {
                            this.campaignDayParting.push(value);
                          }
                       }
                       else {
                           var index = this.campaignDayParting.indexOf(value);
                           if (index > -1) {
                               this.campaignDayParting.splice(index, 1);
                           }
                       }
                       */

                    if (flag == true) {

                        if (this.campaignDayParting.indexOf(value) == -1) {
                            this.campaignDayParting.push(value);
                            this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + j] = this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + j] + 1;
                            this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] = this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] + 1;
                        } else {
                        }
                    }
                    else {
                        var index = this.campaignDayParting.indexOf(value);

                        if (index > -1) {
                            this.campaignDayParting.splice(index, 1);
                            this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + j] = this.dayPartingDataCountByRow[tbl + "_" + "col" + "_" + j] - 1;
                            this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] = this.dayPartingDataCountByRow[tbl + "_" + "row" + "_" + i] - 1;
                        }
                    }


                    (<any>document.getElementById(id)).checked = flag;

                }

            }

        }

    }

    updateDayParting(v, rowcount, colcount) {
        var updatedCount;
        if (this.campaignDayParting.indexOf(v) == -1) {
            this.campaignDayParting.push(v);
            updatedCount = this.dayPartingDataCountByRow[rowcount] + 1;
            this.dayPartingDataCountByRow[rowcount] = updatedCount;
            this.dayPartingDataCountByRow[colcount] = this.dayPartingDataCountByRow[colcount] + 1;
        }
        else {
            var index = this.campaignDayParting.indexOf(v);
            if (index > -1) {
                this.campaignDayParting.splice(index, 1);
                updatedCount = this.dayPartingDataCountByRow[rowcount] - 1;
                this.dayPartingDataCountByRow[rowcount] = updatedCount;
                this.dayPartingDataCountByRow[colcount] = this.dayPartingDataCountByRow[colcount] - 1;
            }
        }
        //console.log(this.campaignDayParting)
    }

    countCheckedCheckboxes(tableid) {
        var table = (<any>document.getElementById(tableid));
        var count = table.querySelectorAll("input[type='checkbox']:checked").length;
        return count;
    }


    updateCampaignStep1() {
        var error = '';
        var errorFlag = 0;

        if (ValidationHelper.isEmpty(this.campaignName) == true) {
            error += '<i class="fa fa-times"></i> Please enter campaign name <br>';
            errorFlag = 1;
        } else if (ValidationHelper.minLength(this.campaignName) <= 2) {
            error += '<i class="fa fa-times"></i> Campaign name must have atleast 2 characters <br>';
            errorFlag = 1;
        } else if (ValidationHelper.minLength(this.campaignName) > 100) {
            error += '<i class="fa fa-times"></i> Campaign name should not be greater that 100 characters <br>';
            errorFlag = 1;
        }

        if (ValidationHelper.isURL(this.campaignAdDomain) == false) {
            error += '<i class="fa fa-times"></i> Please enter valid ad domain Url <br>';
            errorFlag = 1;
        }

        if (this.campaignSelectedCreatives.length == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one creative <br>';
            errorFlag = 1;
        }



        if (ValidationHelper.isNumber(this.campaignDailyBudget) == false) {
            error += '<i class="fa fa-times"></i> Please enter daily budget in numbers <br>';
            errorFlag = 1;
        }

        if (ValidationHelper.isNumber(this.campaignMaxBid) == false) {
            error += '<i class="fa fa-times"></i> Please enter maximum bid in numbers <br>';
            errorFlag = 1;
        }

        if (ValidationHelper.isNumber(this.campaignTotalBudget) == false) {
            error += '<i class="fa fa-times"></i> Please enter total budget in numbers <br>';
            errorFlag = 1;
        }

        if (ValidationHelper.isEmpty(this.campaignCategories) == true) {
            error += '<i class="fa fa-times"></i> Please select category <br>';
            errorFlag = 1;
        }


        if (errorFlag == 1) {
            this.toastr.error(error, '');
            return false;
        } else {

            let formData: FormData = new FormData();
            this.loading = true;
            //step1

            formData.append("campaign_id", this.id);
            formData.append("step", "1");
            formData.append("campaign_name", this.campaignName);
            formData.append("ad_domain", this.campaignAdDomain);

            var selectedCreativeIds: any = [];
            var categoriesOne: any = [];


            formData.append("creative_id", this.campaignSelectedCreatives);


            formData.append("category", this.campaignCategories);
            formData.append("campaign_type", this.campaignType);
            formData.append("daily_budget", this.campaignDailyBudget);
            formData.append("max_bid", this.campaignMaxBid);
            formData.append("total_budget", this.campaignTotalBudget);
            formData.append("freq_capping", this.campaignFrequencyCap);


            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
            let options = new RequestOptions({ headers: headers });
            this._campaignOperations.updateCampaignStep1(formData, options).subscribe(
                data => {
                    if (data.status == 1200) {
                        this.loading = false;
                        swal({
                            position: 'center',
                            type: 'success',
                            title: 'Your campaign successfully updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return true;
                    }
                    else {

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
                        title: 'Unable to create campaign due to unknown error',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.loading = false;
                    return false;
                });


        }
    }


    updateCampaignStep2(sPopup) {
        var error = '';
        var errorFlag = 0;

        var error = '';
        var errorFlag = 0;

        if (ValidationHelper.getArrayLength(this.campaignCountries) == 0) {
            error += '<i class="fa fa-times"></i> Please select country <br>';
            errorFlag = 1;
        }

        if (this.campaignCitiesOpt == "manual" && ValidationHelper.getArrayLength(this.campaignCities) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one city <br>';
            errorFlag = 1;
        }

        if (this.campaignCarriersOpt == "manual" && ValidationHelper.getArrayLength(this.campaignCarriers) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one carrier <br>';
            errorFlag = 1;
        }

        if (ValidationHelper.getArrayLength(this.campaignNetworkTypes) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one network type <br>';
            errorFlag = 1;
        }

        if (ValidationHelper.getArrayLength(this.campaignTrafficTypes) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one traffic type <br>';
            errorFlag = 1;
        }

        if (this.campaignOperatingSystemOpt == "manual" && ValidationHelper.getArrayLength(this.campaignOperatingSystem) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one OS <br>';
            errorFlag = 1;
        }

        if (this.campaignOperatingVersionOpt == "manual" && ValidationHelper.getArrayLength(this.campaignOperatingSystemVersion) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one OS Version<br>';
            errorFlag = 1;
        }

        if (this.campaignManuFacturerOpt == "manual" && ValidationHelper.getArrayLength(this.campaignManuFacturer) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one manufaturer<br>';
            errorFlag = 1;
        }

        if (this.campaignDevicesOpt == "manual" && ValidationHelper.getArrayLength(this.campaignDevices) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one device<br>';
            errorFlag = 1;
        }

        if (this.campaignBrowserOpt == "manual" && ValidationHelper.getArrayLength(this.campaignBrowser) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one browser<br>';
            errorFlag = 1;
        }


        if (ValidationHelper.getArrayLength(this.campaignGender) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one gender<br>';
            errorFlag = 1;
        }

        if (ValidationHelper.getArrayLength(this.campaignDayParting) == 0) {
            error += '<i class="fa fa-times"></i> Please add options to schedule your campaign<br>';
            errorFlag = 1;
        }

        if (ValidationHelper.isEmpty(this.campaignTimeZone) == true) {
            error += '<i class="fa fa-times"></i> Please select timezone <br>';
            errorFlag = 1;
        }


        if (this.campaignTargetingCategoriesOpt == "manual" && ValidationHelper.getArrayLength(this.campaignTargetingCategories) == 0) {
            error += '<i class="fa fa-times"></i> Please select atleast one category<br>';
            errorFlag = 1;
        }


        if (errorFlag == 1) {
            this.toastr.error(error, '');
            return false;
        } else {

            let formData: FormData = new FormData();
            this.loading = true;

            var country: any = [];
            var cities: any = [];
            var carriers: any = [];
            var os: any = [];
            var osver: any = [];
            var maker: any = [];
            var device: any = [];
            var category: any = [];
            var browser: any = [];
            formData.append("campaign_id", this.id);
            formData.append("step", "2");

            if (this.campaignCountries.length > 0) {
                for (var i = 0; i < this.campaignCountries.length; i++) {
                    country.push(this.campaignCountries[i].id)
                }
                formData.append("countries", country);
            }



            for (var i = 0; i < this.campaignCities.length; i++) {
                cities.push(this.campaignCities[i].id)
            }
            for (var i = 0; i < this.campaignCarriers.length; i++) {
                carriers.push(this.campaignCarriers[i].id)
            }


            if (cities.length > 0) {
                formData.append("campaign_city_other_data", cities);
            }

            if (carriers.length > 0) {
                formData.append("campaign_carrier_other_data", carriers);
            }

            if (this.campaignOperatingSystem.length > 0) {

                for (var i = 0; i < this.campaignOperatingSystem.length; i++) {
                    os.push(this.campaignOperatingSystem[i].id)
                }
                formData.append("campaign_os_other_data", os);
            }

            if (this.campaignOperatingSystemVersion.length > 0) {
                for (var i = 0; i < this.campaignOperatingSystemVersion.length; i++) {
                    osver.push(this.campaignOperatingSystemVersion[i].id)
                }
                formData.append("campaign_osv_other_data", osver);
            }

            if (this.campaignManuFacturer.length > 0) {
                for (var i = 0; i < this.campaignManuFacturer.length; i++) {
                    maker.push(this.campaignManuFacturer[i].id)
                }
                formData.append("campaign_manufacturer_other_data", maker);
            }

            if (this.campaignDevices.length > 0) {
                for (var i = 0; i < this.campaignDevices.length; i++) {
                    device.push(this.campaignDevices[i].id)
                }
                formData.append("campaign_devices_other_data", device);
            }

            if (this.campaignBrowser.length > 0) {
                for (var i = 0; i < this.campaignBrowser.length; i++) {
                    browser.push(this.campaignBrowser[i].id)
                }
                formData.append("campaign_browser_other_data", browser);
            }

            if (this.campaignTargetingCategories.length > 0) {
                for (var i = 0; i < this.campaignTargetingCategories.length; i++) {
                    category.push(this.campaignTargetingCategories[i].id)
                }
                formData.append("campaign_categories_other_data", category);
            }


            var exchange: any = [];
            if (this.campaignExchanges.length > 0) {
                for (var i = 0; i < this.campaignExchanges.length; i++) {
                    exchange.push(this.campaignExchanges[i].id)
                }
                formData.append("inventory_lists", exchange);
            }


            formData.append("timezone", this.campaignTimeZone);


            if (this.campaignNetworkTypes.length == 2) {
                formData.append("network_type", "all");
            } else {
                formData.append("network_type", this.campaignNetworkTypes);
            }

            formData.append("traffic_type", this.campaignTrafficTypes);

            formData.append("gender", this.campaignGender);
            formData.append("day_parting", this.campaignDayParting);
            formData.append("buying_strategy", this.campaignBuyingStrategy);

            formData.append("device_identification", this.campaignByTrafficByDevice);
            formData.append("campaign_city_option", this.campaignCitiesOpt);
            formData.append("campaign_carrier_option", this.campaignCarriersOpt);
            formData.append("campaign_os_option", this.campaignOperatingSystemOpt);
            formData.append("campaign_osv_option", this.campaignOperatingVersionOpt);
            formData.append("campaign_manufacturers_option", this.campaignManuFacturerOpt);
            formData.append("campaign_devices_option", this.campaignDevicesOpt);
            formData.append("campaign_browser_option", this.campaignBrowserOpt);
            formData.append("campaign_categories_option", this.campaignTargetingCategoriesOpt);

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
            let options = new RequestOptions({ headers: headers });
            this._campaignOperations.updateCampaignStep2(formData, options).subscribe(
                data => {
                    if (data.status == 1200) {
                        this.loading = false;

                        if (sPopup == "popup") {
                            swal({
                                position: 'center',
                                type: 'success',
                                title: 'Your campaign successfully updated',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                        return true;
                    }
                    else {

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
                        title: 'Unable to create campaign due to unknown error',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.loading = false;
                    return false;
                });

            return true;
        }
    }

    openBidUpdateOptions(content) {
        this.loading = true;

        this._campaignOperations.loadCampaignApplistData(this.id).subscribe(
            data => {
                if (data.status == 1200) {
                    this.loading = false;
                    this.apps = data.data;
                    this.modalReference = this.modalService.open(content, { size: 'lg' });
                    this.modalReference.result.then((result) => {

                    }, (reason) => {

                    });

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
                    return false;
                }

            },
            error => {
                swal({
                    position: 'center',
                    type: 'error',
                    title: 'Unable to create campaign due to unknown error',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.loading = false;
                return false;
            });
    }

    updateBidDetails(cid, sid, bid) {
        var bidArr: any = [{}];
        var obj = [{
            "sid": sid,
            "dynamic_bid": bid
        }]
        bidArr[0].cid = cid,
            bidArr[0].bids = obj
        this.loading = true;
        this._campaignOperations.updateAppBid(bidArr[0]).subscribe(
            data => {
                if (data.status == 1200) {

                    this.loading = false;
                    this.toastr.success("Bid value for campaign updated successfully", 'Success');
                }
                else {

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
                    title: 'Unable to update due to unknown',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.loading = false;
                return false;
            });


    }

    _keyUp(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
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
