import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { ReportingComponent } from './theme/pages/aside-left-display-disabled/reporting/reporting.component';
import { ReportingModule } from './theme/pages/aside-left-display-disabled/reporting/reporting.module';
import { CreativesComponent } from './creatives/creatives.component';
import { CreativesModule } from './creatives/creatives.module';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { CampaignsModule } from './campaigns/campaigns.module';
import { InvoiceModule } from './fundmanager/invoice.module';


import { ToastrModule } from 'ngx-toastr';
import { ComponentComponent } from './component/component.component';


@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
        ComponentComponent
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        ReportingModule,
        CreativesModule,
        CampaignsModule,

        ToastrModule.forRoot(
            {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                preventDuplicates: true,
                tapToDismiss: true,
                enableHtml: true,
                closeButton: true,
                newestOnTop: true
            }
        )
    ],
    providers: [ScriptLoaderService],
    bootstrap: [AppComponent]
})
export class AppModule { }