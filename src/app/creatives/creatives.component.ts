import {
    Injectable
} from '@angular/core';

import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input, Output, ComponentFactoryResolver, ViewChild, ViewContainerRef, Directive } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { FormBuilder } from "@angular/forms";
import { Creatives } from './domain/creatives';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { UploadCreativeService } from './_services/uploadcreative.service';
import { CreativeValidations } from './_helpers/creative-validations';
import { Helpers } from '../helpers';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from "@angular/router";
import {
    ApplicationApiService
} from '../_services/api.service';
let imgWidth;
let imgHeight;

@Component({
    selector: 'app-creative',
    templateUrl: './template/creatives.component.html',
    encapsulation: ViewEncapsulation.None,
})



@Injectable()
export class CreativesComponent implements OnInit, AfterViewInit {

    datasource: Creatives[];
    creatives: Creatives[];
    totalRecords: number;
    cols: any[];
    model: any = {};
    public pageName = "Upload Creatives";
    public creativeTypes = [];
    public selectedCreatives = null;
    public modalTitle: string;

    token = localStorage.getItem('_token');

    // banner form variables
    bannerCreativeName: string;
    bannerImagePreview: any = 'http://via.placeholder.com/300X200';
    bannerFileName: string = 'Choose banner image'
    bannerCreativeURL: string = '';
    bannerImage: File = null;

    // richmedia creative form variables
    richmediaCreativeName: string = '';
    richmediaCreativeCode: string = '';
    richMediaPreviewImage: string = 'http://via.placeholder.com/300X200';
    richMediaImage: any;
    richmediaCreativeWidth: string = '';
    richmediaCreativeHeight: string = '';
    richmediaClickURL: string;
    richMediaFileName: string = 'Choose banner image'
    secureCreative: any = 0;

    // native creative form variables
    nativeCreativeName: string = '';
    nativeCreativeTitle: string = '';
    nativeCreativeDescription: string = '';
    nativeCreativeMainPreview: string = "http://via.placeholder.com/320X50";
    nativeCreativeIcon: any = 'http://via.placeholder.com/58X58';
    currentRate: any;
    nativeCreativeURL: string = '';
    nativeCalltoAction: string = '';
    nativeCreativeMainPreviewFileName: string = 'Choose main image';
    nativeCreativeIconFileName: string = 'Choose icon image'

    nativeCreativeMainPreviewImg: any;
    nativeCreativeIconImg: any;

    tableCreativePreview: any;
    closeResult: string;
    loading = false;

    creativeType: any;
    creative_id: any;

    // model reference to open or close modal
    modalReference: any;

    //variables for filters
    creativeSizes: any = [];
    creativeStatus: any = [];
    creativeTypesForFilter = [];

    filterCreativeName: string;
    filterCreativeNameSize: string;
    filterCreativeStatus: string;
    filterCreativeTypes: string;

    constructor(
        private _script: ScriptLoaderService,
        private modalService: NgbModal,
        private cfr: ComponentFactoryResolver,
        private _uploadCreativeService: UploadCreativeService,
        config: NgbRatingConfig,
        private toastr: ToastrService,
        private _apis: ApplicationApiService,
        private http: Http,
        private router: Router) {
        config.max = 5;
        this.currentRate = 0;

    }
    ngOnInit() {
        const that = this;
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

        this.creativeTypes = [
            { id: 1, name: "Image Creatives" },
            { id: 2, name: "Richmedia Creatives" },
            //{ id: 3, name: "Video Creatives" },
            { id: 4, name: "Native Creatives" }
        ];

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
        this._uploadCreativeService.getCreatives(data, options).subscribe(
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
    ngAfterViewInit() {
        this._script.loadScripts('app-creative',
            ['assets/demo/demo2/custom/components/forms/widgets/bootstrap-select.js']);
        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');


    }

    clear() {
        // banner form variables
        this.bannerCreativeName = '';
        this.bannerImagePreview = 'http://via.placeholder.com/300X200';
        this.bannerFileName = 'Choose banner image';
        this.bannerCreativeURL = ''
        this.bannerImage = null;


        // richmedia creative form variables
        this.richmediaCreativeName = '';
        this.richmediaCreativeCode = '';
        this.richMediaPreviewImage = 'http://via.placeholder.com/300X200';
        this.richmediaCreativeWidth = '';
        this.richmediaCreativeHeight = '';
        this.richmediaClickURL = '';
        this.richMediaFileName = 'Choose banner image'

        // native creative form variables
        this.nativeCreativeName = '';
        this.nativeCreativeTitle = '';
        this.nativeCreativeDescription = '';
        this.nativeCreativeMainPreview = "http://via.placeholder.com/320X50";
        this.nativeCreativeIcon = 'http://via.placeholder.com/58X58';
        this.currentRate = 0;
        this.nativeCreativeURL = '';
        this.nativeCalltoAction = '';
        this.nativeCreativeMainPreviewFileName = 'Choose main image';
        this.nativeCreativeIconFileName = 'Choose icon image'


    }
    modalOpen(content) {
        if (this.selectedCreatives.id != '') {

            this.modalReference = this.modalService.open(content, { size: 'lg' });
            this.modalReference.result.then((result) => {

                this.closeResult = `Closed with: ${result}`;
                $('#creative_options').val("0").trigger("change");
            }, (reason) => {
                $('#creative_options').val("0").trigger("change");
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });


            CreativeValidations.init();
        }

    }

    onSelectFile(event: any) { // called each time file input changes
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            let file: File = event.target.files[0];
            this.bannerImage = event.target.files[0];
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event: any) => { // called once readAsDataURL is completed
                this.bannerImagePreview = event.target.result;
                this.bannerFileName = file.name;

            }
        }
    }

