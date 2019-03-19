import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppInventoryComponent } from './inventory-new.component';
import { Routes, RouterModule } from '@angular/router';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { LayoutModule } from '../theme/layouts/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AsideLeftDisplayDisabledComponent } from '../theme/pages/aside-left-display-disabled/aside-left-display-disabled.component';
import { TableModule } from 'primeng/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigService } from '../_services/config.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ApplicationApiService } from '../_services/api.service';
import { ScrollbarModule } from 'ngx-scrollbar';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
const routes: Routes = [
    {
        "path": "",
        "component": AsideLeftDisplayDisabledComponent,
        "children": [
            {
                "path": "",
                "component": AppInventoryComponent
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
        ScrollbarModule,
        SweetAlert2Module.forRoot(),
        InfiniteScrollModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        AppInventoryComponent
    ],
    providers: [
        ConfigService,
        ApplicationApiService
    ],

})

export class AppInventoryModule { }
