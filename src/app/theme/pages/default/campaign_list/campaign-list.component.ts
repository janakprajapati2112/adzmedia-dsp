import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
    selector: "app-campaigns",
    templateUrl: "./campaignlist.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class CampaignListComponent implements OnInit, AfterViewInit {


    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        console.log("inside campaign list component")
        this._script.loadScripts('app-campaigns',
            ['assets/app/js/datatable-json.js']);
        console.log("after script code executed")
    }

}