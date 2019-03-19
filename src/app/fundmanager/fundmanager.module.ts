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
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { FundmanagerComponent } from './fundmanager.component';
import { StripeCheckoutModule } from 'ng-stripe-checkout';
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
                "component": FundmanagerComponent
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
        SweetAlert2Module.forRoot(),
        StripeCheckoutModule
    ],
    declarations: [
        FundmanagerComponent
    ],
    providers: [
        ApplicationApiService
    ]
})
export class FundmanagerModule { }
