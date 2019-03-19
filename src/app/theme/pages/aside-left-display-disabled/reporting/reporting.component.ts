import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

declare let mLayout: any;
@Component({
    selector: "app-reporting",
    templateUrl: "./reporting.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ReportingComponent implements OnInit, AfterViewInit {



    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        /*this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']); */

        Helpers.bodyClass('m-page--wide m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default');

    }

}