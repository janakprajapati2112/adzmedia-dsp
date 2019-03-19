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
    selector: 'app-inventorylist',
    templateUrl: './template/inventorylist.component.html',
    encapsulation: ViewEncapsulation.None,
})
@Injectable()
export class InventorylistComponent implements OnInit {

    datasource: Applist[];
    applist: Applist[];
    totalRecords: number;
    cols: any[];

    model: any = {};
    modalReference: any;
    closeResult: string;
    deletebtnloading: any;
    deleteApplistId: any;

    appListName: any = '';
    appListCSV: any;
    fileName: any;

    @ViewChild('viewcampaignlist') private modalcontent;


    campaigns: any = [];

    constructor(
        private _script: ScriptLoaderService,
        private _apis: ApplicationApiService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private toastr: ToastrService,
        private _configService: ConfigService,
        private http: Http,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'text', header: 'Name' },
            { field: 'blacklist', header: 'Type' },
            { field: 'id', header: 'Action' },

        ];

        this.getUserApplist();

    }


    getUserApplist() {
        this._apis.getUserAppList().subscribe(
            response => {
                if (response.status == 1200) {
                    this.datasource = response.data;
                    this.applist = this.datasource;
                    this.totalRecords = response.total;
                }
                else {
                    let str: any = '';
                    let errorList = response.errors;
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

    onImportCsvChange(event: any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            var file = event.target.files[0];

            this.appListCSV = file;

            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                this.fileName = file.name;
            }
        }
    }
    checkUserApplistStatus(id) {
        this.deleteApplistId = id;
        this.deletebtnloading = true;
        let deleteId = id;
        this._apis.checkUserApplistStatus(id).subscribe(
            response => {
                if (response.status == 1200) {
                    if (response.data.length == 0) {
                        this.deleteUserAppList(this.deleteApplistId);
                    } else {
                        this.campaigns = response.data;
                        this.modalReference = this.modalService.open(this.modalcontent);
                        this.deletebtnloading = false;
                        this.modalReference.result.then((result) => {

                        }, (reason) => {

                        });

                    }
                }
                else {
                    let str: any = '';
                    let errorList = response.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.toastr.error(str, 'Error');
                    this.deletebtnloading = false;
                }
            },

            error => {
                this.deletebtnloading = false;
            }
        );
    }

    deleteUserAppList(id) {

        this.deletebtnloading = true;
        this._apis.deleteAppList(id).subscribe(
            response => {
                if (response.status == 1200) {
                    this.toastr.success('Applist deleted successfully', 'Success');
                    this.deletebtnloading = false;
                    this.getUserApplist();
                    this.modalReference.close();

                }
                else {
                    let str: any = '';
                    let errorList = response.errors;
                    for (let i in errorList) {
                        str += errorList[i] + "<br>";
                    }
                    this.toastr.error(str, 'Error');
                    this.deletebtnloading = false;
                }
            },

            error => {
                this.deletebtnloading = false;
            }
        );


    }


    openCsvImporter(content) {
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
        }, (reason) => {

        });
    }

    uploadAppListCsv() {
        //    appListName:any ='';
        //  appListCSV:any;
        var error = '';
        var flag = 0;
        if (this.appListName == "") {
            error += "Please enter file name <br>";
            flag = 1;
        }
        if (this.appListCSV == null) {
            error += "Please upload file <br>";
            flag = 1;
        }

        if (flag == 1) {
            this.toastr.error(error, 'Error');
            return false;
        } else {
            return true;
        }
    }

}
export interface Applist {
    id?;
    name?;
    type?;
    action?;
} 