    onRichmediaSelectFile(event: any) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            var file = event.target.files[0];

            this.richMediaImage = file;

            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                var img = new Image();
                img.src = event.target.result;

                img.onload = function() {
                    imgWidth = (<HTMLInputElement>document.getElementById("richmediaCreativeWidth"));

                    imgHeight = (<HTMLInputElement>document.getElementById("richmediaCreativeHeight"));

                    imgWidth.value = img.width;
                    imgHeight.value = img.height;
                }
                this.richMediaPreviewImage = event.target.result;
                this.richMediaFileName = file.name;
            }
        }
    }
    onNativeMainImageUpload(event: any) { // called each time file input changes
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            var file = event.target.files[0];
            this.nativeCreativeMainPreviewImg = file;
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event: any) => { // called once readAsDataURL is completed
                this.nativeCreativeMainPreview = event.target.result;
                this.nativeCreativeMainPreviewFileName = file.name;
            }
        }
    }

    onNativeIconUpload(event: any) { // called each time file input changes
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            var file = event.target.files[0];

            this.nativeCreativeIconImg = file;

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event: any) => { // called once readAsDataURL is completed
                this.nativeCreativeIcon = event.target.result;
                this.nativeCreativeIconFileName = file.name;
            }
        }
    }


    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }

    }


    loadCreativesModel(content, s) {
        this.selectedCreatives = s;
        this.modalOpen(content);
    }

    viewCreativePreview(content, link) {
        this.tableCreativePreview = link;
        this.modalReference = this.modalService.open(content, {});
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
        this._uploadCreativeService.getCreatives(data, options).subscribe(
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

    editCreativeModel(content, id, type) {
        this.creativeType = type;
        this.creative_id = id;
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let data = {
            creative_id: id,
            type: type,
        };
        this.loading = true;
        this._uploadCreativeService.getCreativesData(data, options).subscribe(
            data => {
                if (data.status == 1200) {

                    if (type == 2) {
                        this.bannerCreativeName = data.response.creative_details.name;
                        this.bannerFileName = data.response.creative_details.image_link;
                        this.bannerCreativeURL = data.response.creative_details.click_url
                        this.bannerImagePreview = data.response.creative_details.image_link;
                        this.modalReference = this.modalService.open(content, { size: 'lg' });
                        this.modalReference.result.then((result) => {
                            this.closeResult = `Closed with: ${result}`;
                        }, (reason) => {
                            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                        });

                        this.loading = false;
                    }

                    if (type == 3) {
                        this.richmediaCreativeName = data.response.creative_details.name;
                        this.richmediaCreativeCode = data.response.creative_details.markup;
                        this.richMediaPreviewImage = data.response.creative_details.image_link;
                        this.richmediaCreativeWidth = data.response.creative_details.width;
                        this.richmediaCreativeHeight = data.response.creative_details.height;
                        this.richmediaClickURL = data.response.creative_details.click_url;
                        this.richMediaFileName = data.response.creative_details.image_link;
                        this.secureCreative = data.response.creative_details.secure;
                        //alert(this.secureCreative)
                        this.modalReference = this.modalService.open(content, { size: 'lg' });

                        this.modalReference.result.then((result) => {
                            this.closeResult = `Closed with: ${result}`;
                        }, (reason) => {
                            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                        });

                        this.loading = false;
                    }

                    if (type == 4) {
                        this.nativeCreativeName = data.response.creative_details.name;
                        this.nativeCreativeTitle = data.response.creative_details.title;
                        this.nativeCreativeDescription = data.response.creative_details.description;
                        this.currentRate = data.response.creative_details.rating;
                        this.nativeCreativeURL = data.response.creative_details.click_url;
                        this.nativeCalltoAction = data.response.creative_details.call_to_action;
                        this.nativeCreativeMainPreviewFileName = data.response.creative_details.main_image;
                        this.nativeCreativeIconFileName = data.response.creative_details.icon_image;
                        this.nativeCreativeIcon = data.response.creative_details.icon_image;
                        this.nativeCreativeMainPreview = data.response.creative_details.main_image;
                        this.modalReference = this.modalService.open(content, { size: 'lg' });
                        this.modalReference.result.then((result) => {
                            this.closeResult = `Closed with: ${result}`;
                        }, (reason) => {
                            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                        });

                        this.loading = false;
                    }


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

                this.loading = false;
            }
        );

    }

    uploadBannerCreative(event) {

        this.loading = true;
        let formData: FormData = new FormData();

        formData.append("name", this.bannerCreativeName);
        formData.append("click_url", this.bannerCreativeURL);
        formData.append("file", this.bannerImage, "test");

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        this._uploadCreativeService.uploadBannerCreative(formData, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative uploaded successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
                    this.clear();
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
                this.loading = false;
            }
        );
    }
    uploadRichmediaCreative() {

        this.loading = true;
        let formData: FormData = new FormData();
        formData.append("name", this.richmediaCreativeName);
        formData.append("click_url", this.richmediaClickURL);
        formData.append("file", this.richMediaImage);
        formData.append("width", (<HTMLInputElement>document.getElementById("richmediaCreativeWidth")).value);
        formData.append("height", (<HTMLInputElement>document.getElementById("richmediaCreativeHeight")).value);
        formData.append("code_snippet", this.richmediaCreativeCode);
        formData.append("secure", this.secureCreative);


        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        this._uploadCreativeService.uploadRichMediaCreative(formData, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative uploaded successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
                    this.clear();
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
                this.loading = false;
            }
        );

    }
    uploadNativeCreative() {
        this.loading = true;

        let formData: FormData = new FormData();
        formData.append("name", this.nativeCreativeName);
        formData.append("title", this.nativeCreativeTitle);
        formData.append("description", this.nativeCreativeDescription);
        formData.append("main_image", this.nativeCreativeMainPreviewImg);
        formData.append("icon_image", this.nativeCreativeIconImg);
        formData.append("rating", this.currentRate);
        formData.append("call_to_action", this.nativeCalltoAction);
        formData.append("click_url", this.nativeCreativeURL);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        this._uploadCreativeService.uploadNativeCreative(formData, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative uploaded successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
                    this.clear();
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
                this.loading = false;
            }
        );
    }

    uploadBannerCreativeEdit(event) {

        this.loading = true;
        let formData: FormData = new FormData();

        console.log(this.bannerImage);
        formData.append("name", this.bannerCreativeName);
        formData.append("click_url", this.bannerCreativeURL);
        formData.append("creative_id", this.creative_id);

        if (this.bannerImage != null) {
            formData.append("file", this.bannerImage, "test");
        }


        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        this._uploadCreativeService.uploadBannerCreativeEdit(formData, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative updated successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
                    this.clear();
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
                this.loading = false;
            }
        );
    }
    uploadRichmediaCreativeEdit() {

        this.loading = true;
        let formData: FormData = new FormData();
        formData.append("name", this.richmediaCreativeName);
        formData.append("click_url", this.richmediaClickURL);
        formData.append("creative_id", this.creative_id);
        formData.append("secure", this.secureCreative);

        if (this.richMediaImage != null) {
            formData.append("file", this.richMediaImage);
        }

        formData.append("width", (<HTMLInputElement>document.getElementById("richmediaCreativeWidth")).value);
        formData.append("height", (<HTMLInputElement>document.getElementById("richmediaCreativeHeight")).value);
        formData.append("code_snippet", this.richmediaCreativeCode);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        this._uploadCreativeService.uploadRichMediaCreativeEdit(formData, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative updated successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
                    this.clear();
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
                this.loading = false;
            }
        );

    }
    uploadNativeCreativeEdit() {
        this.loading = true;

        let formData: FormData = new FormData();
        formData.append("name", this.nativeCreativeName);
        formData.append("title", this.nativeCreativeTitle);
        formData.append("description", this.nativeCreativeDescription);
        formData.append("creative_id", this.creative_id);
        if (this.nativeCreativeMainPreviewImg != null) {
            formData.append("main_image", this.nativeCreativeMainPreviewImg);
        }

        if (this.nativeCreativeIconImg != null) {
            formData.append("icon_image", this.nativeCreativeIconImg);
        }

        formData.append("rating", this.currentRate);
        formData.append("call_to_action", this.nativeCalltoAction);
        formData.append("click_url", this.nativeCreativeURL);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        this._uploadCreativeService.uploadNativeCreativeEdit(formData, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative updated successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
                    this.clear();
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
                this.loading = false;
            }
        );
    }

    deleteUploadedCreatives(id) {
        this.loading = true;


        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let data = {
            creative_id: id
        }

        this._uploadCreativeService.deleteCreative(data, options).subscribe(
            data => {
                if (data.status == 1200) {
                    this.toastr.success('Creative deleted successfully', 'Success');
                    this.loading = false;
                    this.loadCreativeTable();
                    this.modalReference.close();
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
                this.loading = false;
            }
        );
    }

    loadCreativesLazy(event: LazyLoadEvent) {
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

        this._uploadCreativeService.getCreatives(data, options).subscribe(
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