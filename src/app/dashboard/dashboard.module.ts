import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { LayoutModule } from '../theme/layouts/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AsideLeftDisplayDisabledComponent } from '../theme/pages/aside-left-display-disabled/aside-left-display-disabled.component';
import { TableModule } from 'primeng/table'; // Here
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardComponent } from './dashboard.component';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import * as moment from 'moment'
import { HighchartsChartModule } from 'highcharts-angular';

import {
    ApplicationApiService
} from '../_services/api.service';


const routes: Routes = [
    {
        "path": "",
        "component": AsideLeftDisplayDisabledComponent,
        "children": [
            {
                "path": "",
                "component": DashboardComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        HttpModule,
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        FormsModule,
        NgbModule.forRoot(),
        TableModule,
        NgSelectModule,
        HighchartsChartModule,
        SweetAlert2Module.forRoot(),
    ],
    declarations: [DashboardComponent],
    providers: [
        ApplicationApiService
    ]
})
export class DashboardModule { }
