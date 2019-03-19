import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    ReportsComponent
} from './reports.component';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    BaseRequestOptions,
    HttpModule
} from '@angular/http';
import {
    LayoutModule
} from '../theme/layouts/layout.module';
import {
    BrowserModule
} from '@angular/platform-browser';
import {
    FormsModule
} from '@angular/forms';
import {
    AsideLeftDisplayDisabledComponent
} from '../theme/pages/aside-left-display-disabled/aside-left-display-disabled.component';
import {
    TableModule
} from 'primeng/table';
import {
    NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import {
    NgSelectModule
} from '@ng-select/ng-select';
import {
    ConfigService
} from '../_services/config.service';
import {
    SweetAlert2Module
} from '@toverux/ngx-sweetalert2';
import {
    ApplicationApiService
} from '../_services/api.service';
import {
    ScrollbarModule
} from 'ngx-scrollbar';
import {
    InfiniteScrollModule
} from 'angular2-infinite-scroll';
import {
    SearchFilterPipe
} from './filter.pipe';
import {
    JoinPipe
} from './join.pipe';
import {
    KeysPipe
} from './keys.pipe';

import {
    DynamicComponent
} from './dynamic.component'
import {
    Service
} from './service';
import * as moment from 'moment'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxDaterangepickerModule } from '@qqnc/ngx-daterangepicker';
import { HighchartsChartModule } from 'highcharts-angular';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
const routes: Routes = [{
    "path": "",
    "component": AsideLeftDisplayDisabledComponent,
    "children": [{
        "path": "",
        "component": ReportsComponent
    }]
}];

@NgModule({
    imports: [
        HttpModule,
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        FormsModule,
        NgbModule.forRoot(),
        TableModule,
        NgxDaterangepickerModule,
        NgSelectModule,
        ScrollbarModule,
        SweetAlert2Module.forRoot(),
        InfiniteScrollModule,
        NgxDaterangepickerMd,
        HighchartsChartModule,
        VirtualScrollerModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        ReportsComponent,
        SearchFilterPipe,
        JoinPipe,
        KeysPipe,
        DynamicComponent
    ],
    providers: [
        ConfigService,
        ApplicationApiService,
        Service
    ],
    entryComponents: [DynamicComponent]

})

export class ReportsModule { }