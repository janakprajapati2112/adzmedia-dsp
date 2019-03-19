import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditcampaignComponent } from './editcampaign.component';
import { Routes, RouterModule } from '@angular/router';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { LayoutModule } from '../theme/layouts/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AsideLeftDisplayDisabledComponent } from '../theme/pages/aside-left-display-disabled/aside-left-display-disabled.component';
import { CampaignOperationsService } from './_services/campaignoperations.service';
import { TableModule } from 'primeng/table';
import { ArchwizardModule } from 'angular-archwizard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigService } from '../_services/config.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ApplicationApiService } from '../_services/api.service';

const routes: Routes = [
    {
        "path": "",
        "component": AsideLeftDisplayDisabledComponent,
        "children": [
            {
                "path": "",
                "component": EditcampaignComponent
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
        ArchwizardModule,
        NgbModule.forRoot(),
        TableModule,
        NgSelectModule,
        SweetAlert2Module.forRoot()
    ],
    exports: [
        RouterModule
    ],
    declarations: [EditcampaignComponent],
    providers: [
        CampaignOperationsService,
        ConfigService,
        ApplicationApiService
    ],
})
export class EditcampaignModule {
}
